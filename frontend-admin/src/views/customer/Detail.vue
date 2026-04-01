<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCustomerStore } from '@/stores/customer'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft, Edit, UserFilled, Phone, Message, OfficeBuilding,
  Location, Calendar, ChatDotRound
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const store = useCustomerStore()

const customer = ref(null)

const levelMap = {
  vip: { label: 'VIP', type: 'warning' },
  normal: { label: '普通', type: 'info' },
  potential: { label: '潜在', type: 'success' }
}

async function fetchCustomerDetail() {
  const id = Number(route.params.id)
  if (!id) {
    ElMessage.error('无效的客户ID')
    router.back()
    return
  }
  const data = await store.fetchDetail(id)
  if (!data) {
    ElMessage.error('客户不存在')
    router.back()
    return
  }
  customer.value = data
}

function goBack() {
  router.back()
}

function goEdit() {
  router.push({ name: 'Customer' })
}

onMounted(() => {
  fetchCustomerDetail()
})
</script>

<template>
  <div class="customer-detail">
    <div class="page-header">
      <div class="header-left">
        <el-button :icon="ArrowLeft" @click="goBack">返回列表</el-button>
      </div>
      <div class="header-right">
        <el-button type="primary" :icon="Edit" @click="goEdit">编辑客户</el-button>
      </div>
    </div>

    <div v-loading="store.loading" class="detail-content">
      <div v-if="customer" class="detail-card page-card">
        <div class="card-header">
          <div class="customer-info">
            <el-avatar :size="80" :src="customer.avatar" />
            <div class="info-text">
              <h2 class="customer-name">{{ customer.name }}</h2>
              <div class="customer-tags">
                <el-tag :type="levelMap[customer.level]?.type" size="large">
                  {{ levelMap[customer.level]?.label }}
                </el-tag>
                <el-tag :type="customer.status === 1 ? 'success' : 'danger'" size="large" effect="light">
                  {{ customer.status === 1 ? '活跃' : '停用' }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>

        <el-divider />

        <div class="card-body">
          <el-row :gutter="40">
            <el-col :span="12">
              <div class="info-item">
                <div class="info-label">
                  <el-icon><UserFilled /></el-icon>
                  客户姓名
                </div>
                <div class="info-value">{{ customer.name }}</div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <div class="info-label">
                  <el-icon><Phone /></el-icon>
                  手机号码
                </div>
                <div class="info-value">{{ customer.phone }}</div>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="40">
            <el-col :span="12">
              <div class="info-item">
                <div class="info-label">
                  <el-icon><Message /></el-icon>
                  电子邮箱
                </div>
                <div class="info-value">{{ customer.email || '—' }}</div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <div class="info-label">
                  <el-icon><OfficeBuilding /></el-icon>
                  公司名称
                </div>
                <div class="info-value">{{ customer.company }}</div>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="40">
            <el-col :span="12">
              <div class="info-item">
                <div class="info-label">所属行业</div>
                <div class="info-value">
                  <el-tag type="info" effect="plain">{{ customer.industry || '—' }}</el-tag>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <div class="info-label">
                  <el-icon><Location /></el-icon>
                  所在地区
                </div>
                <div class="info-value">{{ customer.address || '—' }}</div>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="40">
            <el-col :span="12">
              <div class="info-item">
                <div class="info-label">
                  <el-icon><Calendar /></el-icon>
                  创建时间
                </div>
                <div class="info-value">{{ customer.createTime }}</div>
              </div>
            </el-col>
          </el-row>

          <el-divider />

          <div class="info-item">
            <div class="info-label">
              <el-icon><ChatDotRound /></el-icon>
              备注信息
            </div>
            <div class="info-value remark-value">{{ customer.remark || '暂无备注' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.customer-detail {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-content {
  flex: 1;
}

.detail-card {
  padding: $spacing-xl;
}

.card-header {
  .customer-info {
    display: flex;
    align-items: center;
    gap: $spacing-lg;
  }

  .info-text {
    .customer-name {
      font-size: 24px;
      font-weight: 600;
      color: $text-primary;
      margin: 0 0 $spacing-sm 0;
    }

    .customer-tags {
      display: flex;
      gap: $spacing-sm;
    }
  }
}

.card-body {
  padding-top: $spacing-md;
}

.info-item {
  margin-bottom: $spacing-xl;

  &:last-child {
    margin-bottom: 0;
  }

  .info-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: $font-size-sm;
    color: $text-secondary;
    margin-bottom: $spacing-xs;
  }

  .info-value {
    font-size: $font-size-base;
    color: $text-primary;
    font-weight: 500;

    &.remark-value {
      font-weight: 400;
      color: $text-regular;
      line-height: 1.6;
      padding: $spacing-md;
      background: $bg-page;
      border-radius: 4px;
    }
  }
}
</style>
