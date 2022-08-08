# DeepinComponents

Deepin Web组件库

## 目录结构

1. src/app

    用于开发测试组件效果

1. project/dcomponents

    组件源码，目前有首尾导航组件。

1. project/web-components

    用于编译构建标准html5 web components

1. mingdao.ts

    用于从明道云拉取导航数据，并生成组件配置

## 脚本命令

1. pnpm install

    安装依赖库

2. pnpm start

    启动组件开发预览

3. pnpm analyzer

    分析依赖体积

4. pnpm gen

    拉取导航数据，并生成配置

5. pnpm wc

    编译html web component组件，打包成main.js和main.css
