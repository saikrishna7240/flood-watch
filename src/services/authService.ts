import { initializeApp } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type Auth,
} from 'firebase/auth'
import { defaultUsers } from '../data/mockData'
import type { User, UserRole } from '../types'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const isFirebaseConfigured = Object.values(firebaseConfig).every((value) => value)

let firebaseAuth: Auth | null = null

if (isFirebaseConfigured) {
  initializeApp(firebaseConfig)
  firebaseAuth = getAuth()
}

const USER_STORAGE_KEY = 'floodwatch-users'
const ACTIVE_USER_KEY = 'floodwatch-active-user'

const loadUsers = (): Array<User & { password?: string }> => {
  try {
    const saved = localStorage.getItem(USER_STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved) as Array<User & { password?: string }>
    }
  } catch {
    // ignore malformed storage and fall back to defaults
  }

  const fallback = defaultUsers.map(({ uid, email, name, role, password }) => ({
    uid,
    email,
    name,
    role,
    password,
  }))

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(fallback))
  return fallback
}

const persistUsers = (users: Array<User & { password?: string }>) => {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users))
}

const buildUser = (
  uid: string,
  email: string,
  name: string,
  role: UserRole,
): User => ({ uid, email, name, role })

export const authService = {
  async registerUser(name: string, email: string, password: string, role: UserRole = 'resident') {
    if (firebaseAuth) {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password)
      const user: User = {
        uid: userCredential.user.uid,
        email: userCredential.user.email ?? email,
        name,
        role,
      }

      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user))
      return user
    }

    const users = loadUsers()
    if (users.some((entry) => entry.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('This email is already registered.')
    }

    const user = buildUser(
      `local-${Date.now()}`,
      email,
      name,
      role,
    )
    users.push({ ...user, password })
    persistUsers(users)
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user))
    return user
  },

  async loginUser(email: string, password: string) {
    if (firebaseAuth) {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password)
      const user: User = {
        uid: userCredential.user.uid,
        email: userCredential.user.email ?? email,
        name: userCredential.user.displayName ?? 'Community Member',
        role: 'resident',
      }

      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user))
      return user
    }

    const users = loadUsers()
    const userRecord = users.find(
      (entry) => entry.email.toLowerCase() === email.toLowerCase() && entry.password === password,
    )

    if (!userRecord) {
      throw new Error('Incorrect email or password.')
    }

    const user = buildUser(userRecord.uid, userRecord.email, userRecord.name, userRecord.role)
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user))
    return user
  },

  async resetPassword(email: string) {
    if (firebaseAuth) {
      await sendPasswordResetEmail(firebaseAuth, email)
      return
    }

    const users = loadUsers()
    if (!users.some((entry) => entry.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('No account found for that email address.')
    }
  },

  async logoutUser() {
    if (firebaseAuth) {
      await signOut(firebaseAuth)
    }

    localStorage.removeItem(ACTIVE_USER_KEY)
  },

  getCurrentUser(): User | null {
    try {
      const stored = localStorage.getItem(ACTIVE_USER_KEY)
      if (!stored) {
        return null
      }

      return JSON.parse(stored) as User
    } catch {
      return null
    }
  },
}
