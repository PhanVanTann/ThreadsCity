import axiosInstance from "../axiosInstance";
import axios from "axios";


export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  success: boolean
  message: string
  token?: string
  user_id?: string
}

export interface SignUpRequest {
  first_name: string
  last_name: string
  email: string
  password: string
}
export const authService = {
  SignIn: async (body: LoginRequest) => await axiosInstance.post<LoginResponse>('/auth/login/', body,  {
        withCredentials: true, // Cho phép gửi & nhận cookie
      }),
    SignUp: async (body: SignUpRequest) => await axiosInstance.post('/users/', body),
}