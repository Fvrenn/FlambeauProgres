export type SessionUser = {
  id: string
  name: string
  emailVerified: boolean
  email: string
  createdAt: Date
  updatedAt: Date
  image?: string | null
  role: string
}