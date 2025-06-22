import { AxiosRequestConfig } from "axios";
import { api, ParseResponse } from ".";
import {
  ProfileResponse,
  UpdatePasswordRequest,
  UpdateProfileRequest,
  UserData,
} from "../types/Api.type";

export interface AvatarUploadResponse {
  message: string;
  avatar: string;
  user: UserData;
}

export interface AvatarDeleteResponse {
  message: string;
  user: UserData;
}

export interface GetAllUsersResponse {
  message: string;
  users: UserData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface GetUserByIdResponse {
  message: string;
  user: UserData;
}

export interface DeleteUserResponse {
  message: string;
}

export interface GetAllUsersParams {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
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
    formData.append("avatar", file);

    const config: AxiosRequestConfig = {
      ...opt,
      headers: {
        "Content-Type": "multipart/form-data",
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
    formData.append("file", file);

    const config: AxiosRequestConfig = {
      ...opt,
      headers: {
        "Content-Type": "multipart/form-data",
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

  admin: {
    async getAllUsers(
      params?: GetAllUsersParams,
      opt?: AxiosRequestConfig
    ): Promise<{ data: GetAllUsersResponse }> {
      const config: AxiosRequestConfig = {
        ...opt,
        params: {
          ...params,
          ...opt?.params,
        },
      };

      const res = await api.get("/admin/users", config);
      console.log(res);
      return ParseResponse(res);
    },

    async getUserById(
      id: string,
      opt?: AxiosRequestConfig
    ): Promise<{ data: GetUserByIdResponse }> {
      const res = await api.get(`/admin/users/${id}`, opt);
      return ParseResponse(res);
    },

    async deleteUser(
      id: string,
      opt?: AxiosRequestConfig
    ): Promise<{ data: DeleteUserResponse }> {
      const res = await api.delete(`/admin/users/${id}`, opt);
      return ParseResponse(res);
    },
  },
};
