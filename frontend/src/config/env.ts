/**
 * 环境配置管理
 * 统一管理所有环境相关的配置信息
 * 
 * ⭐ 重要说明：
 * - 前端代码通过 Vite 代理访问后端，访问路径为 /api
 * - Vite 代理会将 /api 请求转发到实际的后端地址
 * - 只需要修改一个地方：backendConfig 的 host 和 port
 */

// 环境类型
export type EnvType = 'development' | 'production'

// 获取当前环境
export const getEnv = (): EnvType => {
  return (import.meta.env.MODE as EnvType) || 'development'
}

// 判断是否为生产环境
export const isProduction = (): boolean => {
  return getEnv() === 'production'
}

// 判断是否为开发环境
export const isDevelopment = (): boolean => {
  return getEnv() === 'development'
}

/**
 * 后端服务配置
 * ⭐ 所有配置从环境变量读取，无硬编码
 * 
 * 说明：
 * - 开发环境：Vite 代理会将前端的 /api 请求转发到这里配置的地址
 * - 生产环境：这个配置不会被使用（生产环境通过 nginx 代理）
 * - 配置文件：.env.development 或 .env.local
 */
export const backendConfig = {
  // 后端服务器地址和端口（从环境变量读取）
  host: import.meta.env.VITE_BACKEND_HOST as string,
  port: Number(import.meta.env.VITE_BACKEND_PORT),
  
  // 完整的后端地址（自动生成）
  get url() {
    return `http://${this.host}:${this.port}`
  }
}

/**
 * API配置
 * ⚠️ 注意：使用 Vite 代理模式时，前端代码始终访问 /api
 * 
 * 工作原理：
 * 1. 前端代码访问：/api/auth/login
 * 2. Vite 代理转发到：http://localhost:38080/api/auth/login
 */
export const apiConfig = {
  // 前端代码访问的基础路径
  baseURL: '/api',
  
  // 请求超时时间（从环境变量读取）
  timeout: Number(import.meta.env.VITE_API_TIMEOUT)
}

// 导出配置摘要（用于调试）
export const getConfigSummary = () => {
  return {
    environment: getEnv(),
    frontendAccessPath: apiConfig.baseURL,  // 前端访问路径
    backendActualURL: backendConfig.url,     // 后端实际地址
    apiTimeout: apiConfig.timeout,
    proxyEnabled: isDevelopment() ? 'Yes (by Vite)' : 'No (by Nginx)'
  }
}

// 开发环境下打印配置信息
if (isDevelopment()) {
  console.log('📋 前端配置信息:')
  console.log('  - 前端访问路径:', apiConfig.baseURL)
  console.log('  - 后端实际地址:', backendConfig.url)
  console.log('  - 代理说明: Vite 会自动将', apiConfig.baseURL, '的请求转发到', backendConfig.url)
}
