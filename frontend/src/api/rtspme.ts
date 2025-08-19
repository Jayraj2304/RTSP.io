import { apiClient } from './client'

export interface ConvertRTSPData {
  rtsp_url: string
  name?: string
  ip?: string
}

export interface RTSPMeEmbedResponse {
  success: boolean
  rtsp_url: string
  stream_id: string
  name: string
  embed_url: string
  access_url: string
  stream_url: string
  poster_url: string
  monthly_counter: string
  iframe_code: string
  note: string
}

export const rtspmeApi = {
  // Convert RTSP URL to embed URL
  convertRTSP: async (data: ConvertRTSPData): Promise<RTSPMeEmbedResponse> => {
    const response = await apiClient.post('/rtspme/convert-rtsp', data)
    return response.data
  }
}
