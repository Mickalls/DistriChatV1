import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  // 从环境变量构建后端地址（无硬编码）
  const backendHost = env.VITE_BACKEND_HOST
  const backendPort = env.VITE_BACKEND_PORT
  const backendURL = `http://${backendHost}:${backendPort}`
  
  return {
    plugins: [vue()],
    
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    
    server: {
      port: 5173,
      // 开发环境代理配置
      // 将 /api 开头的请求直接代理到后端服务器（不重写路径）
      proxy: {
        '/api': {
          target: backendURL,
          changeOrigin: true
          // 不需要 rewrite，直接透传路径
        }
      }
    }
  }
})
