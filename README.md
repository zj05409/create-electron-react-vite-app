# create-electron-react-vite-app

基于 React + Vite + Electron 的跨平台应用模板生成器。

## 特点

- ⚛️ 使用 React 作为UI框架
- ⚡ 使用 Vite 提供快速的开发体验
- 🔌 集成 Electron 提供桌面应用支持
- 📦 支持打包为Windows、macOS和Linux应用
- 🚀 一键创建项目，快速开始开发

## 使用方法

使用npx直接创建项目（推荐）：

```bash
npx create-electron-react-vite-app my-app
```

或者先全局安装：

```bash
npm install -g create-electron-react-vite-app
create-electron-react-vite-app my-app
```

按照提示操作，项目创建完成后：

```bash
cd my-app
npm run dev         # 浏览器中开发
npm run electron:dev # Electron中开发
```

## 项目模板结构

```
项目/
├── electron/       # Electron 相关文件
├── public/         # 静态资源
├── src/            # 源代码
├── vite.config.js  # Vite配置
└── ...             # 其他配置文件
```

## 提供的脚本

- `npm run dev` - 在浏览器中启动开发服务器
- `npm run build` - 构建Web应用
- `npm run electron:dev` - 在Electron中启动开发环境
- `npm run electron:build` - 构建Electron应用（当前平台）
- `npm run electron:build:win` - 构建Windows应用
- `npm run electron:build:mac` - 构建macOS应用
- `npm run electron:build:linux` - 构建Linux应用
- `npm run electron:build:all` - 构建所有平台应用

## 许可证

MIT 