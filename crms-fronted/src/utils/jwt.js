// Decodes a JWT payload client-side to check expiry, without needing a
// signature-verification library (the backend is the only party that
// needs to verify the signature — this is just a cheap client-side
// check to avoid treating an obviously expired token as valid).
export const isTokenExpired = (token) => {
  if (!token) return true

  try {
    const base64Payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(base64Payload))

    if (!payload.exp) return false

    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}
