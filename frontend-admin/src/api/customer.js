/**
 * 客户管理 API（Mock 模拟实现）
 * 在无后端环境下使用 localStorage 持久化，无缓存时使用初始 mock 数据
 */

import { mockDelay, mockCustomers } from './mock'

const CUSTOMER_STORAGE_KEY = 'customer_mgmt_list'

function getStoredList() {
  try {
    const raw = localStorage.getItem(CUSTOMER_STORAGE_KEY)
    if (raw) {
      const list = JSON.parse(raw)
      if (Array.isArray(list) && list.length) return list
    }
  } catch (_) {}
  return [...mockCustomers]
}

function saveList(list) {
  localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(list))
}

export const customerApi = {
  /** 获取客户列表（支持分页 + 搜索） */
  getList(params) {
    return mockDelay(() => {
      let list = getStoredList()

      if (params.keyword) {
        const kw = params.keyword.toLowerCase()
        list = list.filter(
          (c) =>
            c.name.toLowerCase().includes(kw) ||
            c.phone.includes(kw) ||
            c.email.toLowerCase().includes(kw) ||
            c.company.toLowerCase().includes(kw)
        )
      }

      if (params.status !== undefined && params.status !== '') {
        list = list.filter((c) => c.status === params.status)
      }

      if (params.level !== undefined && params.level !== '') {
        list = list.filter((c) => c.level === params.level)
      }

      const total = list.length
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const data = list.slice(start, start + pageSize)

      return { code: 200, data: { list: data, total }, message: 'ok' }
    })
  },

  /** 创建客户 */
  create(data) {
    return mockDelay(() => {
      const list = getStoredList()
      const newCustomer = {
        id: Date.now(),
        ...data,
        createTime: new Date().toLocaleDateString('zh-CN'),
        avatar: `https://i.pravatar.cc/40?u=${Date.now()}`
      }
      list.unshift(newCustomer)
      saveList(list)
      return { code: 200, data: newCustomer, message: '创建成功' }
    })
  },

  /** 更新客户 */
  update(id, data) {
    return mockDelay(() => {
      const list = getStoredList()
      const idx = list.findIndex((c) => c.id === id)
      if (idx === -1) return { code: 404, message: '客户不存在' }
      list[idx] = { ...list[idx], ...data }
      saveList(list)
      return { code: 200, data: list[idx], message: '更新成功' }
    })
  },

  /** 删除客户 */
  delete(id) {
    return mockDelay(() => {
      const list = getStoredList()
      const idx = list.findIndex((c) => c.id === id)
      if (idx === -1) return { code: 404, message: '客户不存在' }
      list.splice(idx, 1)
      saveList(list)
      return { code: 200, message: '删除成功' }
    })
  },

  /** 批量删除 */
  batchDelete(ids) {
    return mockDelay(() => {
      const list = getStoredList()
      ids.forEach((id) => {
        const idx = list.findIndex((c) => c.id === id)
        if (idx !== -1) list.splice(idx, 1)
      })
      saveList(list)
      return { code: 200, message: `已删除 ${ids.length} 条记录` }
    })
  }
}
