import ApiService from './api.service'

export interface ExpenseResponse {
  usuarioId: string
  gasto: number
  montoAnterior: number
  fecha: Date
  id: number
  categoriaId: number | null
}

class ExpenseService {
  public async findByUserId(
    userId: string,
    limit?: number | undefined,
    order?: string,
  ) {
    if (limit && order) {
      return await ApiService.get<ExpenseResponse[]>(
        `/gasto/${userId}?limit=${limit}&order=${order}`,
      )
    } else {
      return await ApiService.get<ExpenseResponse[]>(`/gasto/${userId}`)
    }
  }
  public async findByExpenseId(expenseId: number) {
    return await ApiService.get<ExpenseResponse>(`/gastoPorId/${expenseId}`)
  }
  public async findByCategoryId(userId: string, categoryId: number) {
    return await ApiService.get<ExpenseResponse[]>(
      `/gastosPorCategoria?userId=${userId}&categoryId=${categoryId}`,
    )
  }

  public async create(body: any) {
    return await ApiService.post('/gasto', body)
  }

  public async update(expenseId: number, body: any) {
    return await ApiService.put(`/gasto/${expenseId}`, body)
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
