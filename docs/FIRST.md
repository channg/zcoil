# 入门

##引入


```
import zcoil from 'zcoil'
```
or

```
var zocil = require('zocil')
```
or

直接引用dist目录下的 zcoil.js文件

##初始化

使用new 创建一个zcoil实例对象，并调用init 方法 进行初始化

```javascript
var z = new zcoil()
z.init({
	data(){
		return {
			message: "hello world"
		}
	}
})
```
使用`init`方法对实例化的zocil对象进行初始化，`init`方法有且只有一个参数，一个包含着函数键值对的对象。
这个对象必须有一个`data`方法，并`return`了初始化时的参数。

当我们完成了这些，我们就可以开始使用`zcoil`了。
```
	z.message //hello world
```

##尝试

`init`方法参数对象中，可以添加更多方法，并可以直接调用。
```javascript
var z = new zcoil()
z.init({
	data(){
		return {
			message: "hello world "
		}
	},
	name(yourName){
		this.message+=yourName
	}
})

z.name("channg")
console.log(z.message) //hello world channg 
```
看起来是不是很不错，你可以将所有数据操作全部作为方法来调用，语义化的方法名，可以更好的让人理解程序。

##异步数据

在zcoil中使用异步，需要多一个步骤。

```javascript
var z = new zcoil()
z.init({
  data() {
    return {
      message: "hello world "
    }
  },
  asyncGetName() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('channg')
      }, 2000)
    })
  },
  name() {
    this.asyncGetName().then((name) => {
      this.message += name
    })
  }
})

z.name()
```
`asyncGetName` 是一个返回Promise的异步方法。`asyncGetName`返回的Promise对象，在`name`方法中被执行，改变了`message`的值，两者只有调用关系，互相没有交集，从而做到数据隔离，

但是这样会有一个问题。
`z.name()`被调用的时候，`message`的值并没有发生改变，那么我们需要在什么时候获取更新后的message的值呢。

当然，我们需要下回分解。

