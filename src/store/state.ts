export interface Indicator {
  text: string
  tip?: string
  visible: boolean
}

export interface State {
  indicator: Indicator
}

// 初始状态
const stateData: State = {
  indicator: { text: '正在加载...', tip: '', visible: false }
}

export default stateData
