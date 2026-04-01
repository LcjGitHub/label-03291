<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomerStore } from '@/stores/customer'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  Search, Refresh, Plus, Edit, Delete, Download, View,
  UserFilled, Phone, Message, OfficeBuilding
} from '@element-plus/icons-vue'

const store = useCustomerStore()
const router = useRouter()

// ==================== 搜索 & 筛选 ====================
function handleSearch() {
  store.queryParams.page = 1
  store.fetchList()
}

function handleReset() {
  store.resetQuery()
  store.fetchList()
}

// ==================== 对话框 ====================
const dialogVisible = ref(false)
const dialogMode = ref('create') // 'create' | 'edit'
const formRef = ref(null)
const submitLoading = ref(false)
const currentId = ref(null)

const defaultForm = () => ({
  name: '',
  phone: '',
  email: '',
  company: '',
  industry: '',
  level: 'normal',
  status: 1,
  address: '',
  remark: ''
})

const form = reactive(defaultForm())

const dialogTitle = computed(() => dialogMode.value === 'create' ? '新增客户' : '编辑客户')

const rules = {
  name: [
    { required: true, message: '请输入客户姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度 2-20 位', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
  ],
  company: [
    { required: true, message: '请输入公司名称', trigger: 'blur' }
  ],
  level: [{ required: true, message: '请选择客户等级', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

function openCreate() {
  dialogMode.value = 'create'
  Object.assign(form, defaultForm())
  currentId.value = null
  dialogVisible.value = true
  nextTick(() => formRef.value?.clearValidate())
}

function openEdit(row) {
  dialogMode.value = 'edit'
  Object.assign(form, {
    name: row.name,
    phone: row.phone,
    email: row.email,
    company: row.company,
    industry: row.industry,
    level: row.level,
    status: row.status,
    address: row.address,
    remark: row.remark
  })
  currentId.value = row.id
  dialogVisible.value = true
  nextTick(() => formRef.value?.clearValidate())
}

function openDetail(row) {
  router.push({ name: 'CustomerDetail', params: { id: row.id } })
}

async function handleSubmit() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    submitLoading.value = true
    try {
      let success = false
      if (dialogMode.value === 'create') {
        success = await store.createCustomer({ ...form })
      } else {
        success = await store.updateCustomer(currentId.value, { ...form })
      }
      if (success) dialogVisible.value = false
    } finally {
      submitLoading.value = false
    }
  })
}

function handleDialogClose() {
  formRef.value?.resetFields()
  formRef.value?.clearValidate()
  dialogVisible.value = false
}

// ==================== 删除 ====================
async function handleDelete(row) {
  await ElMessageBox.confirm(
    `确定要删除客户「${row.name}」吗？此操作不可撤销。`,
    '删除确认',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'el-button--danger'
    }
  )
  await store.deleteCustomer(row.id)
}

// ==================== 批量删除 ====================
const selectedRows = ref([])

function handleSelectionChange(val) {
  selectedRows.value = val
}

async function handleBatchDelete() {
  if (!selectedRows.value.length) {
    ElMessage.warning('请先勾选要删除的客户')
    return
  }
  await ElMessageBox.confirm(
    `确定要删除选中的 ${selectedRows.value.length} 位客户吗？`,
    '批量删除确认',
    { confirmButtonText: '确定删除', cancelButtonText: '取消', type: 'warning' }
  )
  const ids = selectedRows.value.map((r) => r.id)
  await store.batchDeleteCustomers(ids)
  selectedRows.value = []
}

// ==================== 分页 ====================
function handlePageChange(page) {
  store.queryParams.page = page
  store.fetchList()
}

function handlePageSizeChange(size) {
  store.queryParams.pageSize = size
  store.queryParams.page = 1
  store.fetchList()
}

// ==================== 配置映射 ====================
const levelOptions = [
  { label: 'VIP', value: 'vip' },
  { label: '普通', value: 'normal' },
  { label: '潜在', value: 'potential' }
]

const levelMap = {
  vip: { label: 'VIP', type: 'warning' },
  normal: { label: '普通', type: 'info' },
  potential: { label: '潜在', type: 'success' }
}

const statusOptions = [
  { label: '活跃', value: 1 },
  { label: '停用', value: 0 }
]

const industryOptions = [
  '互联网', '电商', '金融科技', '通信技术', '智能硬件',
  '游戏娱乐', '生活服务', '出行服务', '电商物流', '其他'
]

onMounted(() => store.fetchList())
</script>

