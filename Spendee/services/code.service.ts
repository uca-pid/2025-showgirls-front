import ApiService from './api.service'

export interface CodeResponse {
  redirect: string
}

class CodeService {
  public async getCode(userId: string) {
    return await ApiService.post<CodeResponse>('/oauth/code', {
      userId: userId,
    })
  }
}

const codeService = new CodeService()
export default codeService
