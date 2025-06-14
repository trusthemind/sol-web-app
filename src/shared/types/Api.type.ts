export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export enum UserRole {
  PATIENT = "PATIENT",
  DOCTOR = "DOCTOR",
  ADMIN = "ADMIN",
}

export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  healthId?: string;
  sinceForm?: string;
}

export type UserPublic = Omit<UserData, "healthId" | "email">;

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  email?: string;
  phone?: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ProfileResponse extends ApiResponse {
  user: UserData;
}

export interface AvatarUploadRequest {
  avatar: File;
}

export interface AvatarUploadResponse extends ApiResponse {
  avatar: string;
  user: UserData;
}

export interface AvatarDeleteResponse extends ApiResponse {
  user: UserData;
}

export interface AvatarUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface AvatarValidationConfig {
  maxSize: number;
  allowedTypes: string[];
  maxWidth?: number;
  maxHeight?: number;
}
