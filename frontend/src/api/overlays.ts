import { apiClient } from './client'

export interface Position {
  x: number
  y: number
}

export interface Size {
  w: number
  h: number
}

export interface OverlayStyle {
  color?: string
  fontSize?: number
  background?: string
  borderRadius?: number
}

export interface Overlay {
  _id?: string
  overlayId?: string
  streamId?: string
  stream_id?: string
  type: 'text' | 'image'
  content: string
  position: Position
  size: Size
  zIndex?: number
  visible?: boolean
  style?: OverlayStyle
  createdAt?: string
  updatedAt?: string
}

export interface CreateOverlayData {
  stream_id?: string
  type: 'text' | 'image'
  content: string
  position: Position
  size: Size
  zIndex?: number
  visible?: boolean
  style?: OverlayStyle
}

export interface UpdateOverlayData {
  type?: 'text' | 'image'
  content?: string
  position?: Position
  size?: Size
  zIndex?: number
  visible?: boolean
  style?: OverlayStyle
}

export interface OverlaysResponse {
  success: boolean
  overlays: Overlay[]
  count: number
}

export interface OverlayResponse {
  success: boolean
  overlay: Overlay
  message?: string
}

export const overlaysApi = {
  // Get all overlays for a stream
  getOverlays: async (streamId: string = 'default'): Promise<OverlaysResponse> => {
    const response = await apiClient.get('/overlays/', { 
      params: { stream_id: streamId } 
    })
    return response.data
  },

  // Get a specific overlay by ID
  getOverlay: async (overlayId: string): Promise<OverlayResponse> => {
    const response = await apiClient.get(`/overlays/${overlayId}`)
    return response.data
  },

  // Create a new overlay
  createOverlay: async (data: CreateOverlayData): Promise<OverlayResponse> => {
    const response = await apiClient.post('/overlays/', data)
    return response.data
  },

  // Update an existing overlay
  updateOverlay: async (overlayId: string, data: UpdateOverlayData): Promise<OverlayResponse> => {
    const response = await apiClient.put(`/overlays/${overlayId}`, data)
    return response.data
  },

  // Delete an overlay
  deleteOverlay: async (overlayId: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/overlays/${overlayId}`)
    return response.data
  },

  // Delete all overlays for a stream
  deleteStreamOverlays: async (streamId: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/overlays/stream/${streamId}`)
    return response.data
  }
}
