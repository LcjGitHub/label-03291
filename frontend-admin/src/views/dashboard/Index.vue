<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { customerApi } from '@/api/customer'
import { User, UserFilled, TrendCharts, Warning, ArrowRight } from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()
const customerList = ref([])

onMounted(async () => {
  const res = await customerApi.getList({ page: 1, pageSize: 9999 })
  if (res.code === 200) customerList.value = res.data?.list || []
})

const totalCustomers = computed(() => customerList.value.length)
const activeCustomers = computed(() => customerList.value.filter((c) => c.status === 1).length)
const vipCustomers = computed(() => customerList.value.filter((c) => c.level === 'vip').length)
const potentialCustomers = computed(() => customerList.value.filter((c) => c.level === 'potential').length)

const statCards = computed(() => [
  {
    title: '客户总数',
    value: totalCustomers.value,
    unit: '人',
    icon: UserFilled,
    color: '#409EFF',
    bgColor: 'rgba(64, 158, 255, 0.1)',
    trend: '+12%',
    desc: '较上月'
  },
  {
    title: '活跃客户',
    value: activeCustomers.value,
    unit: '人',
    icon: User,
    color: '#67C23A',
    bgColor: 'rgba(103, 194, 58, 0.1)',
    trend: '+8%',
    desc: '较上月'
  },
  {
    title: 'VIP 客户',
    value: vipCustomers.value,
    unit: '人',
    icon: TrendCharts,
    color: '#E6A23C',
    bgColor: 'rgba(230, 162, 60, 0.1)',
    trend: '+3%',
    desc: '较上月'
  },
  {
    title: '潜在客户',
    value: potentialCustomers.value,
    unit: '人',
    icon: Warning,
    color: '#F56C6C',
    bgColor: 'rgba(245, 108, 108, 0.1)',
    trend: '+5%',
    desc: '较上月'
  }
])

const levelMap = { vip: { label: 'VIP', type: 'warning' }, normal: { label: '普通', type: 'info' }, potential: { label: '潜在', type: 'success' } }
const statusMap = { 1: { label: '活跃', type: 'success' }, 0: { label: '停用', type: 'danger' } }

const recentCustomers = computed(() =>
  [...customerList.value]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5)
)

