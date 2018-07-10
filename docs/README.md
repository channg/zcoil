# 楔子

任何事物的诞生都有理由，一个框架也是。`zcoil`的诞生，便是为了解决更复杂的数据操作场景的一个`model`层框架。当程序中数据获取、更新的方式随着产品迭代逐步提升时，对阅读代码，以及增加需求的时间成本会高度增加，`zcoil`的初衷便是为了解决如何在复杂数据交互场景下进行`更快捷、优雅`生产出更优美、直观的code，并含有许多很酷的api。

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
