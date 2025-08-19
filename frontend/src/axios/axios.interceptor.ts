import axios from 'axios'
import { store } from '../redux/store'
import { loginSuccess, logoutSuccess } from '../redux/slice/authSlice'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
})

const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/v1/auth/refresh-token`,
      {},
      { withCredentials: true }
    )
    console.log('Refresh Token Response:', response)
    return response.data
  } catch (error) {
    console.error('Refresh token failed', error)
    return null
  }
}

// Thêm response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('Axios Interceptor Error:', error)

    const originalRequest = error.config
    console.log('Original Request:', originalRequest._retry)
    // Kiểm tra nếu lỗi 401 và chưa thử refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true // Đánh dấu đã retry 1 lần

      try {
        const res = await refreshAccessToken()
        store.dispatch(loginSuccess(res))
        return axiosInstance(originalRequest)
      } catch (error) {
        console.log('Token expired, logging out...', error)
        store.dispatch(logoutSuccess())

        // Chỉ chuyển hướng 1 lần, tránh lặp vô hạn
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  }
)
export default axiosInstance
