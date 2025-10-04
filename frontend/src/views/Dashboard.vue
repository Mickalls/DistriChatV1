<template>
  <div class="dashboard-container">
    <el-container>
      <!-- 头部导航 -->
      <el-header class="dashboard-header">
        <div class="header-left">
          <h2>DistriChat</h2>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :src="userInfo?.avatar" :size="32">
                {{ userInfo?.nickname?.charAt(0) || 'U' }}
              </el-avatar>
              <span class="username">{{ userInfo?.nickname || '用户' }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人资料</el-dropdown-item>
                <el-dropdown-item command="settings">设置</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <!-- 主要内容区域 -->
      <el-main class="dashboard-main">
        <div class="welcome-section">
          <el-card class="welcome-card">
            <template #header>
              <div class="card-header">
                <span>欢迎使用 DistriChat</span>
              </div>
            </template>
            <div class="welcome-content">
              <p>您已成功登录到分布式聊天系统！</p>
              <p>用户ID: {{ userInfo?.id }}</p>
              <p>昵称: {{ userInfo?.nickname }}</p>
              <p>登录时间: {{ loginTime }}</p>
            </div>
          </el-card>
        </div>
        
        <!-- 功能区域 -->
        <div class="features-section">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <el-card class="feature-card" shadow="hover">
                <div class="feature-icon">
                  <el-icon size="40" color="#409eff"><ChatDotRound /></el-icon>
                </div>
                <h3>即时聊天</h3>
                <p>与好友实时聊天交流</p>
              </el-card>
            </el-col>
            
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <el-card class="feature-card" shadow="hover">
                <div class="feature-icon">
                  <el-icon size="40" color="#67c23a"><UserFilled /></el-icon>
                </div>
                <h3>用户管理</h3>
                <p>管理您的个人资料</p>
              </el-card>
            </el-col>
            
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <el-card class="feature-card" shadow="hover">
                <div class="feature-icon">
                  <el-icon size="40" color="#e6a23c"><Setting /></el-icon>
                </div>
                <h3>系统设置</h3>
                <p>个性化您的使用体验</p>
              </el-card>
            </el-col>
            
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <el-card class="feature-card" shadow="hover">
                <div class="feature-icon">
                  <el-icon size="40" color="#f56c6c"><DataAnalysis /></el-icon>
                </div>
                <h3>数据统计</h3>
                <p>查看使用数据和统计</p>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  ArrowDown, 
  ChatDotRound, 
  UserFilled, 
  Setting, 
  DataAnalysis 
} from '@element-plus/icons-vue'
import AuthService from '@/services/auth'

const router = useRouter()

// 用户信息
const userInfo = ref<any>(null)
const loginTime = ref<string>('')

/**
 * 初始化页面数据
 */
onMounted(() => {
  // 获取用户信息
  userInfo.value = AuthService.getCurrentUser()
  
  // 设置登录时间
  loginTime.value = new Date().toLocaleString()
})

/**
 * 处理下拉菜单命令
 */
const handleCommand = async (command: string) => {
  switch (command) {
    case 'profile':
      ElMessage.info('个人资料功能开发中...')
      break
    case 'settings':
      ElMessage.info('设置功能开发中...')
      break
    case 'logout':
      await handleLogout()
      break
  }
}

/**
 * 处理退出登录
 */
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要退出登录吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 清除认证信息
    AuthService.logout()
    
    ElMessage.success('已退出登录')
    
    // 跳转到登录页
    await router.push('/login')
    
  } catch (error) {
    // 用户取消操作
  }
}
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.dashboard-header {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-left h2 {
  margin: 0;
  color: #409eff;
  font-weight: 600;
}

.header-right .user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.header-right .user-info:hover {
  background-color: #f5f7fa;
}

.username {
  margin: 0 8px 0 12px;
  color: #333;
  font-weight: 500;
}

.dashboard-main {
  padding: 20px;
}

.welcome-section {
  margin-bottom: 30px;
}

.welcome-card {
  max-width: 600px;
}

.card-header {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.welcome-content {
  line-height: 1.8;
  color: #666;
}

.welcome-content p {
  margin: 8px 0;
}

.features-section .el-col {
  margin-bottom: 20px;
}

.feature-card {
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  margin-bottom: 15px;
}

.feature-card h3 {
  margin: 10px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.feature-card p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dashboard-header {
    padding: 0 15px;
  }
  
  .header-left h2 {
    font-size: 20px;
  }
  
  .username {
    display: none;
  }
  
  .dashboard-main {
    padding: 15px;
  }
}
</style>
