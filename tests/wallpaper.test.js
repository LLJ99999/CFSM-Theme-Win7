import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  WALLPAPER_BASE,
  normalizeSiteWallpaper,
  normalizeWallpaperChoice,
  resolveWallpaper,
  slideshowKey,
  wallpaperUrl
} from '../src/composables/useWallpaper.js'

test('站点值：预设、地址，其他回到 china', () => {
  assert.equal(normalizeSiteWallpaper('CN2'), 'cn2')
  assert.equal(normalizeSiteWallpaper('aero'), 'aero')
  assert.equal(normalizeSiteWallpaper('https://x.test/a.jpg'), 'https://x.test/a.jpg')
  for (const value of [undefined, '', 'bogus', 3]) assert.equal(normalizeSiteWallpaper(value), 'china')
})

test('访客值：未知为 default，不接受地址', () => {
  assert.equal(normalizeWallpaperChoice('cn6'), 'cn6')
  assert.equal(normalizeWallpaperChoice('https://x.test/a.jpg'), 'default')
  assert.equal(normalizeWallpaperChoice(null), 'default')
})

test('图片地址与轮换', () => {
  assert.equal(wallpaperUrl('cn1'), `${WALLPAPER_BASE}CN-wp1.jpg`)
  assert.equal(wallpaperUrl('cn3', 'https://img.test/w'), 'https://img.test/w/CN-wp3.jpg')
  assert.equal(slideshowKey(0), 'cn1')
  assert.equal(slideshowKey(30 * 60 * 1000), 'cn2')
  assert.equal(slideshowKey(6 * 30 * 60 * 1000), 'cn1')
})

test('resolveWallpaper：访客优先，aero 不用图片', () => {
  assert.equal(resolveWallpaper('cn2', 'aero'), wallpaperUrl('cn2'))
  assert.equal(resolveWallpaper('default', 'aero'), '')
  assert.equal(resolveWallpaper('aero', 'cn2'), '')
  assert.equal(resolveWallpaper('default', 'https://x.test/a.jpg'), 'https://x.test/a.jpg')
  assert.equal(resolveWallpaper('default', 'china', undefined, 0), wallpaperUrl('cn1'))
})
