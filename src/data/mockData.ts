import type { Report } from '../types'

export const seedReports: Report[] = [
  {
    id: 'rep-101',
    title: 'Waterlogged road near Nizampet X Roads',
    type: 'Road waterlogging',
    description:
      'Heavy rain has left several lanes flooded near the junction, causing traffic congestion and slow movement.',
    severity: 'high',
    area: 'Nizampet',
    landmark: 'Near Metro station entrance',
    latitude: 17.4606,
    longitude: 78.3813,
    imageUrls: [],
    status: 'verified',
    createdAt: '2026-11-08T09:15:00.000Z',
    reporterName: 'Priya R.',
    reporterEmail: 'resident@example.com',
    confirmedCount: 12,
    comments: [
      {
        id: 'c-1',
        user: 'Resident',
        text: 'Traffic is moving slowly through the junction.',
        createdAt: '2026-11-08T10:00:00.000Z',
      },
    ],
    adminNote: 'Drainage line is being inspected by the municipal team.',
  },
  {
    id: 'rep-102',
    title: 'Flooded underpass at LB Nagar',
    type: 'Flooded underpass',
    description:
      'The service road underpass is partially submerged and access is unsafe for two-wheelers and pedestrians.',
    severity: 'critical',
    area: 'LB Nagar',
    landmark: 'Junction of Main Road and Service Road',
    latitude: 17.3411,
    longitude: 78.5553,
    imageUrls: [],
    status: 'under_review',
    createdAt: '2026-11-09T06:40:00.000Z',
    reporterName: 'Rakesh S.',
    reporterEmail: 'commuter@example.com',
    confirmedCount: 8,
    comments: [],
    adminNote: 'Priority review for commuter safety.',
  },
  {
    id: 'rep-103',
    title: 'Blocked drainage around Gachibowli Circle',
    type: 'Blocked drainage',
    description:
      'Overflow from a blocked drainage line is pooling at the edge of the lane and creating hazard for cyclists.',
    severity: 'moderate',
    area: 'Gachibowli',
    landmark: 'Gachibowli Circle',
    latitude: 17.4401,
    longitude: 78.3484,
    imageUrls: [],
    status: 'pending',
    createdAt: '2026-11-08T18:20:00.000Z',
    reporterName: 'Niharika M.',
    reporterEmail: 'safety@example.com',
    confirmedCount: 3,
    comments: [],
  },
]

export const defaultUsers = [
  {
    uid: 'admin-user-1',
    email: 'admin@floodwatch.in',
    name: 'Admin FloodWatch',
    role: 'administrator' as const,
    password: 'admin123',
  },
  {
    uid: 'resident-user-1',
    email: 'resident@floodwatch.in',
    name: 'Hyderabad Resident',
    role: 'resident' as const,
    password: 'resident123',
  },
]
