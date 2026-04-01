<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { customerApi } from '@/api/customer'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft,
  Edit,
  UserFilled,
  Phone,
  Message,
  OfficeBuilding,
  Briefcase,
  Medal,
  CircleCheck,
  Location,
  Document
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const customer = reactive({
  id: null,
  name: '',
  phone: '',
  email: '',
  company: '',
  industry: '',
  level: '',
  status: 1,
  address: '',
  remark: '',
  avatar: '',
  createTime: ''
})

const levelMap = {
  vip: { label: 'VIP', type: 'warning' },
  normal: { label: '普通', type: 'info' },
  potential: { label: '潜在', type: 'success' }
}

async function fetchDetail() {
  loading.value = true
  try {
    const res = await customerApi.getDetail(Number(route.params.id))
    if (res.code === 200) {
      Object.assign(customer, res.data)
    } else {
      ElMessage.error(res.message || '获取客户详情失败')
      router.back()
    }
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.back()
}

function goEdit() {
  router.push('/customer')
}

onMounted(() => fetchDetail())
</script>

<template>
  <div class="customer-detail-page">
    <div class="page-header">
      <div class="header-left">
        <el-button :icon="ArrowLeft" @click="goBack" plain>
          返回
        </el-button>
        <div class="page-title">
          <div class="title-icon" />
          客户详情
        </div>
      </div>
      <div class="header-actions">
        <el-button type="primary" :icon="Edit" @click="goEdit">
          编辑客户
        </el-button>
      </div>
    </div>

    <div v-loading="loading" class="detail-content">
      <div class="info-card page-card">
        <div class="customer-header">
          <el-avatar :size="80" :src="customer.avatar" />
          <div class="customer-basic">
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

      <div class="info-card page-card">
        <h3 class="section-title">
          <el-icon><UserFilled /></el-icon>
          基本信息
        </h3>
        <el-row :gutter="40">
          <el-col :span="8">
            <div class="info-item">
              <span class="label">客户姓名</span>
              <span class="value">{{ customer.name }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <span class="label">创建时间</span>
              <span class="value">{{ customer.createTime }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <span class="label">所属行业</span>
              <span class="value">{{ customer.industry || '—' }}</span>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="info-card page-card">
        <h3 class="section-title">
          <el-icon><Phone /></el-icon>
          联系方式
        </h3>
        <el-row :gutter="40">
          <el-col :span="8">
            <div class="info-item">
              <span class="label">手机号码</span>
              <span class="value">{{ customer.phone }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <span class="label">电子邮箱</span>
              <span class="value">{{ customer.email || '—' }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <span class="label">所在地区</span>
              <span class="value">{{ customer.address || '—' }}</span>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="info-card page-card">
        <h3 class="section-title">
          <el-icon><OfficeBuilding /></el-icon>
          公司信息
        </h3>
        <el-row :gutter="40">
          <el-col :span="12">
            <div class="info-item">
              <span class="label">公司名称</span>
              <span class="value">{{ customer.company }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <span class="label">客户等级</span>
              <span class="value">
                <el-tag :type="levelMap[customer.level]?.type">
                  {{ levelMap[customer.level]?.label }}
                </el-tag>
              </span>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="info-card page-card">
        <h3 class="section-title">
          <el-icon><Document /></el-icon>
          备注信息
        </h3>
        <div class="remark-content">
          {{ customer.remark || '暂无备注信息' }}
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

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header-left {
    display: flex;
    align-items: center;
    gap: $spacing-md;
  }
}

.page-title {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  font-size: $font-size-xl;
  font-weight: 600;
  color: $text-primary;
}

.title-icon {
  width: 4px;
  height: 18px;
  border-radius: 2px;
  background: $primary-color;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.info-card {
  padding: $spacing-lg;
}

.customer-header {
  display: flex;
  align-items: center;
  gap: $spacing-lg;
  padding: $spacing-md 0;
}

.customer-basic {
  flex: 1;
}

.customer-name {
  font-size: 24px;
  font-weight: 600;
  color: $text-primary;
  margin: 0 0 $spacing-md 0;
}

.customer-tags {
  display: flex;
  gap: $spacing-sm;
}

.section-title {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  font-size: $font-size-lg;
  font-weight: 600;
  color: $text-primary;
  margin: 0 0 $spacing-lg 0;
  padding-bottom: $spacing-sm;
  border-bottom: 1px solid $border-color;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  padding: $spacing-md 0;

  .label {
    font-size: $font-size-sm;
    color: $text-secondary;
  }

  .value {
    font-size: $font-size-base;
    color: $text-primary;
    font-weight: 500;
  }
}

.remark-content {
  min-height: 80px;
  padding: $spacing-md;
  background: $bg-page;
  border-radius: 4px;
  color: $text-regular;
  line-height: 1.6;
}
</style>
