# 打造一个 redux 数据流方案 --- 名为 demacia

目的：打造一个简单的 redux 数据流方案，实现功能类似与 dva，但仅仅只是对 redux 进行封装，简化 redux 使用流程和难度。最终目的肯定是为了提升开发效率和加深自己对 redux 源码的理解能力和运用能力

## 名称介绍

仓库名称叫 demacia，有没有熟悉的既视感，对，就是德玛西亚，命名缘由：英雄联盟只玩过德玛西亚，玩过几次，王者荣耀最开始只玩亚瑟（2016 年刚毕业连续玩了两百把 😂）。

## 先讲使用

编写 redux 部分的方式其实 dva 类似，主要是引入方式和使用方式有所区别

### 快速上手

进入自己的 react 项目，通过 npm 安装 demacia

```bash
npm install demacia -S
```

### 项目中使用

在 src 下创建一个 store 文件用于创建仓库

```js
// src/store/index.js
import { demacia } from '../demacia'
// 这里引入了一个名为global的model
import global from './global'

// 需要初始化创建的model
const initialModels = {
	global,
}

// 设置state初始值，用于全局初始化数据，比如当需要持久化存储时，会很方便
const initialState = {
	global: {
		counter: 2,
	},
}

// 调用demacia并传入初始参数，返回了redux的store
const store = demacia({
	initialModels,
	initialState,
})

export default store
```

上面的代码中，我们引入了 demacia 函数，并调用它，然后返回了 store，这个 store 就是 redux 的 store
