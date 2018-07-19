# 与其他框架混用

当我们并不需要将数据存储在`zcoil`中时。我们可以不去传入`data方法`。我们需要在`new zcoil`传入我们存储数据的变量。

```javascript
new zcoil({
          mixin:xxx
        })
```

这样我们就能在程序中 使用`this.$mixin`去获取传入的数据用于赋值操作了。

## 与vue混用

`zcoil`实例本身就是一个vue插件
```javascript
	var z = new zcoil()
	z.init(...)
```
当实例话了一个`zcoil`对象之后，直接可以使用
```
	Vue.use(z)
```

这时候，在你的vue组件中的就可以使用`this.$zcoil`获取你使用`Vue.use(z)`的`z`变量。

这时候，你可以在`created`中使用
```
created(){
	this.$zcoil.$invoke(this)
	}
```
这个方法是将`z`内部属性名与`this`相同的变量同步到`this`中。
```javascript
	z.init({
		data:{
		message:10
		}
	})

	new Vue({
		data(){
			reuturn {
				message:0
			}
		},
		created(){
			this.$zcoil.$invoke(this)
			//这时候 this.message的值将会变为10
		}
	})
```

接下来你就可以在`vue`中使用`zcoil`了