<template>
  <div class="customer-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="page-title">
        <div class="title-icon" />
        客户管理
      </div>
      <div class="header-actions">
        <el-button
          type="danger"
          plain
          :disabled="!selectedRows.length"
          @click="handleBatchDelete"
        >
          <el-icon><Delete /></el-icon>
          批量删除 {{ selectedRows.length ? `(${selectedRows.length})` : '' }}
        </el-button>
        <el-button type="primary" @click="openCreate">
          <el-icon><Plus /></el-icon>
          新增客户
        </el-button>
      </div>
    </div>

    <!-- 搜索筛选区 -->
    <div class="search-card page-card">
      <el-form :inline="true" class="search-form">
        <el-form-item label="关键词">
          <el-input
            v-model="store.queryParams.keyword"
            placeholder="姓名 / 手机 / 邮箱 / 公司"
            :prefix-icon="Search"
            clearable
            style="width: 240px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="客户等级">
          <el-select
            v-model="store.queryParams.level"
            placeholder="全部等级"
            clearable
            style="min-width: 140px"
          >
            <el-option
              v-for="opt in levelOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="store.queryParams.status"
            placeholder="全部状态"
            clearable
            style="min-width: 120px"
          >
            <el-option
              v-for="opt in statusOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 数据表格 -->
    <div class="table-card page-card">
      <el-table
        v-loading="store.loading"
        :data="store.list"
        stripe
        row-key="id"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column label="客户信息" min-width="200">
          <template #default="{ row }">
            <div class="customer-cell">
              <el-avatar :size="38" :src="row.avatar" />
              <div class="customer-cell__info">
                <p class="cell-name">{{ row.name }}</p>
                <p class="cell-company">
                  <el-icon size="11"><OfficeBuilding /></el-icon>
                  {{ row.company }}
                </p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="联系方式" min-width="180">
          <template #default="{ row }">
            <div class="contact-cell">
              <p>
                <el-icon size="12" color="#409EFF"><Phone /></el-icon>
                {{ row.phone }}
              </p>
              <p class="contact-email">
                <el-icon size="12" color="#67C23A"><Message /></el-icon>
                {{ row.email || '—' }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="行业" prop="industry" width="120">
          <template #default="{ row }">
            <el-tag type="info" effect="plain" size="small">{{ row.industry || '—' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="等级" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="levelMap[row.level]?.type" size="small">
              {{ levelMap[row.level]?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small" effect="light">
              {{ row.status === 1 ? '活跃' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="120" align="center" />
        <el-table-column label="操作" width="260" align="center" fixed="right">
          <template #default="{ row }">
            <div class="action-cell">
              <el-button
                type="primary"
                text
                size="small"
                :icon="View"
                @click="openDetail(row)"
              >
                查看
              </el-button>
              <el-button
                type="primary"
                text
                size="small"
                :icon="Edit"
                @click="openEdit(row)"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                text
                size="small"
                :icon="Delete"
                @click="handleDelete(row)"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrap">
        <el-pagination
          v-model:current-page="store.queryParams.page"
          v-model:page-size="store.queryParams.pageSize"
          :total="store.total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @current-change="handlePageChange"
          @size-change="handlePageSizeChange"
        />
      </div>
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :before-close="handleDialogClose"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="90px"
        class="customer-form"
      >
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="客户姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入姓名" :prefix-icon="UserFilled" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号" :prefix-icon="Phone" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" :prefix-icon="Message" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司名称" prop="company">
              <el-input v-model="form.company" placeholder="请输入公司名称" :prefix-icon="OfficeBuilding" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="所属行业" prop="industry">
              <el-select v-model="form.industry" placeholder="请选择行业" style="width: 100%">
                <el-option
                  v-for="ind in industryOptions"
                  :key="ind"
                  :label="ind"
                  :value="ind"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户等级" prop="level">
              <el-select v-model="form.level" placeholder="请选择等级" style="width: 100%">
                <el-option
                  v-for="opt in levelOptions"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio :value="1">活跃</el-radio>
                <el-radio :value="0">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在地区" prop="address">
              <el-input v-model="form.address" placeholder="请输入地区" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="handleDialogClose">取 消</el-button>
        <el-button
          type="primary"
          :loading="submitLoading"
          @click="handleSubmit"
        >
          {{ submitLoading ? '提交中...' : '确 认' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.customer-page {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.search-card {
  padding: $spacing-md $spacing-lg $spacing-xs;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: $spacing-md;
  }

  @media (max-width: 768px) {
    :deep(.el-form-item) {
      margin-bottom: $spacing-sm;
    }
  }
}

.table-card {
  padding: 0;
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;

  :deep(.el-table) {
    width: 100%;
    border-radius: 0;
    box-shadow: none;
  }
}

.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  padding: $spacing-md $spacing-lg;
  border-top: 1px solid $border-color;
  background: $bg-card;
}

// 客户单元格
.customer-cell {
  display: flex;
  align-items: center;
  gap: $spacing-sm;

  &__info { min-width: 0; }
}

.cell-name {
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 3px;
}

.cell-company {
  font-size: $font-size-xs;
  color: $text-secondary;
  display: flex;
  align-items: center;
  gap: 3px;
}

// 联系方式
.contact-cell {
  p {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: $font-size-sm;
    color: $text-regular;
    margin-bottom: 3px;
  }

  .contact-email {
    font-size: $font-size-xs;
    color: $text-secondary;
  }
}

// 表单
.customer-form {
  padding: 0 $spacing-sm;

  :deep(.el-select) { width: 100%; }
}

.action-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: $spacing-xs;
}
</style>
