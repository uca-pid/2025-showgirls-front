import { IncomeFilters } from '@/hooks/useIncomes'
import ApiService from './api.service'

export interface IncomeResponse {
  usuarioId: string
  ingreso: number
  montoAnterior: number
  fecha: Date
  id: number
}

class IncomeService {
  public async findById(incomeId: number) {
    return await ApiService.get<IncomeResponse>(`/ingresoPorId/${incomeId}`)
  }
  public async findByUserId(userId: string, filters: IncomeFilters) {
    return await ApiService.get<IncomeResponse[]>('/ingreso', {
      params: { userId, ...filters },
    })
  }
  public async create(body: any) {
    return await ApiService.post('/ingreso', body)
  }
}

const incomeService = new IncomeService()
export default incomeService
