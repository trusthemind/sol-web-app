import { AxiosRequestConfig } from "axios";
import { api, ParseResponse } from ".";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
}

type ResponseUserData = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role: string;
};

export interface UserDataResponse {
  token: string;
  user: ResponseUserData;
}
export const AuthApi = {
  async login(
    req: LoginRequest,
    opt?: AxiosRequestConfig
  ): Promise<{ data: UserDataResponse }> {
    const res = await api.post("/auth/login", req, opt);

    return ParseResponse(res);
  },

  async registration(
    req: SignupRequest,
    opt?: AxiosRequestConfig
  ): Promise<{ data: UserDataResponse }> {
    const res = await api.post("/auth/registration", req, opt);

    return ParseResponse(res);
  },
};
