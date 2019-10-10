import ffmpeg from 'fluent-ffmpeg';
import { timeToSec } from './common';

const tmp = require('tmp');
const { exec, spawn } = require('child_process');

const ffmpegPath = 'ffmpeg';
const ffprobePath = 'ffprobe';
const { shell } = require('electron');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

class ChildProcessFFmpeg {
  counter = 0;

  constructor() {
    this.ffmpeg = null;
    this.vcodec = '';
    this.metaData = {};
    this.outputPath = '';
  }

  // convert
  async convert({
    inputPath, outputPath, onProgress, command, format, time, onFinish,
  }) {
    const originPath = inputPath.length > 1 ? inputPath : inputPath[0];

    try {
      this.outputPath = outputPath;
      const info = await this._getInfo(originPath);
      this.metaData = await this._gatherData(info);
      this.savefile = `${outputPath}/${this.metaData.fileName}${this._dateNow()}.${format}`;

      Promise.resolve(
        this[command]({
          inputPath: originPath,
          outputPath,
          time,
        }),
      ).then((it) => {
        this.spawnFFmpeg(
          it.concat(this.savefile),
          onProgress,
          onFinish,
        );
      });
    } catch (error) {
      this.deskNotification('文件转换失败！', error);
      console.error(error);
    }
  }

  // child_process run ffmpeg
  spawnFFmpeg(commandLine, onProgress, onFinish) {
    console.log(commandLine);
    exec(`${ffmpegPath} -h`, (err) => {
      if (err) {
        console.log(err);
      }
      this.ffmpeg = spawn(`${ffmpegPath}`, commandLine);
      // 捕获标准输出
      this.ffmpeg.stderr.on('data', (data) => {
        onProgress(
          this.extractProgress(this.metaData.duration, data.toString()),
        );
      });
      // 注册子进程关闭事件
      this.ffmpeg.on('exit', (code, signal) => {
        console.log(code, signal);
        onFinish(this.savefile);
        this.deskNotification('文件转换成功！', '点击以在窗口中显示该文件');
      });
      // 注册子进程错误事件
      this.ffmpeg.on('error', err2 => console.log(err2));
    });
  }

  // stop ffmpeg
  stop() {
    if (this.ffmpeg !== null) this.ffmpeg.kill('SIGINT');
  }

  // convert Video
  // ffmpeg -i test.webm -vcodec h264_videotoolbox -b:v 1744.5k test.mp4
  convertVideo({ inputPath }) {
    return [
      '-i',
      inputPath,
      '-vcodec',
      this.vcodec,
      '-b:v',
      this.metaData.bitRate,
    ];
  }

  // convert Audio
  // ffmpeg -i test.flac -acodec libmp3lame test.mp3
  convertAudio({ inputPath }) {
    this.fake();
    return ['-i', inputPath, '-acodec', 'libmp3lame'];
  }

  // Cut Audio
  // ffmpeg -i test.mp3 -ss 66 -t 110 -acodec copy test.mp3
  convertCutAudio({ inputPath, time }) {
    this.fake();
    const [startTime, endTime] = time;
    const duration = endTime - startTime;
    return [
      '-i',
      inputPath,
      '-ss',
      startTime,
      '-t',
      duration,
      '-acodec',
      'copy',
    ];
  }

  // Cut Video
  // ffmpeg -i test.mp4 -ss 66 -t 110 -vcode copy -acodec copy test.mp4
  // ('-metadata', 'title=song x') 写入媒体信息
  convertCutVideo({ inputPath, time }) {
    this.fake();
    const [startTime, endTime] = time;
    const duration = endTime - startTime;
    return [
      '-i',
      inputPath,
      '-ss',
      startTime,
      '-t',
      duration,
      '-vcodec',
      'copy',
      '-acodec',
      'copy',
    ];
  }

  // Merge
  // ffmpeg -y -i filename1 -i filename2 -vcode copy -acodec copy test.mp4
  convertMerge({ inputPath }) {
    this.fake();
    const [videoPath, aidioPath] = inputPath;
    return [
      '-i',
      videoPath,
      '-i',
      aidioPath,
      '-vcodec',
      'copy',
      '-acodec',
      'copy',
    ];
  }

  // convert GIF
  // ffmpeg -ss 2.6 -t 1.3 -i video.mp4 -vf fps = 15，scale = 320：-1：flags = lanczos，palettegen palette.png
  // ffmpeg -ss 2.6 -t 1.3 -i video.mp4 -i palette.png -filter_complex “fps=15,scale=400:-1:flags=lanczos[x];[x][1:v]paletteuse” sixthtry.gif
  async convertGIF({ inputPath, time }) {
    const [startTime, endTime] = time;
    const duration = endTime - startTime;

    this.metaData = { ...this.metaData, duration };

    // 生成调色板
    const palettePath = tmp.tmpNameSync({ postfix: '.png' });

    await this._run([
      '-ss',
      startTime,
      '-t',
      duration,
      '-i',
      inputPath,
      '-vf',
      'fps=15,scale=-1:-1::flags=lanczos,palettegen',
      palettePath,
    ]);

    // 生成gif
    return [
      '-ss',
      startTime,
      '-t',
      duration,
      '-i',
      inputPath,
      '-i',
      palettePath,
      '-filter_complex',
      'fps=15,scale=-1:-1:flags=lanczos[x]; [x][1:v]paletteuse',
    ];
  }

  // ffmpeg -i url.m3u8 -c copy output.mp4
  downLoadM3u8({ inputPath }) {
    this.fake();
    return [
      '-i',
      inputPath,
      '-c',
      'copy',
    ];
  }

  fake() {
    this.counter += 1;
  }

