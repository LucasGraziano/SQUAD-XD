/**
 * Client-side AES-256-GCM encryption for clinical notes.
 * Notes are NEVER sent to the server in plaintext.
 * The server stores: content_encrypted (base64), content_iv (base64), content_salt (base64).
 */

const PBKDF2_ITERATIONS = 200_000
const KEY_LENGTH = 256

/**
 * Derives a CryptoKey from the user's password + a random salt.
 */
async function deriveKey(password: string, salt: ArrayBuffer): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  )

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  )
}

function toBase64(buffer: ArrayBuffer): string {
  return btoa(Array.from(new Uint8Array(buffer)).map(b => String.fromCharCode(b)).join(''))
}

function fromBase64(base64: string): ArrayBuffer {
  const bin = atob(base64)
  const buf = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i)
  return buf.buffer as ArrayBuffer
}

export interface EncryptedNote {
  content_encrypted: string // base64
  content_iv: string        // base64
  content_salt: string      // base64
}

/**
 * Encrypts a note with the user's password.
 */
export async function encryptNote(plaintext: string, password: string): Promise<EncryptedNote> {
  const saltBuf  = window.crypto.getRandomValues(new Uint8Array(16)).buffer as ArrayBuffer
  const ivBuf    = window.crypto.getRandomValues(new Uint8Array(12)).buffer as ArrayBuffer
  const key      = await deriveKey(password, saltBuf)

  const enc = new TextEncoder()
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: ivBuf },
    key,
    enc.encode(plaintext)
  )

  return {
    content_encrypted: toBase64(encrypted),
    content_iv: toBase64(ivBuf),
    content_salt: toBase64(saltBuf),
  }
}

/**
 * Decrypts a note with the user's password.
 */
export async function decryptNote(encrypted: EncryptedNote, password: string): Promise<string> {
  const saltBuf   = fromBase64(encrypted.content_salt)
  const ivBuf     = fromBase64(encrypted.content_iv)
  const cipherBuf = fromBase64(encrypted.content_encrypted)
  const key       = await deriveKey(password, saltBuf)

  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: ivBuf },
    key,
    cipherBuf
  )

  return new TextDecoder().decode(decrypted)
}

/**
 * Extracts note content for AI analysis (client-side only).
 */
export async function extractForAnalysis(
  notes: EncryptedNote[],
  password: string
): Promise<string[]> {
  return Promise.all(notes.map((n) => decryptNote(n, password)))
}
