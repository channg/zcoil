# 探索

对于`javascript`而言，异步方法的调用，算得上是一个比较令人头痛的问题了。单线程的特性，也从始至终贯彻在我们的code之中。从嵌套的`callback`函数，接着是更优雅的`promise`，再接着变为更趋近于同步写法的`async\await`，或是更优秀的响应式编程库`rxjs`，`javascript`开发者都在进步着。

`zcoil`也会带来一种全新的异步开发体验。

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
        resolve('my friend')
      }, 2000)
    })
  },
  asyncGetSaySomething(param) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(param)
      }, 1000)
    })
  },
  name() {
    this.asyncGetName().then((name) => {
      this.message += name
    })
  },
  say(param) {
    this.asyncGetSaySomething(param).then((say) => {
      this.message += "," + say
    })
  }
})

z.name()
z.say("how are you ?")
```

这段代码是中最后调用了两个异步方法，我们希望最后的`z.message`的结果是`hello world my friend,how are you ?`。但很明显，因为执行时间的不同，这段代码最后`z.message`的结果是`hello world ,how are you ?my friend`。

如何让执行顺序符合我们的预期呢。

## $coil

>$coil 创造方法可以被链式调用的生成器。

现在可以对上面的代码进行包装。

```javascript
	z.$coil().name().say("how are you ?").exec((data)=>{
		data.message //hello world my friend,how are you ?
		z.message    //hello world my friend,how are you ?
	})
```

这时候，当链式调用结束的时候调用`exec`，并可以从回调函数中获得执行结束的数据。这时候`z.message`的结果就是`hello world my friend,how are you ?`。

### exec
`exec`函数表示执行当前顺序执行之前所有的函数。

```javascript
z.$coil().some()exec((data,error)=>{
})
```
他会在执行钩子的时候传入两个参数，`data`与`z.data`内的数据相同，`error`表示在之前的函数调用中出现过`reject`,如果没有出现`reject`，`error`将返回`null`。
`error`只是作为一个标识，标识之前的程序存在错误，但并不返回详细信息，如果要处理错误，请在自己的代码中加入`catch`处理。


>tips
>
>不管同步方法，还是异步方法，都可以被链式调用执行，但如果方法含有`return`将会被忽略掉。

### 出鞘

使用`$coil`确实可以解决一些异步的问题，但是显然是这段代码被运行在同一时间点。如果需要在不同时间执行这些代码，例如`点击事件`之后异步调用，但有部分需要提前获取。

所以在`$coil()`之后被链式调用的所以方法，全部会返回一个`$coil`对象，这个对象可以再任何时候被调用。使用`$coil`可以完成全新的异步方法体验。

```javascript
var messageGet = z.$coil().name().say("^_^").exec((data)=>{
  console.log(data.message)   //hello world my friend,^_^
})
messageGet.say("lululu").exec((data)=>{
  console.log(data.message)  //hello world my friend,^_^,lululu
})
```

>tips
>
>`$coil`链式调用执行的方法，只会在`exec`执行的时候被执行。链式调用只是将方法加入到`执行队列中`当执行队列被塞入了`exec`，这个队列将会被顺序调用。

### 参数

`$coil`方法含有几个参数需要注意一下。

```javascript
export interface coilConif{
    rollback?:Boolean;
    errorContinue?:Boolean;
    saveWithExec?:Boolean;
}
```
`rollback`
* 执行链调用中出现异常（`promise.reject`）时是否闪回。默认 `false`

`errorContinue`
* 执行链调用中出现异常（`promise.reject`）时是否继续执行。默认`true`

`saveWithExec`
* 执行`exec`时，是否替换闪回数据，此参数需要配合`rollback`使用，默认`true`













