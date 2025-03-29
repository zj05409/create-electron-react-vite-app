#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import prompts from 'prompts';
import chalk from 'chalk';

// 处理ESM的__dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 获取模板目录
const templateDir = path.resolve(__dirname, '../template');

async function init() {
    console.log(chalk.bold.blue('🚀 欢迎使用 Electron + React + Vite 应用创建器 🚀'));
    console.log();

    let projectName;

    // 获取命令行参数，跳过前两个参数(node路径和脚本路径)
    const args = process.argv.slice(2);

    if (args.length > 0) {
        // 使用第一个命令行参数作为项目名称
        projectName = args[0];
        console.log(chalk.blue(`使用命令行参数作为项目名称: ${projectName}`));
    } else {
        // 如果没有命令行参数，使用交互式提示
        try {
            const result = await prompts({
                type: 'text',
                name: 'projectName',
                message: '请输入项目名称:',
                initial: 'my-electron-app'
            });

            projectName = result.projectName;

            if (!projectName) {
                console.log(chalk.red('❌ 项目名称不能为空，已取消创建。'));
                process.exit(1);
            }
        } catch (error) {
            console.log(chalk.red('❌ 已取消创建。'));
            process.exit(1);
        }
    }

    const targetDir = path.join(process.cwd(), projectName);

    // 检查目标目录是否已存在
    if (fs.existsSync(targetDir)) {
        console.log(chalk.red(`❌ 目录 ${projectName} 已存在，请选择一个不同的项目名称。`));
        process.exit(1);
    }

    // 创建项目目录
    fs.mkdirSync(targetDir, { recursive: true });

    // 复制模板文件到目标目录
    console.log(chalk.blue('📁 创建项目文件...'));
    copyDir(templateDir, targetDir);

    // 生成项目标题和描述
    const projectTitle = projectName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    // 替换文件中的项目名称和标题
    console.log(chalk.blue('🔄 自定义项目配置...'));

    // 替换package.json中的项目名称
    const packageJsonPath = path.join(targetDir, 'package.json');
    let packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.name = projectName;
    packageJson.build.productName = projectTitle;
    packageJson.build.appId = `com.${projectName.toLowerCase().replace(/-/g, '')}.app`;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // 替换index.html中的标题
    const indexHtmlPath = path.join(targetDir, 'index.html');
    let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
    indexHtml = indexHtml
        .replace(/<title>Hello World<\/title>/g, `<title>${projectTitle}</title>`)
        .replace(/<meta name="description" content="Hello World 应用" \/>/g,
            `<meta name="description" content="${projectTitle} 应用" />`);
    fs.writeFileSync(indexHtmlPath, indexHtml);

    // 替换App.jsx中的显示名称
    const appJsxPath = path.join(targetDir, 'src/App.jsx');
    let appJsx = fs.readFileSync(appJsxPath, 'utf8');
    appJsx = appJsx.replace(/<h1>Hello World<\/h1>/g, `<h1>${projectTitle}</h1>`);
    fs.writeFileSync(appJsxPath, appJsx);

    // 替换main.cjs中的应用名称
    const mainJsPath = path.join(targetDir, 'electron/main.cjs');
    let mainJs = fs.readFileSync(mainJsPath, 'utf8');
    mainJs = mainJs.replace(/title: '关于 Hello World'/g, `title: '关于 ${projectTitle}'`);
    fs.writeFileSync(mainJsPath, mainJs);

    // 替换README.md中的项目名称
    const readmePath = path.join(targetDir, 'README.md');
    let readme = fs.readFileSync(readmePath, 'utf8');
    readme = readme.replace(/# Electron React Vite 应用/g, `# ${projectTitle}`);
    fs.writeFileSync(readmePath, readme);

    console.log(chalk.blue('📦 安装依赖...'));
    try {
        // 安装依赖
        execSync('npm install', { cwd: targetDir, stdio: 'inherit' });

        console.log();
        console.log(chalk.green('✅ 项目创建成功！'));
        console.log();
        console.log(chalk.bold('📝 接下来你可以:'));
        console.log();
        console.log(`  ${chalk.cyan('cd')} ${projectName}`);
        console.log(`  ${chalk.cyan('npm run dev')} - 在浏览器中开发`);
        console.log(`  ${chalk.cyan('npm run electron:dev')} - 在Electron中开发`);
        console.log(`  ${chalk.cyan('npm run electron:build')} - 构建Electron应用`);
        console.log();
        console.log(chalk.bold('📚 更多信息请查看README.md文件'));
    } catch (error) {
        console.log(chalk.red('❌ 依赖安装失败，请手动安装:'));
        console.log(`  ${chalk.cyan('cd')} ${projectName}`);
        console.log(`  ${chalk.cyan('npm install')}`);
    }
}

// 复制目录函数
function copyDir(srcDir, destDir) {
    fs.readdirSync(srcDir).forEach(file => {
        const srcPath = path.join(srcDir, file);
        const destPath = path.join(destDir, file);

        const stat = fs.statSync(srcPath);
        if (stat.isDirectory()) {
            fs.mkdirSync(destPath, { recursive: true });
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

init().catch(err => {
    console.error(chalk.red('❌ 发生错误:'), err);
    process.exit(1);
}); 