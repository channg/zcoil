# 追究

如果一个数据在方法运行外部被改变，`zcoil`应该如何得知呢？

`zcoil`没有使用`definePrototype`，所有当数据在方法外部被改变的时候，`zcoil`也就无法知晓，从而产生`$watch`无法得知数据变动的后果。

```
var z = new zcoil()
z.init({
    data(){
        return {
            message: "hello world "
        }
    }
})
z.messsage="abc" //不会触发$watch
```

如果我们必须要在程序外部使用数据并进行赋值操作，我们必须要主动通知。

使用`z.$commit()`主动通知程序。

```
var z = new zcoil()
z.init({
    data(){
        return {
            message: "hello world "
        }
    }
})
z.messsage="abc" //不会触发$watch
z.$commit()
```
调用了`$commit()`之后，`$watch`便可以得知数据的状态是否被更新了。