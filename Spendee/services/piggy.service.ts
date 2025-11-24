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
  maxProgreso: number
}

class PiggyService {
  public async findByUserId() {
    return await ApiService.get<PiggyResponse>('/piggy')
  }
  public async checkObjective(action: string) {
    return await ApiService.get('/piggy/checkObjective', {
      params: { action },
    })
  }
  public async updatePiggyName(name: string) {
    return await ApiService.put('/piggy/updatePiggy', { nombre: name })
  }
}

const piggyService = new PiggyService()
export default piggyService
