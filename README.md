# CFSM-Theme-Win7

[CF-Server-Monitor](https://github.com/huilang-me/CF-Server-Monitor/) 的 Windows 7（Aero）风格第三方主题。

基于 [CF-Server-Monitor-theme-win2000](https://github.com/finch-xu/CF-Server-Monitor-theme-win2000)（MIT）改造：保留它的全部功能与 Win2000 / XP / Win3.1 / Mac OS X 风格，新增 **Windows 7** 风格并设为默认。

## Windows 7 风格

- Aero 玻璃窗框：半透明蓝色 + 背景模糊 + 斜向反光，标题文字带白色光晕，右上角装饰性的最小化 / 最大化 / 关闭按钮
- 资源管理器式命令栏、Win7 蓝色悬停 / 选中高亮、详细信息列表视图
- Win7 按钮（含默认按钮的蓝色呼吸光晕）、选项卡、分组框、带流光的绿色玻璃进度条
- 白到淡紫灰渐变的提示框、带图标槽的弹出菜单、底部灰色按钮条的对话框
- 浅色为 Aero 标准配色，深色为 Aero 深色玻璃；跟随后台「默认外观」和访客切换
- 图表沿用任务管理器的黑底绿网格
- 桌面背景为 CSS 自绘，不包含任何微软的壁纸、图标或字体文件；控件配色参考 [7.css](https://github.com/khang-nd/7.css)（MIT）

### 桌面背景

Win7 风格默认用 Windows 7 中文版「中国」主题的六张壁纸轮换（每 30 分钟换一张）：桂林漓江、雪中长城、冬日黄山、龙脊梯田、三亚亚龙湾、十七孔桥。访客可在「风格」菜单下半部分选某一张、轮换或 Aero（无图片）。

壁纸版权属于微软及原摄影师，不包含在本仓库里，默认从 `https://wallpaper.zhigeng.io/cn/` 读取。站长可在后台主题配置 JSON 里修改：

```json
{
  "win7_wallpaper": "china",
  "win7_wallpaper_base": "https://你的图床/cn/"
}
```

`win7_wallpaper` 可填 `china`（轮换）、`cn1`~`cn6`、`aero`（不用图片），也可以直接填一张图片的完整地址。`win7_wallpaper_base` 目录下需要有 `CN-wp1.jpg` ~ `CN-wp6.jpg`。

访客可在标题栏的「风格」菜单里切换风格；站点默认风格可在后台主题配置 JSON 里设置 `{"win2000_style": "win7"}`（可选 `win7` / `win2000` / `xp` / `win31` / `osx`）。

## 使用

后台 → 主题 → 自定义主题，填入 build 分支某个 commit 的地址：

```
https://github.com/LLJ99999/CFSM-Theme-Win7/tree/<build 分支 commit id>
```

## 开发

```bash
npm install
npm run mock   # 本地模拟 Worker
npm run dev
npm run build  # 产物在 dist/（index.html + assets/）
```

## 许可

MIT。原主题版权归原作者，见 LICENSE。
