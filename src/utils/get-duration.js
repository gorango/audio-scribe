export default async function (url) {
  return new Promise(resolve => {
    const player = new Audio(url)
    player.addEventListener('durationchange', () => {
      if (this.duration !== Infinity) {
        const duration = this.duration
        player.remove()
        resolve(duration)
      }
    }, false)
    player.load()
    player.currentTime = 24 * 60 * 60 // fake big time
    player.volume = 0
    player.play()
  })
}
