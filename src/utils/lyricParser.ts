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
  console.log('this is noop')
}

export default class Lyric {
  private lrc: string
  private tags: { [propName: string]: string }
  private lines: ILine[]
  private handler: (item: { txt: string; lineNum: number }) => void
  private state: number
  private curLine: number
  constructor(lrc: string, hanlder = noop) {
    this.lrc = lrc
    this.tags = {}
    this.lines = []
    this.handler = hanlder
    this.state = STATE_PAUSE
    this.curLine = 0

    this._init()
  }

  private _init() {
    this._initTag()

    this._initLines()
  }

  private _initTag() {
    // const field of Object.keys(this.formErrors)
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
            time: result[1] * 60 * 1000 + result[2] * 1000 + (result[3] || 0) * 10,
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
    let line = this.lines[this.curNum]
    let delay = line.time - (+new Date() - this.startStamp)

    this.timer = setTimeout(() => {
      this._callHandler(this.curNum++)
      if (this.curNum < this.lines.length && this.state === STATE_PLAYING) {
        this._playRest()
      }
    }, delay)
  }

  private play(startTime = 0, skipLast) {
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

  private togglePlay() {
    var now = +new Date()
    if (this.state === STATE_PLAYING) {
      this.stop()
      this.pauseStamp = now
    } else {
      this.state = STATE_PLAYING
      this.play((this.pauseStamp || now) - (this.startStamp || now), true)
      this.pauseStamp = 0
    }
  }

  private stop() {
    this.state = STATE_PAUSE
    clearTimeout(this.timer)
  }

  private seek(offset) {
    this.play(offset)
  }
}
