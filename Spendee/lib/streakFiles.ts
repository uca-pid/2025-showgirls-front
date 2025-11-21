import { StreakResponse } from '@/services/streak.service'

export const streakAnims = [
  {
    days: 0,
    color: '#8080800',
    animation: require('@/assets/lottie/Fire animation gray.json'),
  },
  {
    days: 1,
    color: 'orange',
    animation: require('@/assets/lottie/Fire animation.json'),
  },
  {
    days: 10,
    color: '#FF7300',
    animation: require('@/assets/lottie/Fire animation second.json'),
  },
  {
    days: 30,
    color: '#FF1A00',
    animation: require('@/assets/lottie/Fire animation third.json'),
  },
  {
    days: 100,
    color: '#00A3FF',
    animation: require('@/assets/lottie/Fire animation fourth.json'),
  },
  {
    days: 200,
    color: '#FE2870',
    animation: require('@/assets/lottie/Fire animation fifth.json'),
  },
]

export function getStreakAnimation(streakData: StreakResponse | undefined) {
  if (!streakData) return streakAnims[0]
  const days = streakData.rachaActual
  const isInactive = streakData.isInactive

  switch (true) {
    case days === 0 || isInactive:
      return streakAnims[0]

    case days > 0 && days <= 10:
      return streakAnims[1]

    case days > 10 && days <= 30:
      return streakAnims[2]

    case days > 30 && days <= 100:
      return streakAnims[3]

    case days > 100 && days < 365:
      return streakAnims[4]

    case days > 365 && days < 500:
      return streakAnims[5]
    case days >= 500:
      return streakAnims[50]
  }
}
