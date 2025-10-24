import { ExpenseFilters } from '@/hooks/useExpenses'
import ApiService from './api.service'

export interface ExpenseResponse {
  usuarioId: string
  gasto: number
  montoAnterior: number
  fecha: Date
  id: number
  categoriaId: number | null
}

export interface ExpensesByMonthResponse {
  items: ExpenseResponse[]
  month: string
}

class ExpenseService {
  public async findByUserId(userId: string, filters: ExpenseFilters) {
    return await ApiService.get<ExpenseResponse[]>('/gasto', {
      params: { userId, ...filters },
    })
  }

  public async findByExpenseId(expenseId: number) {
    return await ApiService.get<ExpenseResponse>(`/gastoPorId/${expenseId}`)
  }

  public async findExpensesByMonth(userId: string) {
    return await ApiService.get<ExpensesByMonthResponse[]>('/gasto/agrupado', {
      params: { userId },
    })
  }

  public async create(body: any) {
    return await ApiService.post('/gasto', body)
  }

  public async update(expenseId: number, body: any) {
    return await ApiService.put(`/gastoPorId/${expenseId}`, body)
  }

  public async deleteExpense(expenseId: number) {
    return await ApiService.delete(`/gasto/${expenseId}`)
  }

  public async moveExpenses(fromCategoryId: number, toCategoryId: number) {
    return await ApiService.put(`/moverGastosCategoria/`, {
      categoriaOrigenId: fromCategoryId,
      categoriaDestinoId: toCategoryId,
    })
  }
}

const expenseService = new ExpenseService()
export default expenseService
