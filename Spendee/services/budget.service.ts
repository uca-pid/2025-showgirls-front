import ApiService from './api.service'

export interface BudgetCategoryResponse {
  id: number
  presupuestoId: number
  categoriaId: number
  monto: number
}

export interface BudgetResponse {
  usuarioId: string
  monto: number
  fechaInicio: Date
  fechaFin: Date
  PresupuestoCategoria: BudgetCategoryResponse[]
}

class BudgetService {
  public async createBudget(body: BudgetResponse) {
    return await ApiService.post('/budget', body)
  }
}

const budgetService = new BudgetService()
export default budgetService
