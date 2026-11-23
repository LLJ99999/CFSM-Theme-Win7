<template>
  <div ref="rootRef" class="menu-anchor">
    <button
      ref="buttonRef"
      type="button"
      class="title-btn"
      :title="buttonLabel"
      :aria-label="buttonLabel"
      aria-haspopup="menu"
      :aria-expanded="open ? 'true' : 'false'"
      @click="toggleMenu"
      @keydown.down.prevent="openMenu"
    >
      <WinIcon name="display" :size="9" />
    </button>
    <div v-if="open" class="win popup-menu" role="menu" :aria-label="trans.w2kStyle" @keydown="handleMenuKeydown">
      <template v-for="(item, index) in items" :key="item.kind + item.value">
        <div v-if="item.header" class="popup-menu-header" role="presentation">{{ item.header }}</div>
        <button
          :ref="(el) => setItemRef(el, index)"
          type="button"
          class="popup-menu-item"
          role="menuitemradio"
          :aria-checked="isChecked(item) ? 'true' : 'false'"
          tabindex="-1"
          @click="choose(item)"
        >
          <span class="popup-menu-check" aria-hidden="true">{{ isChecked(item) ? '✓' : '' }}</span>
          <span>{{ item.label }}</span>
        </button>
        <div v-if="item.sepAfter" class="popup-menu-sep" role="separator"></div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import WinIcon from './WinIcon.vue'
import { useStyle } from '../composables/useStyle'
import { WALLPAPER_CHOICES, useWallpaper } from '../composables/useWallpaper'
import { STYLES } from '../utils/styleChoice'
import { useTranslation } from '../utils/i18n'

const trans = useTranslation()
const { styleChoice, siteStyle, effectiveStyle, setStyle } = useStyle()
const { wallpaperChoice, siteWallpaper, setWallpaper } = useWallpaper()

const open = ref(false)
const rootRef = ref(null)
const buttonRef = ref(null)
const itemEls = []

const STYLE_NAME_KEYS = { win7: 'w2kStyleWin7', win2000: 'w2kStyleWin2000', xp: 'w2kStyleXp', win31: 'w2kStyleWin31', osx: 'w2kStyleOsx' }
const styleName = (style) => trans.value[STYLE_NAME_KEYS[style]] || style

const WALLPAPER_NAME_KEYS = {
  china: 'w7WallpaperChina', aero: 'w7WallpaperAero',
  cn1: 'w7WallpaperCn1', cn2: 'w7WallpaperCn2', cn3: 'w7WallpaperCn3',
  cn4: 'w7WallpaperCn4', cn5: 'w7WallpaperCn5', cn6: 'w7WallpaperCn6'
}
const wallpaperName = (value) => trans.value[WALLPAPER_NAME_KEYS[value]] || (/^https?:/i.test(value) ? 'URL' : value)

const items = computed(() => {
  const list = [
    { kind: 'style', value: 'default', label: trans.value.w2kStyleDefault.replace('{name}', styleName(siteStyle.value)), sepAfter: true },
    ...STYLES.map(style => ({ kind: 'style', value: style, label: styleName(style) }))
  ]
  // 桌面背景只在 Win7 风格下生效，其他风格不显示这一组
  if (effectiveStyle.value === 'win7') {
    list[list.length - 1].sepAfter = true
    list.push(
      { kind: 'wallpaper', value: 'default', header: trans.value.w7Wallpaper, label: trans.value.w7WallpaperDefault.replace('{name}', wallpaperName(siteWallpaper.value)) },
      ...WALLPAPER_CHOICES.map(value => ({ kind: 'wallpaper', value, label: wallpaperName(value) }))
    )
  }
  return list
})

const isChecked = (item) => (item.kind === 'style' ? styleChoice.value : wallpaperChoice.value) === item.value

const buttonLabel = computed(() => trans.value.w2kStyleCurrent.replace('{name}', styleName(effectiveStyle.value)))

const setItemRef = (el, index) => {
  if (el) itemEls[index] = el
}

// 上下键循环切换焦点
const focusItem = (index) => {
  const count = items.value.length
  itemEls[((index % count) + count) % count]?.focus()
}

const openMenu = async () => {
  open.value = true
  await nextTick()
  const checkedIndex = items.value.findIndex(item => item.kind === 'style' && isChecked(item))
  focusItem(checkedIndex < 0 ? 0 : checkedIndex)
}

const closeMenu = (restoreFocus = false) => {
  open.value = false
  if (restoreFocus) buttonRef.value?.focus()
}

const toggleMenu = () => {
  if (open.value) closeMenu()
  else openMenu()
}

const choose = (item) => {
  if (item.kind === 'wallpaper') setWallpaper(item.value)
  else setStyle(item.value)
  closeMenu(true)
}

const handleMenuKeydown = (event) => {
  const currentIndex = itemEls.indexOf(document.activeElement)
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    focusItem(currentIndex + 1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    focusItem(currentIndex - 1)
  } else if (event.key === 'Escape') {
    event.preventDefault()
    closeMenu(true)
  } else if (event.key === 'Tab') {
    closeMenu()
  }
}

const handleDocumentPointerDown = (event) => {
  if (open.value && !rootRef.value?.contains(event.target)) closeMenu()
}

onMounted(() => {
  document.addEventListener('pointerdown', handleDocumentPointerDown)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerDown)
})
</script>
