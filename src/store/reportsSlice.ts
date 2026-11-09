import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { seedReports } from '../data/mockData'
import type { Report, Severity } from '../types'

interface ReportsState {
  reports: Report[]
  filter: 'all' | Severity
}

const storedReports = (() => {
  try {
    const value = localStorage.getItem('floodwatch-reports')
    if (!value) {
      localStorage.setItem('floodwatch-reports', JSON.stringify(seedReports))
      return seedReports
    }

    const parsed = JSON.parse(value) as Report[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : seedReports
  } catch {
    return seedReports
  }
})()

const initialState: ReportsState = {
  reports: storedReports,
  filter: 'all',
}

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    hydrateReports: (state) => {
      try {
        const value = localStorage.getItem('floodwatch-reports')
        if (value) {
          const parsed = JSON.parse(value) as Report[]
          state.reports = Array.isArray(parsed) ? parsed : seedReports
        }
      } catch {
        state.reports = seedReports
      }
    },
    addReport: (state, action: PayloadAction<Report>) => {
      state.reports = [action.payload, ...state.reports]
      localStorage.setItem('floodwatch-reports', JSON.stringify(state.reports))
    },
    updateReport: (state, action: PayloadAction<Report>) => {
      state.reports = state.reports.map((report) =>
        report.id === action.payload.id ? action.payload : report,
      )
      localStorage.setItem('floodwatch-reports', JSON.stringify(state.reports))
    },
    addComment: (
      state,
      action: PayloadAction<{ reportId: string; comment: Report['comments'][number] }>,
    ) => {
      state.reports = state.reports.map((report) => {
        if (report.id !== action.payload.reportId) {
          return report
        }

        return {
          ...report,
          comments: [...report.comments, action.payload.comment],
        }
      })
      localStorage.setItem('floodwatch-reports', JSON.stringify(state.reports))
    },
    setFilter: (state, action: PayloadAction<'all' | Severity>) => {
      state.filter = action.payload
    },
  },
})

export const { hydrateReports, addReport, updateReport, addComment, setFilter } =
  reportsSlice.actions
export const reportsReducer = reportsSlice.reducer
