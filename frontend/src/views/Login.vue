<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>欢迎登录</h2>
        <p>DistriChat 分布式聊天系统</p>
      </div>
      
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        size="large"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="phone">
          <el-input
            v-model="loginForm.phone"
            placeholder="请输入手机号"
            prefix-icon="Phone"
            clearable
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
            clearable
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            class="login-button"
            :loading="loading"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="login-footer">
        <span>还没有账号？</span>
        <el-link type="primary" @click="goToRegister">立即注册</el-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElForm } from 'element-plus'
import AuthService, { UserLoginRequest } from '../services/auth'

const router = useRouter()
const route = useRoute()

// 表单引用
const loginFormRef = ref<InstanceType<typeof ElForm>>()

// 加载状态
const loading = ref(false)

// 登录表单数据
const loginForm = reactive<UserLoginRequest>({
  phone: '',
  password: ''
})

// 表单验证规则
const loginRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' }
    // 测试环境：已简化验证规则
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
    // 测试环境：已简化验证规则
  ]
}

/**
 * 处理登录
 */
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    // 表单验证
    await loginFormRef.value.validate()
    
    loading.value = true
    
    // 调用登录接口
    await AuthService.login(loginForm)
    
    ElMessage.success('登录成功！')
    
    // 登录成功后跳转
    const redirectPath = (route.query.redirect as string) || '/dashboard'
    await router.push(redirectPath)
    
  } catch (error: any) {
    console.error('登录失败:', error)
    
    // 如果是表单验证错误，不显示额外消息
    if (error.message && !error.message.includes('validation')) {
      ElMessage.error(error.message || '登录失败，请检查用户名和密码')
    }
  } finally {
    loading.value = false
  }
}

/**
 * 跳转到注册页面
 */
const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 40px 30px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  color: #333;
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
}

.login-header p {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.login-form {
  margin-bottom: 20px;
}

.login-form .el-form-item {
  margin-bottom: 20px;
}

.login-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
}

.login-footer {
  text-align: center;
  color: #666;
  font-size: 14px;
}

.login-footer .el-link {
  margin-left: 5px;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-container {
    padding: 10px;
  }
  
  .login-card {
    padding: 30px 20px;
  }
  
  .login-header h2 {
    font-size: 24px;
  }
}
</style>
