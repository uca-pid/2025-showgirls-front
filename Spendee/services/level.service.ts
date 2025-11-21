import ApiService from './api.service'

export interface LevelUserResponse {
  level: number
}

class LevelService {
  public async findByUserId(userId: string) {
    return await ApiService.get<LevelUserResponse>(`/levels/${userId}`)
  }
  public async findObjectiveByLevelId(levelId: string) {
    return await ApiService.get(`/levels/objetivos/${levelId}`)
  }
}

const levelService = new LevelService()
export default levelService
