import { defineStore } from 'pinia'
import { ref } from 'vue'
import { customerApi } from '@/api/customer'
import { ElMessage } from 'element-plus'

export const useCustomerStore = defineStore('customer', () => {
  const list = ref([])
  const total = ref(0)
  const loading = ref(false)

  const queryParams = ref({
    page: 1,
    pageSize: 10,
    keyword: '',
    status: '',
    level: ''
  })

  async function fetchList() {
    loading.value = true
    const minLoadingMs = 300
    const start = Date.now()
    try {
      const res = await customerApi.getList(queryParams.value)
      if (res.code === 200) {
        list.value = res.data.list
        total.value = res.data.total
      }
    } finally {
      const elapsed = Date.now() - start
      if (elapsed < minLoadingMs) {
        await new Promise((r) => setTimeout(r, minLoadingMs - elapsed))
      }
      loading.value = false
    }
  }

  async function createCustomer(data) {
    const res = await customerApi.create(data)
    if (res.code === 200) {
      ElMessage.success('客户添加成功')
      await fetchList()
      return true
    }
    return false
  }

  async function updateCustomer(id, data) {
    const res = await customerApi.update(id, data)
    if (res.code === 200) {
      ElMessage.success('客户信息更新成功')
      await fetchList()
      return true
    }
    return false
  }

  async function deleteCustomer(id) {
    const res = await customerApi.delete(id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      await fetchList()
      return true
    }
    return false
  }

  async function batchDeleteCustomers(ids) {
    const res = await customerApi.batchDelete(ids)
    if (res.code === 200) {
      ElMessage.success(res.message)
      await fetchList()
      return true
    }
    return false
  }

  function resetQuery() {
    queryParams.value = { page: 1, pageSize: 10, keyword: '', status: '', level: '' }
  }

  return {
    list,
    total,
    loading,
    queryParams,
    fetchList,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    batchDeleteCustomers,
    resetQuery
  }
})
