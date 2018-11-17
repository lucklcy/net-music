export function getNow() {
  return window.performance && window.performance.now
    ? window.performance.now() + window.performance.timing.navigationStart
    : +new Date()
}

export function extend(target: any, ...rest: any[]) {
  for (let i = 0; i < rest.length; i++) {
    const source = rest[i]
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key]
      }
    }
  }
  return target
}

export function isUndef(v: any) {
  return v === undefined || v === null
}

export function getDistance(x: number, y: number) {
  return Math.sqrt(x * x + y * y)
}
