# Web Virtual Pet Assets / 网页虚拟宠物素材包

本素材包由一张素材总览图拆分而来，适合直接放入前端项目的 `public/assets/` 目录。

## 目录说明

- `pets/cat/actions/`：小猫基础动作帧，包含站立、跳跃、走路、坐下、睡觉、开心、生气、饥饿、撒娇、摸头等。
- `pets/cat/states/`：小猫状态素材，包含开心、饥饿、困了、生病、脏了、升级、获得奖励等。
- `items/food/`：食物道具。
- `items/toys/`：玩具道具。
- `items/cleaning/`：清洁道具。
- `ui/icons/`：心情、饥饿、体力、经验、金币、钻石、等级等图标。
- `ui/buttons/`：签到、商店、背包、设置按钮。
- `ui/status_bars/`：状态条素材。
- `backgrounds/`：房间、书桌、夜晚房间背景。
- `outfits/free/`：免费装扮。
- `outfits/premium/`：付费装扮/皮肤。
- `effects/`：爱心、星星、金币、烟雾、Zzz、感叹号、气泡等特效。
- `share/`：分享卡片模板和相关裁切图。
- `source_reference/`：原始素材总览图，可作为美术风格参考。
- `asset_manifest.json`：素材清单、分类、原图裁切坐标和输出尺寸。

## Cursor 使用建议

你可以把整个文件夹复制到项目中：

```text
public/assets/web_virtual_pet_assets/
```

React 中可以这样引用：

```jsx
<img src="/assets/web_virtual_pet_assets/pets/cat/actions/cat_idle_01.png" />
```

基础帧动画可以这样组织：

```js
const idleFrames = [
  '/assets/web_virtual_pet_assets/pets/cat/actions/cat_idle_01.png',
  '/assets/web_virtual_pet_assets/pets/cat/actions/cat_idle_02.png',
];

const walkFrames = [
  '/assets/web_virtual_pet_assets/pets/cat/actions/cat_walk_01.png',
  '/assets/web_virtual_pet_assets/pets/cat/actions/cat_walk_02.png',
];
```

## 注意

这些素材是从一张展示图中自动裁切出来的，已经尽量去掉背景并保留透明 PNG，但个别边缘可能仍有轻微底色或阴影。正式上线前，建议再由设计工具精修一版。

当前素材数量：82 个。
