# 更多

`zcoil`内集成了浏览器数据存储，可以快捷的将`data`存入浏览器中。

```javascript
new zcoil({
	name:"channg",
	localStorage:true
})
```

初始化`zcoil`时，传入的对象含有`name`和`localStorage:true`属性。当`data`内的数据被更新时，会被同步到浏览器的存储中。

>zcoil 中浏览器存储使用的 localForage ，由于 localForage 机制原因， 存储为异步函数，所以不能保证数据被更新时，立刻能被存储到浏览器中。

### 获取

存储在浏览器的数据  可以使用 `new zcoil().$deserialize()`方法同步到`data`中。

如果你并不想使用`zcoil`自动同步数据，加入`cover:false`,`$deserialize()`被调用的时候不会自动同步数据，需要手动注入方法同步
```javascript
var z = new zcoil({
	name:"channg",
	localStorage:true,
	cover:false
})
z.init({
	data(){
	  ...
	},
	some(){
	  this.$deserialize((data)=>{
	    this.some = data.some
	    ....
	  })
	}
})
```

### 进阶

使用`$coil`链式同步

```javascript
var coil = z.$coil().$deserialize()

coil.dosomething()
```

使用`$coil`调用`$deserialize`之后，剩下的所有方法都会在同步数据之后被执行，非常简单易用。


### 超时时间

```javascript
var z = new zcoil({
	name:"channg",
	localStorage:true,
	cover:false
	deadline:60 * 60 *24
})
```

`deadline` 是有效时间，单位为秒，超时后同步数据将失效。默认` deadline: 30 * 24 * 3600`



