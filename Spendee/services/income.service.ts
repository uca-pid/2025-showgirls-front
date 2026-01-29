import { IncomeFilters } from '@/hooks/useIncomes'
import ApiService from './api.service'

export interface IncomeResponse {
  usuarioId: string
  ingreso: number
  montoAnterior: number
  fecha: Date
  id: number
}

export interface IncomesByMonthResponse {
  items: IncomeResponse[]
  month: string
}

class IncomeService {
  public async findById(incomeId: number) {
    return await ApiService.get<IncomeResponse>(`/income/byId/${incomeId}`)
  }

  public async findByUserId(userId: string, filters: IncomeFilters) {
    return await ApiService.get<IncomeResponse[]>('/income', {
      params: { userId, ...filters },
    })
  }

  public async findIncomesByMonth(userId: string) {
    return await ApiService.get<IncomesByMonthResponse[]>('/income/grouped', {
      params: { userId },
    })
  }

  public async create(body: any) {
    return await ApiService.post('/income', body)
  }
}

const incomeService = new IncomeService()
export default incomeService
