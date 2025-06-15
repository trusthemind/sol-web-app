import { AxiosRequestConfig } from "axios";
import { api, ParseResponse } from ".";
import { ProfileResponse, UpdatePasswordRequest, UpdateProfileRequest, UserData } from "../types/Api.type";

export interface AvatarUploadResponse {
  message: string;
  avatar: string;
  user: UserData;
}

export interface AvatarDeleteResponse {
  message: string;
  user: UserData;
}

export const userApi = {
  async getProfile(
    opt?: AxiosRequestConfig
  ): Promise<{ data: ProfileResponse }> {
    const res = await api.get("/users/profile", opt);
    return ParseResponse(res);
  },

  async updateProfile(
    req: UpdateProfileRequest,
    opt?: AxiosRequestConfig
  ): Promise<{ data: ProfileResponse }> {
    const res = await api.put("/users/profile", req, opt);
    return ParseResponse(res);
  },

  async updatePassword(
    req: UpdatePasswordRequest,
    opt?: AxiosRequestConfig
  ): Promise<{ data: any }> {
    const res = await api.put("/users/password", req, opt);
    return ParseResponse(res);
  },

  async deleteUser(
    id: string,
    opt?: AxiosRequestConfig
  ): Promise<{ data: any }> {
    const res = await api.delete(`/users/${id}`, opt);
    return ParseResponse(res);
  },

  async uploadAvatar(
    file: File,
    onUploadProgress?: (progressEvent: any) => void,
    opt?: AxiosRequestConfig
  ): Promise<{ data: AvatarUploadResponse }> {
    const formData = new FormData();
    formData.append('avatar', file);

    const config: AxiosRequestConfig = {
      ...opt,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...opt?.headers,
      },
      onUploadProgress,
    };

    const res = await api.post("/users/avatar", formData, config);
    return ParseResponse(res);
  },

  async updateAvatar(
    file: File,
    onUploadProgress?: (progressEvent: any) => void,
    opt?: AxiosRequestConfig
  ): Promise<{ data: AvatarUploadResponse }> {
    const formData = new FormData();
    formData.append('file', file);

    const config: AxiosRequestConfig = {
      ...opt,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...opt?.headers,
      },
      onUploadProgress,
    };

    const res = await api.put("/users/avatar", formData, config);
    return ParseResponse(res);
  },

  async deleteAvatar(
    opt?: AxiosRequestConfig
  ): Promise<{ data: AvatarDeleteResponse }> {
    const res = await api.delete("/users/avatar", opt);
    return ParseResponse(res);
  },
};
