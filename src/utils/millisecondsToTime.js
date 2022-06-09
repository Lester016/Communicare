export function millisecondsToTime(milli) {
  var seconds = Math.floor((milli / 1000) % 60);
  var minutes = Math.floor((milli / (60 * 1000)) % 60);

  return minutes + ":" + seconds;
}
