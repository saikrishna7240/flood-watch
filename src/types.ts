export type Severity = 'low' | 'moderate' | 'high' | 'critical'
export type ReportStatus = 'pending' | 'under_review' | 'verified' | 'resolved' | 'rejected'
export type HazardType =
  | 'Road waterlogging'
  | 'Flooded underpass'
  | 'Blocked drainage'
  | 'Traffic disruption'
  | 'Heavy rain hazard'

export type UserRole = 'resident' | 'administrator' | 'visitor'

export interface User {
  uid: string
  email: string
  name: string
  role: UserRole
}

export interface Comment {
  id: string
  user: string
  text: string
  createdAt: string
}

export interface Report {
  id: string
  title: string
  type: HazardType
  description: string
  severity: Severity
  area: string
  landmark: string
  latitude: number
  longitude: number
  additionalInfo?: string
  imageUrls: string[]
  status: ReportStatus
  createdAt: string
  reporterName: string
  reporterEmail: string
  confirmedCount: number
  comments: Comment[]
  adminNote?: string
}

export interface AuthCredentials {
  email: string
  password: string
}
