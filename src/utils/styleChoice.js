// 主题内置风格：body 类名与 win2000.css / xp.css / win31.css / osx.css 对应，win7.css 对应；Win7 为默认，Win2000 不加类名
export const STYLES = ['win7', 'win2000', 'xp', 'win31', 'osx']
export const DEFAULT_STYLE = 'win7'
export const STYLE_CLASSES = { win7: 'style-win7', win2000: '', xp: 'style-xp', win31: 'style-win31', osx: 'style-osx' }

const toKey = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '')

export const normalizeStyle = (value) => {
  const key = toKey(value)
  return STYLES.includes(key) ? key : DEFAULT_STYLE
}

// 访客选择：'default' 表示跟随站点默认
export const normalizeStyleChoice = (value) => {
  const key = toKey(value)
  return STYLES.includes(key) ? key : 'default'
}

export const resolveStyle = (choice, siteStyle) => {
  return STYLES.includes(choice) ? choice : normalizeStyle(siteStyle)
}
