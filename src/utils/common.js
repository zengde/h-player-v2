const path = require('path');

// 时分秒（00:00:00） 转为 时间戳
export function timeToSec(time) {
  let s = '';
  const hour = time.split(':')[0];
  const min = time.split(':')[1];
  const sec = time.split(':')[2];
  s = Number(hour * 3600) + Number(min * 60) + Number(sec);
  return s;
}

// 时间戳 格式化为 时分秒（00:00:00）
export function secToTime(s) {
  let t;
  if (s > -1) {
    const hour = Math.floor(s / 3600);
    const min = Math.floor(s / 60) % 60;
    const sec = s % 60;
    if (hour < 10) {
      t = `0${hour}:`;
    } else {
      t = `${hour}:`;
    }
    if (min < 10) {
      t += '0';
    }
    t += `${min}:`;
    if (sec < 10) {
      t += '0';
    }
    t += Math.ceil(sec);
  }
  return t;
}

// 字符转对象
export function parseProgressLine(line) {
  return line
    .replace(/=\s+/g, '=')
    .trim()
    .split(' ')
    .map(it => it.split('='))
    .reduce((obj, it) => Object.assign(obj, { [it[0]]: it[1] }), {});
}

// 时间转秒
export function timemarkToSeconds(timemark) {
  // console.log(timemark) 00:01:56.26
  if (typeof timemark === 'number') {
    return timemark;
  }
  if (timemark.indexOf(':') === -1 && timemark.indexOf('.') >= 0) {
    return Number(timemark);
  }
  const parts = timemark.split(':');
  // add seconds
  let secs = Number(parts.pop());
  if (parts.length) {
    // add minutes
    secs += Number(parts.pop()) * 60;
  }
  if (parts.length) {
    // add hours
    secs += Number(parts.pop()) * 3600;
  }
  return secs;
}

// 获取当前进度
export function getProgress(data, duration) {
  // ret.percent = (utils.timemarkToSeconds(time) / command._ffprobeData.format.duration)) * 100;
  const progressObj = parseProgressLine(data.toString());
  const time = progressObj && progressObj.time;
  if (time != null) {
    return +((timemarkToSeconds(time) / duration) * 100).toFixed(2);
  }
  return NaN;
}

// 当前时间
export function dateNow() {
  return new Date()
    .toLocaleString()
    .replace(/\//g, '-')
    .replace(/:/g, '-');
}

// 通过用户路径获取文件名
export function getFilename(filename) {
  const filenameArr = filename.split(path.sep);
  return ((filenameArr[filenameArr.length - 1]).split('.'))[0];
}
