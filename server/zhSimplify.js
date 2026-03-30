/**
 * 伺服器輸出給前端的繁體文案 → 簡體（OpenCC tw→cn）
 */
import { Converter } from 'opencc-js/t2cn'

let convert = null
function getConvert () {
  if (!convert) {
    convert = Converter({ from: 'tw', to: 'cn' })
  }
  return convert
}

export function toSimplified (str) {
  if (str == null || typeof str !== 'string') return str
  return getConvert()(str)
}

export function toSimplifiedDeep (value) {
  if (value == null) return value
  if (typeof value === 'string') return toSimplified(value)
  if (typeof value === 'number' || typeof value === 'boolean') return value
  if (Array.isArray(value)) return value.map(v => toSimplifiedDeep(v))
  if (typeof value === 'object') {
    const out = {}
    for (const k of Object.keys(value)) {
      out[k] = toSimplifiedDeep(value[k])
    }
    return out
  }
  return value
}
