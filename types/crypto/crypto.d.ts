export function getSalt(length: number): Buffer
export function getSaltHex(length: number): string
export function getEncryptedBuffer({
  salt,
  expression,
  length,
}: {
  expression: string
  salt: string
  length?: number
}): Promise<Buffer>
export function encrypt({
  salt,
  expression,
  passwordPrivateKey,
}: {
  expression: string
  salt: string
  passwordPrivateKey?: string
}): Promise<string>
export function isPasswordMatch({
  salt,
  password,
  encryptedPassword,
  passwordPrivateKey,
}: {
  salt: string
  password: string
  encryptedPassword: string
  passwordPrivateKey?: string
}): Promise<boolean>
