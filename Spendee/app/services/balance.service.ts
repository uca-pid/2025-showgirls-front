import ApiService from './api.service'

export interface BalanceResponse {
  balance: number
  sumaIngresos: number
  sumaGastos: number
}

class BalanceService {
  public async findByUserId(userId: string) {
    return await ApiService.get<BalanceResponse>(`/balance/${userId}`)
  }
}

const balanceService = new BalanceService()
export default balanceService
