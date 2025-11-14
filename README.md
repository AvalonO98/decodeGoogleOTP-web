# Google Authenticator 迁移工具

一个用于解析和导出Google Authenticator迁移QR码的Web应用，可以轻松将OTP配置从Google Authenticator导出并迁移到其他OTP应用。

## 功能特点

- 📸 支持上传Google Authenticator迁移QR码图片进行解析
- 📱 支持使用摄像头直接扫描QR码
- 🔒 完全在浏览器本地运行，数据不会上传到任何服务器
- 📋 支持复制OTP密钥到剪贴板
- 📲 支持生成单个OTP配置的QR码，方便导入到其他应用
- 💾 支持将所有解析结果导出为JSON文件
- 🎨 现代化、响应式的用户界面，支持移动端和桌面端

## 技术栈

- React 18
- TypeScript
- Vite (构建工具)
- jsQR (QR码解析)
- protobufjs (Protobuf数据解析)
- Cloudflare Pages (部署平台)

## 本地开发

### 安装依赖

`ash
npm install
`

### 启动开发服务器

`ash
npm run dev
`

应用将在 http://localhost:3000 启动

### 构建生产版本

`ash
npm run build
`

构建结果将输出到 dist 目录

## Cloudflare Pages 部署

### 前置准备

1. 将项目推送到GitHub/GitLab仓库
2. 注册Cloudflare账号（如果还没有）

### 部署步骤

1. 登录Cloudflare控制台
2. 导航到 Pages 部分
3. 点击 创建项目 -> 连接到Git
4. 选择您的项目仓库
5. 配置构建设置：
   - 构建命令: 
pm run build
   - 构建输出目录: dist
   - Node版本: 选择最新的长期支持版本 (LTS)
6. 点击 保存并部署

### 环境变量配置

您可以在Cloudflare Pages项目设置中配置环境变量。参考 .env.example 文件中的配置项。

### 自定义域名

部署成功后，您可以在Cloudflare Pages项目设置中配置自定义域名。

## 使用方法

1. 在Google Authenticator应用中，进入设置，选择"导出账户"
2. 选择要导出的账户，生成迁移QR码
3. 在本工具中，选择"上传QR码图片"或"使用摄像头扫描"
4. 解析完成后，您可以查看所有OTP配置的详细信息
5. 可以复制单个密钥、生成单个配置的QR码，或导出所有配置为JSON

## 安全注意事项

- 本工具完全在浏览器本地运行，所有数据处理都发生在您的设备上
- 请妥善保管您的OTP密钥信息，不要分享给他人
- 建议在完成迁移后删除临时文件和截图

## 许可证

MIT License
