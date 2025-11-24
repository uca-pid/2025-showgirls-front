import ApiService from './api.service'

export interface PiggyResponse {
  id: number
  userId: string
  nombre: string
  xp: number
  objetivos: ObjetivoUsuarioResponse[]
}

export interface ObjetivoUsuarioResponse {
  id: number
  objetivoId: number
  progreso: number
  objetivo: ObjetivoResponse
}

export interface ObjetivoResponse {
  id: number
  descripcion: string
}

class PiggyService {
  public async findByUserId() {
    return await ApiService.get<PiggyResponse>('/piggy')
  }
}

const piggyService = new PiggyService()
export default piggyService
