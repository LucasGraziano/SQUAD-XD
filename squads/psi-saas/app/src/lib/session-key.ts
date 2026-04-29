/**
 * Session Key Manager
 * A chave derivada de PBKDF2 fica APENAS na memória da sessão do browser.
 * Nunca vai ao servidor. Nunca persiste entre recargas.
 */

let sessionKey: CryptoKey | null = null
let sessionPassword: string | null = null

export function setSessionKey(key: CryptoKey, password: string) {
  sessionKey = key
  sessionPassword = password
}

export function getSessionKey(): CryptoKey | null {
  return sessionKey
}

export function getSessionPassword(): string | null {
  return sessionPassword
}

export function clearSessionKey() {
  sessionKey = null
  sessionPassword = null
}

export function hasSessionKey(): boolean {
  return sessionKey !== null
}

/**
 * Deriva e armazena a chave a partir da senha.
 * Retorna true se bem-sucedido.
 */
export async function deriveAndStore(password: string): Promise<boolean> {
  try {
    const enc = new TextEncoder()
    const salt = new Uint8Array(16) // salt fixo para session key (não para notas individuais)
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw', enc.encode(password), { name: 'PBKDF2' }, false, ['deriveKey']
    )
    const key = await window.crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: 200_000, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    )
    setSessionKey(key, password)
    return true
  } catch {
    return false
  }
}