const industryStats = computed(() => {
  const list = customerList.value
  if (!list.length) return []
  const map = {}
  list.forEach((c) => {
    map[c.industry] = (map[c.industry] || 0) + 1
  })
  return Object.entries(map)
    .map(([name, count]) => ({ name, count, percent: Math.round((count / list.length) * 100) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
})

const industryColors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399']

</script>

<template>
  <div class="dashboard">
    <!-- 欢迎栏 -->
    <div class="welcome-bar">
      <div class="welcome-bar__left">
        <el-avatar :size="48" :src="authStore.userAvatar" class="welcome-avatar" />
        <div>
          <p class="welcome-greeting">你好，{{ authStore.userName }} 👋</p>
          <p class="welcome-date">{{ new Date().toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
        </div>
      </div>
      <el-button type="primary" plain @click="router.push('/customer')">
        管理客户 <el-icon class="el-icon--right"><ArrowRight /></el-icon>
      </el-button>
    </div>

    <!-- 统计卡片 -->
    <div class="stat-grid">
      <div
        v-for="(card, idx) in statCards"
        :key="idx"
        class="stat-card"
        :style="{ '--card-color': card.color }"
      >
        <div class="stat-card__icon" :style="{ background: card.bgColor }">
          <el-icon :size="24" :color="card.color"><component :is="card.icon" /></el-icon>
        </div>
        <div class="stat-card__info">
          <p class="stat-card__label">{{ card.title }}</p>
          <p class="stat-card__value">{{ card.value }}<span class="stat-card__unit">{{ card.unit }}</span></p>
          <p class="stat-card__trend">
            <span class="trend-up">{{ card.trend }}</span>
            {{ card.desc }}
          </p>
        </div>
      </div>
    </div>

    <!-- 下方两栏 -->
    <div class="bottom-grid">
      <!-- 行业分布 -->
      <div class="page-card">
        <div class="page-header">
          <div class="page-title"><div class="title-icon" />行业分布</div>
        </div>
        <div class="industry-list">
          <div
            v-for="(item, idx) in industryStats"
            :key="item.name"
            class="industry-item"
          >
            <div class="industry-item__header">
              <span class="industry-name">{{ item.name }}</span>
              <span class="industry-count">{{ item.count }} 家 · {{ item.percent }}%</span>
            </div>
            <el-progress
              :percentage="item.percent"
              :color="industryColors[idx]"
              :show-text="false"
              :stroke-width="8"
            />
          </div>
        </div>
      </div>

      <!-- 最新客户 -->
      <div class="page-card">
        <div class="page-header">
          <div class="page-title"><div class="title-icon" />最新客户</div>
          <el-button text type="primary" size="small" @click="router.push('/customer')">
            查看全部 <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
        <div class="recent-list">
          <div
            v-for="customer in recentCustomers"
            :key="customer.id"
            class="recent-item"
          >
            <el-avatar :size="38" :src="customer.avatar" />
            <div class="recent-item__info">
              <p class="customer-name">{{ customer.name }}</p>
              <p class="customer-company">{{ customer.company }}</p>
            </div>
            <div class="recent-item__tags">
              <el-tag :type="levelMap[customer.level]?.type" size="small">
                {{ levelMap[customer.level]?.label }}
              </el-tag>
              <el-tag :type="statusMap[customer.status]?.type" size="small" effect="plain">
                {{ statusMap[customer.status]?.label }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

// 欢迎栏
.welcome-bar {
  background: linear-gradient(135deg, #1a237e 0%, #1565c0 100%);
  border-radius: $border-radius-lg;
  padding: $spacing-lg $spacing-xl;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: $shadow-card;

  &__left {
    display: flex;
    align-items: center;
    gap: $spacing-md;
  }
}

.welcome-avatar {
  border: 3px solid rgba(255, 255, 255, 0.4);
}

.welcome-greeting {
  font-size: $font-size-lg;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
}

.welcome-date {
  font-size: $font-size-sm;
  color: rgba(255, 255, 255, 0.7);
}

// 统计卡片网格
.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-md;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
}

.stat-card {
  background: $bg-card;
  border-radius: $border-radius;
  box-shadow: $shadow-card;
  padding: $spacing-lg;
  display: flex;
  gap: $spacing-md;
  align-items: center;
  transition: all 0.3s;
  border-left: 4px solid var(--card-color);

  &:hover {
    box-shadow: $shadow-hover;
    transform: translateY(-2px);
  }

  &__icon {
    width: 56px;
    height: 56px;
    border-radius: $border-radius;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__info { flex: 1; }

  &__label {
    font-size: $font-size-sm;
    color: $text-secondary;
    margin-bottom: 4px;
  }

  &__value {
    font-size: 28px;
    font-weight: 700;
    color: $text-primary;
    line-height: 1;
    margin-bottom: 6px;
  }

  &__unit {
    font-size: $font-size-sm;
    font-weight: 400;
    color: $text-secondary;
    margin-left: 2px;
  }

  &__trend {
    font-size: $font-size-xs;
    color: $text-secondary;
  }
}

.trend-up {
  color: $success-color;
  font-weight: 600;
}

// 下方两栏
.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-lg;

  @media (max-width: 800px) { grid-template-columns: 1fr; }
}

// 行业分布
.industry-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.industry-item {
  &__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: $spacing-xs;
  }
}

.industry-name {
  font-size: $font-size-base;
  color: $text-regular;
  font-weight: 500;
}

.industry-count {
  font-size: $font-size-sm;
  color: $text-secondary;
}

// 最新客户
.recent-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-sm 0;
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.2s;

  &:last-child { border-bottom: none; }

  &:hover { background: #fafafa; border-radius: $border-radius-sm; }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__tags {
    display: flex;
    gap: $spacing-xs;
  }
}

.customer-name {
  font-size: $font-size-base;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 2px;
}

.customer-company {
  font-size: $font-size-xs;
  color: $text-secondary;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
