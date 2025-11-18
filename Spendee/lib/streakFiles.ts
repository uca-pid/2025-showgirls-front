export function getStreakAnimation(days: number) {
  switch (true) {
    case days === 0:
      return require('@/assets/lottie/Fire animation gray.json')

    case days > 0 && days <= 10:
      return require('@/assets/lottie/Fire animation.json')

    case days > 10 && days <= 30:
      return require('@/assets/lottie/Fire animation second.json')

    case days > 30 && days <= 100:
      return require('@/assets/lottie/Fire animation third.json')

    case days > 100 && days < 365:
      return require('@/assets/lottie/Fire animation fourth.json')

    case days >= 365:
      require('@/assets/lottie/Fire animation fifth.json')
    default:
      return require('@/assets/lottie/Fire animation gray.json')
  }
}
