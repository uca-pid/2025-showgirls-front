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
  public async findByUserId(userId: string) {
    return await ApiService.get<ExpenseResponse[]>(`/gasto/${userId}`)
  }
  public async findByExpenseId(expenseId: number) {
    return await ApiService.get<ExpenseResponse>(`/gastoPorId/${expenseId}`)
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

  public async edit(formCategoryId: number, toCategoryId: number) {
    return await ApiService.put(`/moverGastosCategoria/`, {
      categoriaOrigenId: formCategoryId,
      categoriaDestinoId: toCategoryId,
    })
  }
}

const expenseService = new ExpenseService()
export default expenseService
