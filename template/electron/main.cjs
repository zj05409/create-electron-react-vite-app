const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

// 判断是否为开发环境
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

// 保持对window对象的全局引用，避免JavaScript对象被垃圾回收时，窗口被自动关闭
let mainWindow;

function createWindow() {
    // 创建浏览器窗口
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false, // 允许加载本地文件
        },
        icon: path.join(__dirname, '../public/favicon.ico')
    });

    // 加载应用
    let startUrl;

    if (isDev) {
        // 开发环境
        startUrl = 'http://localhost:3000';
    } else {
        // 生产环境
        const buildPath = path.join(__dirname, '../build/index.html');
        const distPath = path.join(__dirname, '../dist/index.html');

        if (fs.existsSync(buildPath)) {
            startUrl = `file://${buildPath}`;
        } else if (fs.existsSync(distPath)) {
            startUrl = `file://${distPath}`;
        } else {
            console.error('找不到index.html文件');
            app.quit();
            return;
        }
    }

    mainWindow.loadURL(startUrl);

    // 开发环境下打开开发者工具
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    // 当窗口关闭时取消引用
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // 创建应用菜单
    const template = [
        {
            label: '文件',
            submenu: [
                {
                    label: '退出',
                    accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                    click() {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: '编辑',
            submenu: [
                { role: 'undo', label: '撤销' },
                { role: 'redo', label: '重做' },
                { type: 'separator' },
                { role: 'cut', label: '剪切' },
                { role: 'copy', label: '复制' },
                { role: 'paste', label: '粘贴' }
            ]
        },
        {
            label: '查看',
            submenu: [
                { role: 'reload', label: '重新加载' },
                { role: 'toggledevtools', label: '开发者工具' },
                { type: 'separator' },
                { role: 'resetzoom', label: '重置缩放' },
                { role: 'zoomin', label: '放大' },
                { role: 'zoomout', label: '缩小' },
                { type: 'separator' },
                { role: 'togglefullscreen', label: '全屏' }
            ]
        },
        {
            label: '帮助',
            submenu: [
                {
                    label: '关于',
                    click() {
                        const { dialog } = require('electron');
                        dialog.showMessageBox({
                            title: '关于 Hello World',
                            message: 'Hello World v0.1.0\n© 2024',
                            buttons: ['确定']
                        });
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// 当Electron完成初始化并准备创建浏览器窗口时调用此方法
app.whenReady().then(createWindow);

// 所有窗口关闭时退出应用
app.on('window-all-closed', () => {
    // 在macOS上，除非用户使用Cmd + Q确定地退出
    // 否则应用及其菜单栏常驻
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // 在macOS上，当点击dock图标且没有其他窗口打开时
    // 通常在应用程序中重新创建一个窗口
    if (mainWindow === null) {
        createWindow();
    }
}); 