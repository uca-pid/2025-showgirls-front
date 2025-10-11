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
  editable: boolean
}

class CategoryService {
  public async findMany(params?: { month?: number; year?: number }) {
    const queryParams = new URLSearchParams()

    if (params?.month) {
      queryParams.append('month', String(params.month))
    }

    if (params?.year) {
      queryParams.append('year', String(params.year))
    }

    const queryString = queryParams.toString()

    return await ApiService.get<CategoryResponse[]>(
      queryString ? `/categories?${queryString}` : `/categories`,
    )
  }
  public async create(category: {
    nombre: string
    icono: string
    color: string
    descripcion: string
  }) {
    return await ApiService.post(`/customCategory`, category)
  }
  public async delete(categoryId: number) {
    return await ApiService.delete(`/deleteCategory/${categoryId}`)
  }
}

const categoryService = new CategoryService()
export default categoryService
