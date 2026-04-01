<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { customerApi } from '@/api/customer'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft, Edit,
  UserFilled, Phone, Message, OfficeBuilding,
  Location, Promotion, Timer, Warning, Document
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const customer = ref(null)

const levelMap = {
  vip: { label: 'VIP', type: 'warning' },
  normal: { label: '普通', type: 'info' },
  potential: { label: '潜在', type: 'success' }
}

async function fetchDetail() {
  loading.value = true
  try {
    const id = Number(route.params.id)
    const res = await customerApi.getDetail(id)
    if (res.code === 200) {
      customer.value = res.data
    } else {
      ElMessage.error(res.message)
      router.back()
    }
  } finally {
    loading.value = false
  }
}

function handleBack() {
  router.back()
}

function handleEdit() {
  router.push('/customer')
}

onMounted(() => fetchDetail())
</script>

<template>
  <div class="customer-detail-page">
    <div class="page-header">
      <div class="page-title">
        <el-button
          type="primary"
          text
          :icon="ArrowLeft"
          @click="handleBack"
          class="back-btn"
        >
          返回
        </el-button>
        <div class="title-icon" />
        客户详情
      </div>
      <el-button type="primary" :icon="Edit" @click="handleEdit">
        编辑客户
      </el-button>
    </div>

    <div class="detail-content" v-loading="loading">
      <div v-if="customer" class="detail-card">
        <div class="card-section">
          <h3 class="section-title">
            <el-icon><UserFilled /></el-icon>
            基本信息
          </h3>
          <div class="info-grid">
            <div class="avatar-col">
              <el-avatar :size="80" :src="customer.avatar" />
            </div>
            <div class="info-row">
              <div class="info-item">
                <span class="label">客户姓名</span>
                <span class="value">{{ customer.name }}</span>
              </div>
              <div class="info-item">
                <span class="label">手机号</span>
                <span class="value">
                  <el-icon size="12" color="#409EFF"><Phone /></el-icon>
                  {{ customer.phone }}
                </span>
              </div>
              <div class="info-item">
                <span class="label">邮箱</span>
                <span class="value">
                  <el-icon size="12" color="#67C23A"><Message /></el-icon>
                  {{ customer.email || '—' }}
                </span>
              </div>
              <div class="info-item">
                <span class="label">公司名称</span>
                <span class="value">
                  <el-icon size="12" color="#909399"><OfficeBuilding /></el-icon>
                  {{ customer.company }}
                </span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-item">
                <span class="label">所属行业</span>
                <span class="value">
                  <el-tag type="info" effect="plain" size="small">{{ customer.industry || '—' }}</el-tag>
                </span>
              </div>
              <div class="info-item">
                <span class="label">客户等级</span>
                <span class="value">
                  <el-tag :type="levelMap[customer.level]?.type" size="small">
                    {{ levelMap[customer.level]?.label }}
                  </el-tag>
                </span>
              </div>
              <div class="info-item">
                <span class="label">状态</span>
                <span class="value">
                  <el-tag :type="customer.status === 1 ? 'success' : 'danger'" size="small" effect="light">
                    {{ customer.status === 1 ? '活跃' : '停用' }}
                  </el-tag>
                </span>
              </div>
              <div class="info-item">
                <span class="label">所在地区</span>
                <span class="value">
                  <el-icon size="12" color="#E6A23C"><Location /></el-icon>
                  {{ customer.address || '—' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <el-divider />

        <div class="card-section">
          <h3 class="section-title">
            <el-icon><Timer /></el-icon>
            系统信息
          </h3>
          <div class="info-row">
            <div class="info-item">
              <span class="label">客户ID</span>
              <span class="value">{{ customer.id }}</span>
            </div>
            <div class="info-item">
              <span class="label">创建时间</span>
              <span class="value">{{ customer.createTime }}</span>
            </div>
          </div>
        </div>

        <el-divider v-if="customer.remark" />

        <div class="card-section" v-if="customer.remark">
          <h3 class="section-title">
            <el-icon><Document /></el-icon>
            备注信息
          </h3>
          <div class="remark-box">
            {{ customer.remark }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.customer-detail-page {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.page-title {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.back-btn {
  margin-right: $spacing-sm;
  padding-left: 0;
}

.detail-content {
  flex: 1;
}

.detail-card {
  background: $bg-card;
  border-radius: $border-radius;
  padding: $spacing-xl;
  box-shadow: $shadow-card;
}

.card-section {
  padding: $spacing-sm 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: $font-size-lg;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-lg;

  :deep(.el-icon) {
    color: $primary-color;
  }
}

.info-grid {
  display: grid;
  grid-template-columns: 80px 1fr 1fr;
  gap: $spacing-lg;
  align-items: start;
}

.avatar-col {
  grid-column: 1 / 2;
  display: flex;
  justify-content: center;
}

.info-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-md $spacing-lg;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;

  .label {
    font-size: $font-size-xs;
    color: $text-secondary;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .value {
    font-size: $font-size-base;
    color: $text-primary;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
    min-height: 24px;
  }
}

.remark-box {
  background: $bg-page;
  border-radius: $border-radius-sm;
  padding: $spacing-md;
  line-height: 1.7;
  color: $text-regular;
}

:deep(.el-divider) {
  margin: $spacing-md 0;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .info-row {
    grid-template-columns: 1fr;
  }

  .detail-card {
    padding: $spacing-md;
  }
}
</style>
