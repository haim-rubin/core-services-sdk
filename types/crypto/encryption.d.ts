export function encryptPassword(
  {
    password,
  }: {
    password: string
  },
  {
    saltLength,
    passwordPrivateKey,
  }: {
    saltLength: number
    passwordPrivateKey?: string
  },
): Promise<any>
