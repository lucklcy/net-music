import configParams from '@/common/config'
const { VIEW_PORT_WIDTH: WIDTH, REM_DOT_COUNT: FIXED } = configParams

export default function(v: number, width: number) {
  width = width || WIDTH
  v = (Number(v) / width) * 100
  const result = v.toFixed(FIXED)
  return result
}
