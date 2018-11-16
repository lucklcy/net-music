import configParams from '@/common/config'
const { VIEW_PORT_WIDTH: WIDTH, REM_DOT_COUNT: FIXED } = configParams

export default function(v, width) {
  width = width || WIDTH
  v = Number(v)
  v = (v / width) * 100
  v = v.toFixed(FIXED)
  return v
}
