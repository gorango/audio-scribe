export default function minsToStamp (mins) {
  var sign = mins < 0 ? '-' : ''
  var min = Math.floor(Math.abs(mins))
  var sec = Math.floor((Math.abs(mins) * 60) % 60)
  return sign + (min < 10 ? '0' : '') + min + ':' + (sec < 10 ? '0' : '') + sec
}
