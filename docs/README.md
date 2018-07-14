# 楔子

任何事物的诞生都有理由，一个框架也是。

`zcoil`的诞生，便是为了解决更复杂的数据操作场景的一个`model`层框架。当程序中数据获取、更新的方式随着产品迭代逐步提升时，对阅读代码，以及增加需求的时间成本会高度增加。

`zcoil`的初衷便是为了解决如何在复杂数据交互场景下进行`更快捷、优雅`生产出更优美、直观的code，并含有许多很酷的api。

## 为什么使用
使用`zocil` 可以生成多个，方法的消息队列，当你的数据发生异步请求时，你不需要再等待数据返回再执行下一个方法。直接可以按照顺序的将他们塞入消息队列中，方法的消息队列将顺序的消费他们。
举个例子，一个点击事件会发出一个请求，但依赖于初始化的时候去请求`userinfo`，这时候你只需要在初始化的时候创建消息队列，init的时候塞入请求`userinfo`的方法，接下来的点击事件，你不需要关心`userinfo`是否完成，只需要继续向消息队列塞入方法。

使用`zocil`可以使用高性能的`$watch`，`zocil`的`$watch`模型，基于`AOP`，完全基于用户行为，不会消耗任何性能。

使用`zocil`可以超级快速的将数据存入本地浏览器内，内置了`localforage`兼容包括ie8及以上的现代浏览器，可以在第二次进入页面的时候快速取出数据。

`zocil`也是一个很好入手去实践的框架，学习`zcoil`你可以理解框架的原理。在创作的时候，我遇到了很多包括：`this`指向；`浅复制`；`深复制`的问题。
在框架搭建过程中，也解决了很多问题：`lodash`按需加载；`travis ci `配合`chrome headless`与`mocha`自动化测试；`webpack`导出实例。
学习一个框架确实收获很多。

## 前言
使用zcoil的时候，你可能需要知晓的知识点

### Promise

使用**new Promise()**创建一个`Promise`对象<a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise">Promise</a>
```
new Promise( function(resolve, reject) {...} /* executor */  );
```

### EventLoop

JavaScript 的<a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/EventLoop">并发模型</a>基于"事件循环"。这个模型与像 C 或者 Java 这种其它语言中的模型截然不同。

## 接下来
那么，我们可以开始新的旅程了。
```
npm install zcoil
```
## [ -> 入门 <-](FIRST.md)
