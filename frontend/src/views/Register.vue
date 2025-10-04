<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h2>欢迎注册</h2>
        <p>加入 DistriChat 分布式聊天系统</p>
      </div>
      
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        class="register-form"
        size="large"
        @submit.prevent="handleRegister"
      >
        <el-form-item prop="phone">
          <el-input
            v-model="registerForm.phone"
            placeholder="请输入手机号"
            prefix-icon="Phone"
            clearable
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
            clearable
          />
        </el-form-item>
        
        <el-form-item prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请确认密码"
            prefix-icon="Lock"
            show-password
            clearable
          />
        </el-form-item>
        
        <el-form-item prop="agreement">
          <el-checkbox v-model="registerForm.agreement">
            我已阅读并同意
            <el-link type="primary" @click="showAgreement">《用户协议》</el-link>
            和
            <el-link type="primary" @click="showPrivacy">《隐私政策》</el-link>
          </el-checkbox>
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            class="register-button"
            :loading="loading"
            @click="handleRegister"
          >
            {{ loading ? '注册中...' : '注册' }}
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="register-footer">
        <span>已有账号？</span>
        <el-link type="primary" @click="goToLogin">立即登录</el-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElForm, ElMessageBox } from 'element-plus'
import AuthService, { UserRegisterRequest } from '../services/auth'

const router = useRouter()

// 表单引用
const registerFormRef = ref<InstanceType<typeof ElForm>>()

// 加载状态
const loading = ref(false)

// 注册表单数据
const registerForm = reactive({
  phone: '',
  password: '',
  confirmPassword: '',
  agreement: false
})

// 自定义验证函数
const validateConfirmPassword = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请确认密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const validateAgreement = (_rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('请阅读并同意用户协议和隐私政策'))
  } else {
    callback()
  }
}

// 表单验证规则
const registerRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' }
    // 测试环境：已简化手机号验证，生产环境建议恢复格式验证
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 1, message: '密码不能为空', trigger: 'blur' }
    // 测试环境：已简化密码规则，生产环境建议恢复复杂度要求
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ],
  agreement: [
    { required: true, validator: validateAgreement, trigger: 'change' }
  ]
}

/**
 * 处理注册
 */
const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  try {
    // 表单验证
    await registerFormRef.value.validate()
    
    loading.value = true
    
    // 构建注册请求数据
    const registerData: UserRegisterRequest = {
      phone: registerForm.phone,
      password: registerForm.password
    }
    
    // 调用注册接口
    await AuthService.register(registerData)
    
    ElMessage.success('注册成功！正在跳转到首页...')
    
    // 注册成功后跳转到首页
    setTimeout(() => {
      router.push('/dashboard')
    }, 1500)
    
  } catch (error: any) {
    console.error('注册失败:', error)
    
    // 如果是表单验证错误，不显示额外消息
    if (error.message && !error.message.includes('validation')) {
      ElMessage.error(error.message || '注册失败，请稍后重试')
    }
  } finally {
    loading.value = false
  }
}

/**
 * 跳转到登录页面
 */
const goToLogin = () => {
  router.push('/login')
}

/**
 * 显示用户协议
 */
const showAgreement = () => {
  ElMessageBox.alert(
    '这里是用户协议的内容。在实际项目中，您应该提供完整的用户协议文本。',
    '用户协议',
    {
      confirmButtonText: '我知道了',
      type: 'info'
    }
  )
}

/**
 * 显示隐私政策
 */
const showPrivacy = () => {
  ElMessageBox.alert(
    '这里是隐私政策的内容。在实际项目中，您应该提供完整的隐私政策文本。',
    '隐私政策',
    {
      confirmButtonText: '我知道了',
      type: 'info'
    }
  )
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-card {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 40px 30px;
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h2 {
  color: #333;
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
}

.register-header p {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.register-form {
  margin-bottom: 20px;
}

.register-form .el-form-item {
  margin-bottom: 20px;
}

.register-form .el-form-item:last-of-type {
  margin-bottom: 0;
}

.register-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
}

.register-footer {
  text-align: center;
  color: #666;
  font-size: 14px;
}

.register-footer .el-link {
  margin-left: 5px;
  font-weight: 500;
}

/* 协议相关样式 */
.register-form .el-checkbox {
  line-height: 1.5;
}

.register-form .el-checkbox .el-link {
  margin: 0 2px;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .register-container {
    padding: 10px;
  }
  
  .register-card {
    padding: 30px 20px;
  }
  
  .register-header h2 {
    font-size: 24px;
  }
}
</style>
