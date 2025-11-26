import ApiService from './api.service'

export interface CodeResponse {
  redirect: string
}

class CodeService {
  public async getCode() {
    return await ApiService.post<CodeResponse>('/oauth/code')
  }
}

const codeService = new CodeService()
export default codeService
