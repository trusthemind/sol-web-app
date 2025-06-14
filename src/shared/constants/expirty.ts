import { AuthCookies } from "../types/Cookies.type";

const EXPIRY_DAYS = {
  [AuthCookies.AUTH_TOKEN]: 1 / 96,
  [AuthCookies.REFRESH_TOKEN]: 7,
  [AuthCookies.USER_SESSION]: 1,
};

export { EXPIRY_DAYS };
