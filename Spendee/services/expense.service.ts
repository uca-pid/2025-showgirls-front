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
    return await ApiService.get<ExpenseResponse[]>('/expense', {
      params: { ...filters },
    })
  }

  public async findByExpenseId(expenseId: number) {
    return await ApiService.get<ExpenseResponse>(`/expense/byId/${expenseId}`)
  }

  public async findExpensesByMonth(userId: string) {
    return await ApiService.get<ExpensesByMonthResponse[]>('/expense/grouped', {
      params: { userId },
    })
  }

  public async create(body: any) {
    return await ApiService.post('/expense', body)
  }

  public async update(expenseId: number, body: any) {
    return await ApiService.put(`/expense/byId/${expenseId}`, body)
  }

  public async deleteExpense(expenseId: number) {
    return await ApiService.delete(`/expense/${expenseId}`)
  }

  public async moveExpenses(fromCategoryId: number, toCategoryId: number) {
    return await ApiService.put(`/expense/moveExpensesOfCategory/`, {
      categoriaOrigenId: fromCategoryId,
      categoriaDestinoId: toCategoryId,
    })
  }
}

const expenseService = new ExpenseService()
export default expenseService
