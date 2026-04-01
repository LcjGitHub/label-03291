/**
 * Mock 数据与工具函数
 */

/** 模拟网络延迟 */
export function mockDelay(fn, ms = 300) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(fn()), ms)
  })
}

/** Token 有效期（毫秒），24 小时 */
const TOKEN_EXPIRES_MS = 24 * 60 * 60 * 1000

/** 预存的密码 SHA-256 哈希（对应密码 123456），与前端 crypto 工具一致 */
const PASSWORD_HASH_123456 =
  '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'

/** 模拟登录接口（password 为前端传入的 SHA-256 哈希） */
export function mockLogin(username, passwordHash) {
  return mockDelay(() => {
    const users = [
      { username: 'admin', passwordHash: PASSWORD_HASH_123456, role: 'admin', name: '超级管理员', avatar: 'https://i.pravatar.cc/40?u=admin' },
      { username: 'user', passwordHash: PASSWORD_HASH_123456, role: 'user', name: '普通用户', avatar: 'https://i.pravatar.cc/40?u=user' }
    ]
    const user = users.find((u) => u.username === username && u.passwordHash === passwordHash)
    if (user) {
      const expiresAt = Date.now() + TOKEN_EXPIRES_MS
      const payload = { username: user.username, role: user.role, exp: Math.floor(expiresAt / 1000) }
      const token = `mock.${btoa(JSON.stringify(payload))}.${expiresAt.toString(36)}`
      return {
        code: 200,
        data: {
          token,
          expiresAt,
          userInfo: { username: user.username, name: user.name, role: user.role, avatar: user.avatar }
        },
        message: '登录成功'
      }
    }
    return { code: 401, message: '账号或密码错误' }
  })
}

/** 校验 token 是否过期 */
export function isTokenExpired(expiresAt) {
  if (!expiresAt) return true
  return Date.now() >= expiresAt
}

/** 初始化客户数据 */
export const mockCustomers = [
  { id: 1, name: '张伟', phone: '13800138001', email: 'zhangwei@example.com', company: '阿里巴巴集团', level: 'vip', status: 1, industry: '互联网', address: '浙江省杭州市', remark: '重要合作伙伴', createTime: '2024-01-15', avatar: 'https://i.pravatar.cc/40?img=1' },
  { id: 2, name: '李娜', phone: '13900139002', email: 'lina@example.com', company: '腾讯科技', level: 'vip', status: 1, industry: '互联网', address: '广东省深圳市', remark: '长期客户', createTime: '2024-01-18', avatar: 'https://i.pravatar.cc/40?img=2' },
  { id: 3, name: '王磊', phone: '13700137003', email: 'wanglei@example.com', company: '华为技术', level: 'normal', status: 1, industry: '通信技术', address: '广东省深圳市', remark: '', createTime: '2024-02-01', avatar: 'https://i.pravatar.cc/40?img=3' },
  { id: 4, name: '刘洋', phone: '13600136004', email: 'liuyang@example.com', company: '百度在线', level: 'normal', status: 0, industry: '互联网', address: '北京市海淀区', remark: '暂停合作', createTime: '2024-02-10', avatar: 'https://i.pravatar.cc/40?img=4' },
  { id: 5, name: '陈静', phone: '13500135005', email: 'chenjing@example.com', company: '京东物流', level: 'potential', status: 1, industry: '电商物流', address: '北京市朝阳区', remark: '潜在大客户', createTime: '2024-02-15', avatar: 'https://i.pravatar.cc/40?img=5' },
  { id: 6, name: '赵明', phone: '13400134006', email: 'zhaoming@example.com', company: '美团网络', level: 'vip', status: 1, industry: '生活服务', address: '北京市西城区', remark: '', createTime: '2024-02-20', avatar: 'https://i.pravatar.cc/40?img=6' },
  { id: 7, name: '孙丽', phone: '13300133007', email: 'sunli@example.com', company: '滴滴出行', level: 'normal', status: 1, industry: '出行服务', address: '北京市昌平区', remark: '', createTime: '2024-03-01', avatar: 'https://i.pravatar.cc/40?img=7' },
  { id: 8, name: '周强', phone: '13200132008', email: 'zhouqiang@example.com', company: '字节跳动', level: 'vip', status: 1, industry: '互联网', address: '北京市海淀区', remark: '战略合作', createTime: '2024-03-05', avatar: 'https://i.pravatar.cc/40?img=8' },
  { id: 9, name: '吴婷', phone: '13100131009', email: 'wuting@example.com', company: '小米科技', level: 'potential', status: 0, industry: '智能硬件', address: '北京市顺义区', remark: '', createTime: '2024-03-10', avatar: 'https://i.pravatar.cc/40?img=9' },
  { id: 10, name: '郑军', phone: '13000130010', email: 'zhengjun@example.com', company: '网易互动', level: 'normal', status: 1, industry: '游戏娱乐', address: '广东省广州市', remark: '', createTime: '2024-03-12', avatar: 'https://i.pravatar.cc/40?img=10' },
  { id: 11, name: '黄敏', phone: '15800158011', email: 'huangmin@example.com', company: '拼多多', level: 'normal', status: 1, industry: '电商', address: '上海市长宁区', remark: '', createTime: '2024-03-15', avatar: 'https://i.pravatar.cc/40?img=11' },
  { id: 12, name: '谢超', phone: '15700157012', email: 'xiechao@example.com', company: '蚂蚁集团', level: 'vip', status: 1, industry: '金融科技', address: '浙江省杭州市', remark: '核心客户', createTime: '2024-03-18', avatar: 'https://i.pravatar.cc/40?img=12' }
]
