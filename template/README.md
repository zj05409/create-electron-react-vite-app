# Electron React Vite 应用

基于 React + Vite + Electron 的跨平台应用。

## 功能特点

- 支持浏览器运行
- 支持 Electron 本地运行
- 支持 Electron 跨平台打包(Windows, macOS, Linux)
- 内置脚本支持
- 符合前端项目规范

## 开发指南

### 安装依赖

```bash
npm install
```

### 开发模式

在浏览器中运行：

```bash
npm run dev
```

在 Electron 中运行：

```bash
npm run electron:dev
```

### 构建应用

构建网页版：

```bash
npm run build
```

构建 Electron 应用(根据当前系统)：

```bash
npm run electron:build
```

构建特定平台应用：

```bash
# Windows
npm run electron:build:win

# macOS
npm run electron:build:mac

# Linux
npm run electron:build:linux

# 所有平台
npm run electron:build:all
```

## 项目结构

```
项目/
├── electron/       # Electron 相关文件
├── public/         # 静态资源
├── src/            # 源代码
└── ...             # 配置文件
```

## 许可证

MIT 