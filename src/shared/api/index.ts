import axios, { AxiosResponse, AxiosError } from "axios";
import Cookies from "js-cookie";
import { AppRoutes } from "../constants/navigation";

enum AuthCookies {
  AUTH_TOKEN = "auth_token",
  REFRESH_TOKEN = "refresh_token",
}

export const getCookie = (name: string): string | undefined => {
  return Cookies.get(name);
};

export const setCookie = (name: string, value: string): void => {
  Cookies.set(name, value);
};

export const removeAllCookies = (): void => {
  Object.values(AuthCookies).forEach((c) => {
    Cookies.remove(c);
  });
};

interface Config {
  apiUrl: string;
  timeout: number;
  cookiePrefix: string;
}

export const ParseResponse = <T>(res: AxiosResponse<T>) => {
  const { data, status, headers } = res;
  return { data, status, headers };
};

const getConfig = (): Config => {
  const env = process.env.NEXT_PUBLIC_CLIENT_APP_ENV || "development";

  return {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    timeout: 10000,
    cookiePrefix: env === "production" ? "sol_auth" : `${env}_sol_auth`,
  };
};

const config = getConfig();

export const api = axios.create({
  baseURL: config.apiUrl,
  timeout: config.timeout,
  withCredentials: process.env.NEXT_PUBLIC_CLIENT_APP_ENV !== "development",
  headers: {
    "Content-Type": "application/json",
  },
});

let isRedirecting = false;

api.interceptors.request.use(
  (request) => {
    const token = getCookie(AuthCookies.AUTH_TOKEN);
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }

    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    const newToken = response.headers["x-new-token"];
    if (newToken) {
      setCookie(AuthCookies.AUTH_TOKEN, newToken);
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        const refreshToken = getCookie(AuthCookies.REFRESH_TOKEN);

        if (refreshToken && !isRedirecting) {
          try {
            const response = await axios.post(
              `${config.apiUrl}/auth/refresh`,
              {},
              {
                headers: { Authorization: `Bearer ${refreshToken}` },
                withCredentials:
                  process.env.NEXT_PUBLIC_CLIENT_APP_ENV !== "development",
              }
            );

            const newToken = response.data.accessToken;
            const newRefreshToken = response.data.refreshToken;

            setCookie(AuthCookies.AUTH_TOKEN, newToken);
            if (newRefreshToken)
              setCookie(AuthCookies.REFRESH_TOKEN, newRefreshToken);

            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          } catch (_) {
            handleAuthRedirect();
          }
        } else handleAuthRedirect();
      } else handleAuthRedirect();
    }

    return Promise.reject(error);
  }
);

function handleAuthRedirect() {
  if (!isRedirecting) {
    isRedirecting = true;

    removeAllCookies();

    const locale = Cookies.get("locale") || "en";
    window.dispatchEvent(
      new CustomEvent("unauthorized", { detail: { status: 401 } })
    );

    const loginUrl = `/${locale}${AppRoutes.AUTH}`;
    window.location.replace(loginUrl);
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    isRedirecting = false;
  });
}

export const authHelpers = {
  isAuthenticated: () => !!getCookie(AuthCookies.AUTH_TOKEN),
  logout: () => {
    removeAllCookies();
    const locale = Cookies.get("locale") || "en";
    window.location.replace(`/${locale}${AppRoutes.AUTH}`);
  },
  getAuthToken: () => getCookie(AuthCookies.AUTH_TOKEN),
  getRefreshToken: () => getCookie(AuthCookies.REFRESH_TOKEN),
};
