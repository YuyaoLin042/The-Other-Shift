# 时差便利店 / The Other Shift

一个为不同时区的两位朋友设计的异步随机叙事小游戏。每位玩家完成一次值班、处理一位随机来客，再把不断变化的店铺交给另一位玩家。

这不是固定章节剧本。顾客需求、可选物品、天气、库存、店铺温度、怪事指数与既往选择会重新组合，生成下一班的情境。

## 当前 Demo 包含

- 六位房间码与两位店员
- 白昼班 / 夜晚班异步交接
- 随机顾客、需求、物品选择和结果
- 会累积变化的金币、温度、怪事与口碑
- 共享库存、历史事件和 20 字交班便签
- 无配置本地试玩模式
- 配置 Supabase 后的跨设备共享房间
- GitHub Pages 自动部署配置

## 本地运行

```bash
npm install
npm run dev
```

未配置环境变量时，项目自动进入本地 Demo 模式。创建房间后点击“添加 Demo 伙伴”，即可在同一浏览器切换两个班次试玩核心循环。

## 开启真正的双人房间

1. 在 Supabase 新建一个免费项目。
2. 打开 SQL Editor，运行 `supabase/schema.sql`。
3. 复制 `.env.example` 为 `.env`，填入项目 URL 和 anon key。
4. 重新运行 `npm run dev`。

> 当前数据库策略适合小范围 Demo。任何知道房间码的人都能访问该房间，正式公开前应把行动逻辑移到服务端函数并加强验证。

## 部署到 GitHub Pages

1. 新建 GitHub repository，把本项目全部文件推送到 `main`。
2. Repository → Settings → Pages → Source 选择 **GitHub Actions**。
3. Repository → Settings → Secrets and variables → Actions，添加：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. 再次推送，或手动运行 `Deploy to GitHub Pages` workflow。

`vite.config.js` 已使用相对资源路径，因此可部署到任意 repository 名称下。

## 随机叙事结构

核心规则在 `src/game.js`：

- `VISITORS` 定义人物特征与潜在需求；
- `ITEM_LIBRARY` 定义物品标签；
- `makeEvent()` 根据当前世界状态重新组合事件；
- `resolveTurn()` 计算选择的后果，并改变后续世界；
- 当怪事指数升高或店铺温度降低，来客池也会随之改变。

后续可以继续加入地点、阵营、季节、长期人物记忆和 AI 文本扩写，而不必改动现有交班循环。
