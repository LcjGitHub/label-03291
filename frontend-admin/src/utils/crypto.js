/**
 * 前端密码加密（SHA-256），用于登录请求传输
 * 与后端约定一致时，后端需使用相同算法校验
 */
export function hashPassword(password) {
  return crypto.subtle
    .digest('SHA-256', new TextEncoder().encode(password))
    .then((buf) =>
      Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
    )
}
