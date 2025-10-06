import ApiService from './api.service'

export interface IncomeResponse {
  usuarioId: string
  gasto: number
  montoAnterior: number
  fecha: Date
  id: number
}

class IncomeService {
  public async findById(incomeId: number) {
    return await ApiService.get(`/ingresoPorId/${incomeId}`)
  }
  public async findByUserId(userId: number) {
    return await ApiService.get(`/ingreso/${userId}`)
  }
}

const incomeService = new IncomeService()
export default incomeService
