import ApiService from './api.service'

export interface BudgetCategoryResponse {
  categoriaId: number
  monto: number
  gastado: number
  porcentaje: number
}

export interface BudgetResponse {
  usuarioId: string
  monto: number
  fechaInicio: Date
  fechaFin: Date
  PresupuestoCategoria: BudgetCategoryResponse[]
}

export interface BudgetGroupResponse {
  futureBudgets: BudgetResponse[]
  currentBudget: BudgetResponse
  pastBudgets: BudgetResponse[]
}

class BudgetService {
  public async createBudget(body: BudgetResponse) {
    return await ApiService.post('/budget', body)
  }
  public async getBudget(userId: string) {
    return await ApiService.get<BudgetGroupResponse>(
      `/budgets?usuarioId=${userId}`,
    )
  }
}

const budgetService = new BudgetService()
export default budgetService