  // 字符转对象
  parseProgressLine(line) {
    this.fake();
    const progress = {};

    // Remove all spaces after = and trim
    line = line.replace(/=\s+/g, '=').trim();
    const progressParts = line.split(' ');

    // Split every progress part by '=' to get key and value
    for (let i = 0; i < progressParts.length; i += 1) {
      const progressSplit = progressParts[i].split('=', 2);
      const key = progressSplit[0];
      const value = progressSplit[1];

      // This is not a progress line
      if (typeof value === 'undefined') return null;

      progress[key] = value;
    }

    return progress;
  }

  // 获取进度
  extractProgress(duration, stderrLine) {
    const progress = this.parseProgressLine(stderrLine);

    if (progress) {
      // build progress report object
      const ret = {
        frames: parseInt(progress.frame, 10),
        currentFps: parseInt(progress.fps, 10),
        currentKbps: progress.bitrate
          ? parseFloat(progress.bitrate.replace('kbits/s', ''))
          : 0,
        targetSize: parseInt(progress.size || progress.Lsize, 10),
        timemark: progress.time,
      };

      // calculate percent progress using duration
      if (duration) {
        duration = Number(duration);
        if (!Number.isNaN(duration)) ret.percent = (timeToSec(ret.timemark) / duration) * 100;
      }
      return ret.percent.toFixed(2);
    }
    return NaN;
  }

  // run
  _run(commandLine) {
    return new Promise((resolve, reject) => {
      exec(`${ffmpegPath} -h`, (err) => {
        if (err) {
          reject(err);
        }
        this.ffmpeg = spawn(`${ffmpegPath}`, commandLine);
        this.ffmpeg.on('exit', () => {
          resolve();
        });
      });
    });
  }

  // 读取媒体信息
  async getMediaInfo(inputPath) {
    try {
      const info = await this._getInfo(inputPath);
      const mediaInfo = await this._gatherData(info);
      const hwaccels = await this._getAvailableHwaccels();
      console.log(hwaccels);
      this.vcodec = 'libx264'; // hwaccels.length ? hwaccels[0] : 'libx264'; //如果不支持硬解就用软解
      return mediaInfo;
    } catch (error) {
      console.log(error);
      return {};
    }
  }

  // 获取媒体相关信息
  // ffprobe -of json -show_streams -show_format /path/to/file.avi
  _getInfo(inputPath) {
    this.fake();
    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(inputPath)
        .ffprobe((err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
    });
  }

  // 解析并整合媒体相关信息
  _gatherData(data) {
    console.dir(data);
    const stream = data.streams.find(element => element.codec_type === 'video');
    const {
      format: {
        bit_rate: bitRate = 0,
        tags = {},
        duration = 0,
        filename = '',
        start_time: startTime = '',
      },
    } = data;

    return {
      fps: this._getFps(stream.r_frame_rate),
      width: stream.width,
      height: stream.height,
      start: parseInt(startTime, 10) || 0,
      duration,
      bitRate: `${parseInt(bitRate / 1000, 10) * 1.5}K`,
      tags,
      fileName: this._getFilename(filename),
    };
  }

  // 获取文件名称
  _getFilename(filename) {
    this.fake();
    // 统一转为/, 方便支持url
    filename = filename.replace(path.sep, '/');
    const filenameArr = filename.split('/');
    const fullName = filenameArr[filenameArr.length - 1];
    return fullName.slice(0, fullName.lastIndexOf('.'));
  }

  // 获取fps
  _getFps(fpsStr) {
    this.fake();
    const parts = fpsStr.split('/').map(v => parseInt(v, 10));
    return parts[0] / parts[1];
  }

  // 打开文件或者文件夹
  _openFolder(filepath) {
    this.fake();
    shell.openItem(filepath);
  }

  // 桌面通知
  // new Notification('title', {body: 'message', icon: 'path/to/image.png'});
  deskNotification(title, body) {
    const myNotification = new Notification(title, {
      body,
    });
    myNotification.onclick = () => {
      this._openFolder(this.outputPath);
    };
  }

  // 获取当前时间
  _dateNow() {
    return this._timetrans(new Date().getTime());
  }

  // 解析时间
  _timetrans(date) {
    this.fake();
    const d = new Date(date.toString().length <= 10 ? date * 1000 : +date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const h = d.getHours();
    const m = d.getMinutes();
    const s = d.getSeconds();
    const datestr = [
      d.getFullYear(),
      month < 10 ? `0${month}` : month,
      day < 10 ? `0${day}` : day,
    ].join('-');
    const timestr = [
      h < 10 ? `0${h}` : h,
      m < 10 ? `0${m}` : m,
      s < 10 ? `0${s}` : s,
    ].join('-');
    return `${datestr}-${timestr}`;
  }

  // 获取可用的硬件加速方法
  _getAvailableHwaccels = () => new Promise((resolve, reject) => {
    ffmpeg.prototype._spawnFfmpeg(
      ['-hwaccels'],
      { captureStdout: true, stdoutLines: 0 },
      (err, stdoutRing) => {
        if (err) {
          reject(err);
        }
        const stdout = stdoutRing.get();
        const lines = [
          ...new Set(
            stdout
              .replace('Hardware acceleration methods:', '')
              .replace(/\n/g, ' ')
              .trim()
              .split(' '),
          ),
        ];
        ffmpeg.getAvailableEncoders((err2, encoders) => {
          if (err2) {
            reject(err2);
          }
          const reslut = lines.reduce((total, it) => total.concat(
            Object.keys(encoders).filter(encodersName => encodersName.includes(it)),
          ), []);
          resolve(reslut);
        });
      },
    );
  });
}

export default ChildProcessFFmpeg;
