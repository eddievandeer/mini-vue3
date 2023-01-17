# mini-vue3

## 简介

本项目是在看霍春阳大佬的书：[《Vuejs 设计与实现》](https://book.douban.com/subject/35768338/) 时，跟着书上的思路一步一步搭建起来的，通过亲手敲代码的方式加深对 Vue3 核心逻辑的理解

为了学习测试驱动开发(TDD，Test-Driven Development)的思想，本项目采用先写单元测试的测试用例，再去编写实现功能的代码的方式，同时测试用例也都有详细的测试描述，这样做的好处是：

- 做到只看测试描述就能够知道这个函数的作用
- 事先想好函数想要达到的效果，实现时条理清晰

对于和我一样刚开始接触 Vue3 源码的同学来说，里面的各个单元测试、代码注释，应该能够你的源码学习梳理思路。如果觉得这个项目对你的源码学习有帮助的话，还请多多点点 star，满足一下我的虚荣心哈哈哈

## 启动项目

项目初次尝试 **monorepo**，并进行了相应的配置，可供刚接触 monorepo 的同学做一些参考

使用 `pnpm` 来代替 `npm` 或 `yarn`，其本身自带 monorepo 的功能，只需要进行简单的配置即可，具体的使用和配置可参考 [官方文档](https://pnpm.io/)

启动前需要先使用 `npm install -g pnpm` 命令进行全局安装

目前暂时未提供可运行的 Demo，后续将会更新相应的 `example` 目录，来为项目提供可用于本地调试及功能体验的界面

## 测试

运行如下脚本即可：

```shell
npm run test

# or
yarn test
```

## 提交代码

提交代码时希望能够有一套对应的规范，避免提交信息太过杂乱。本项目采用 emoji 来代表本次提交的类型，每个 emoji 都有自己的含义，具体信息可以到 [gitmoji](https://gitmoji.dev/) 站点查看

在将代码添加至 git 暂存区后，运行如下命令即可交互式的完成提交信息的填写：

```shell
npm run cz

# or
yarn cz
```
