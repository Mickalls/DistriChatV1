import http from './http'

// 用户注册请求接口
export interface UserRegisterRequest {
  phone: string
  password: string
}

// 用户登录请求接口
export interface UserLoginRequest {
  phone: string
  password: string
}

// 用户认证响应接口
export interface UserAuthResponse {
  id: number
  accessToken: string
  clientId: string
  nickname: string
  avatar: string
}

// API 响应结构
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
}

/**
 * 认证服务类
 */
export class AuthService {
  
  /**
   * 用户注册
   * @param registerData 注册数据
   */
  static async register(registerData: UserRegisterRequest): Promise<UserAuthResponse> {
    const response: ApiResponse<UserAuthResponse> = await http.post('/auth/register', registerData)
    
    // 注册成功后保存认证信息
    if (response.success && response.data) {
      this.saveAuthInfo(response.data)
    }
    
    return response.data
  }

  /**
   * 用户登录
   * @param loginData 登录数据
   */
  static async login(loginData: UserLoginRequest): Promise<UserAuthResponse> {
    const response: ApiResponse<UserAuthResponse> = await http.post('/auth/login', loginData)
    
    // 登录成功后保存认证信息
    if (response.success && response.data) {
      this.saveAuthInfo(response.data)
    }
    
    return response.data
  }

  /**
   * 保存认证信息到本地存储
   * @param authData 认证数据
   */
  static saveAuthInfo(authData: UserAuthResponse): void {
    localStorage.setItem('accessToken', authData.accessToken)
    localStorage.setItem('clientId', authData.clientId)
    localStorage.setItem('userInfo', JSON.stringify({
      id: authData.id,
      nickname: authData.nickname,
      avatar: authData.avatar
    }))
  }

  /**
   * 获取当前用户信息
   */
  static getCurrentUser(): any {
    const userInfo = localStorage.getItem('userInfo')
    return userInfo ? JSON.parse(userInfo) : null
  }

  /**
   * 获取访问令牌
   */
  static getAccessToken(): string | null {
    return localStorage.getItem('accessToken')
  }

  /**
   * 检查是否已登录
   */
  static isLoggedIn(): boolean {
    return !!this.getAccessToken()
  }

  /**
   * 退出登录
   */
  static logout(): void {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('clientId')
    localStorage.removeItem('userInfo')
  }
}

export default AuthService
