import { computed, ref } from 'vue'

// Win7 风格的桌面背景。图片不在仓库里，默认从 WALLPAPER_BASE 读取；
// 站长可在主题配置 JSON 里用 win7_wallpaper_base 换成自己的地址。
export const WALLPAPER_BASE = 'https://wallpaper.zhigeng.io/cn/'
export const WALLPAPERS = ['cn1', 'cn2', 'cn3', 'cn4', 'cn5', 'cn6']
export const WALLPAPER_CHOICES = ['china', ...WALLPAPERS, 'aero']
export const DEFAULT_WALLPAPER = 'china'
// 「中国」主题轮换间隔，和 Win7 幻灯片放映默认值一样
const SLIDESHOW_MS = 30 * 60 * 1000

export const WALLPAPER_STORAGE_KEY = 'win7_wallpaper'
const SITE_WALLPAPER_STORAGE_KEY = 'win7_wallpaper_site'

const readStorage = (key) => {
  try { return localStorage.getItem(key) } catch (_) { return null }
}
const writeStorage = (key, value) => {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch (_) { /* 写不进去只影响下次访问 */ }
}

const isUrl = (value) => /^https?:\/\//i.test(value)

// 站点值：预设名或图片地址；其他值回到默认
export const normalizeSiteWallpaper = (value) => {
  const text = String(value ?? '').trim()
  if (isUrl(text)) return text
  const lower = text.toLowerCase()
  return WALLPAPER_CHOICES.includes(lower) ? lower : DEFAULT_WALLPAPER
}

// 访客值：预设名或 default（跟随站点）
export const normalizeWallpaperChoice = (value) => {
  const lower = String(value ?? '').trim().toLowerCase()
  return WALLPAPER_CHOICES.includes(lower) ? lower : 'default'
}

export const wallpaperUrl = (key, base = WALLPAPER_BASE) => {
  const index = WALLPAPERS.indexOf(key)
  if (index < 0) return ''
  const root = String(base || WALLPAPER_BASE).replace(/\/?$/, '/')
  return `${root}CN-wp${index + 1}.jpg`
}

export const slideshowKey = (now = Date.now()) => WALLPAPERS[Math.floor(now / SLIDESHOW_MS) % WALLPAPERS.length]

// 结果：'' 表示不用图片（Aero 自绘背景），否则为图片地址
export const resolveWallpaper = (choice, site, base, now = Date.now()) => {
  const value = choice && choice !== 'default' ? choice : site
  if (isUrl(value)) return value
  if (value === 'aero') return ''
  if (value === 'china') return wallpaperUrl(slideshowKey(now), base)
  return wallpaperUrl(value, base)
}

const wallpaperChoice = ref(normalizeWallpaperChoice(readStorage(WALLPAPER_STORAGE_KEY)))
const siteWallpaper = ref(normalizeSiteWallpaper(readStorage(SITE_WALLPAPER_STORAGE_KEY)))
const wallpaperBase = ref(WALLPAPER_BASE)
const tick = ref(Date.now())
const effectiveWallpaper = computed(() => (wallpaperChoice.value !== 'default' ? wallpaperChoice.value : siteWallpaper.value))
const currentUrl = computed(() => resolveWallpaper(wallpaperChoice.value, siteWallpaper.value, wallpaperBase.value, tick.value))

let timer = null
let lastApplied = null

const applyWallpaper = () => {
  if (typeof document === 'undefined' || !document.body) return
  const url = currentUrl.value
  if (url === lastApplied) return
  lastApplied = url
  const body = document.body
  if (!url) {
    body.classList.remove('has-wallpaper')
    body.style.removeProperty('--w7-wallpaper')
    return
  }
  // 先预加载，加载成功再换上，避免换图时闪一下；加载失败就保持原来的背景
  const img = new Image()
  img.onload = () => {
    if (lastApplied !== url) return
    body.style.setProperty('--w7-wallpaper', `url("${url.replace(/"/g, '%22')}")`)
    body.classList.add('has-wallpaper')
  }
  img.src = url
}

const ensureTimer = () => {
  if (timer || typeof window === 'undefined') return
  timer = window.setInterval(() => {
    tick.value = Date.now()
    applyWallpaper()
  }, 60 * 1000)
}

export const applySiteWallpaper = (options) => {
  const opts = options && typeof options === 'object' ? options : {}
  siteWallpaper.value = normalizeSiteWallpaper(opts.win7_wallpaper)
  const base = String(opts.win7_wallpaper_base || '').trim()
  wallpaperBase.value = isUrl(base) ? base : WALLPAPER_BASE
  writeStorage(SITE_WALLPAPER_STORAGE_KEY, siteWallpaper.value)
  applyWallpaper()
  ensureTimer()
}

export const applyStoredWallpaper = () => {
  applyWallpaper()
  ensureTimer()
}

export const useWallpaper = () => {
  const setWallpaper = (choice) => {
    const normalized = normalizeWallpaperChoice(choice)
    wallpaperChoice.value = normalized
    writeStorage(WALLPAPER_STORAGE_KEY, normalized === 'default' ? null : normalized)
    tick.value = Date.now()
    applyWallpaper()
  }
  return { wallpaperChoice, siteWallpaper, effectiveWallpaper, setWallpaper }
}

export default useWallpaper
