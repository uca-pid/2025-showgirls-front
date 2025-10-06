import ApiService from './api.service'
import { ExpenseResponse } from './expense.service'

export interface CategoryResponse {
  id: number
  usuarioId: string
  nombre: string
  icono: string
  color: string
  descripcion: string
  totalGastos: number
}

class CategoryService {
  public async findMany() {
    return await ApiService.get<CategoryResponse[]>(`/categories`)
  }
  public async create(category: {
    nombre: string
    icono: string
    color: string
    descripcion: string
  }) {
    return await ApiService.post(`/customCategory`, category)
  }
}

const categoryService = new CategoryService()
export default categoryService
