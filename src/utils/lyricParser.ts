const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g

const STATE_PAUSE = 0
const STATE_PLAYING = 1

interface ITagReg {
  [propName: string]: string
}
interface ILine {
  time: number
  txt: string
}
const tagRegMap: ITagReg = {
  title: 'ti',
  artist: 'ar',
  album: 'al',
  offset: 'offset',
  by: 'by'
}

function noop(item: { txt: string; lineNum: number }) {
  console.log({ item })
}

export default class Lyric {
  public lines: ILine[]
  private lrc: string
  private tags: { [propName: string]: string }
  private handler: (item: { txt: string; lineNum: number }) => void
  private state: number
  private curLine: number
  private pauseStamp: number
  private startStamp: number
  private timer: number
  private curNum: number
  constructor(lrc: string, hanlder = noop) {
    this.lrc = lrc
    this.tags = {}
    this.lines = []
    this.handler = hanlder
    this.state = STATE_PAUSE
    this.curLine = 0
    this.curNum = 0

    this._init()
  }

  public play(startTime = 0, skipLast: boolean = false) {
    if (!this.lines.length) {
      return
    }
    this.state = STATE_PLAYING

    this.curNum = this._findCurNum(startTime)
    this.startStamp = +new Date() - startTime

    if (!skipLast) {
      this._callHandler(this.curNum - 1)
    }

    if (this.curNum < this.lines.length) {
      clearTimeout(this.timer)
      this._playRest()
    }
  }

  public seek(offset: number) {
    this.play(offset)
  }

  public togglePlay() {
    const now = +new Date()
    if (this.state === STATE_PLAYING) {
      this.stop()
      this.pauseStamp = now
    } else {
      this.state = STATE_PLAYING
      this.play((this.pauseStamp || now) - (this.startStamp || now), true)
      this.pauseStamp = 0
    }
  }

  public stop() {
    this.state = STATE_PAUSE
    clearTimeout(this.timer)
  }

  public destroy() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.lrc = ''
    this.tags = {}
    this.lines = []
    this.handler = noop
    this.state = STATE_PAUSE
    this.curLine = 0
    this.curNum = 0
  }

  private _init() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    if (this.lrc && this.lrc !== '') {
      this._initTag()
      this._initLines()
    }
  }

  private _initTag() {
    for (const tag of Object.keys(tagRegMap)) {
      const matches = this.lrc.match(new RegExp(`\\[${tagRegMap[tag]}:([^\\]]*)]`, 'i'))
      this.tags[tag] = (matches && matches[1]) || ''
    }
  }

  private _initLines() {
    const lines = this.lrc.split('\n')
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const result = timeExp.exec(line)
      if (result) {
        const txt = line.replace(timeExp, '').trim()
        if (txt) {
          this.lines.push({
            time: Number(result[1]) * 60 * 1000 + Number(result[2]) * 1000 + Number(result[3] || 0),
            txt
          })
        }
      }
    }

    this.lines.sort((a, b) => {
      return a.time - b.time
    })
  }

  private _findCurNum(time: number) {
    for (let i = 0; i < this.lines.length; i++) {
      if (time <= this.lines[i].time) {
        return i
      }
    }
    return this.lines.length - 1
  }

  private _callHandler(i: number) {
    if (i < 0) {
      return
    }
    this.handler({
      txt: this.lines[i].txt,
      lineNum: i
    })
  }

  private _playRest() {
    const line = this.lines[this.curNum]
    const delay = line.time - (+new Date() - this.startStamp)

    this.timer = setTimeout(() => {
      this._callHandler(this.curNum++)
      if (this.curNum < this.lines.length && this.state === STATE_PLAYING) {
        this._playRest()
      }
    }, delay)
  }
}
