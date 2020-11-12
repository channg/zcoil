# 理解
在学习zcoil之前，现在看一看为什么要使用`zcoil`。

来看这段普通的代码
```javascript
function findFood(){
	//asyncToFindFood
	...
}

function eat(food){ 
	...
}
```

有一个function `findFood`，还有一个function `eat`。在程序执行的某个时间点，我会调用`findeFood`，这时候我派出了一个机器人`async`异步去寻找食物，毕竟寻找食物是要耗时的。

如果想要让`findFood`找到食物之后，吃掉这个食物。那`eat`方法就必须要在`asyncToFindFood`之后被调用。有如下代码
```javascript
function findFood(){
	asyncToFindFood(function(food){
		eat(food)
	})
}
```
很显然，这种嵌套代码不完美，有什么问题呢。
* 美观性差
* 后期维护复杂
* 对异常处理很困难

所以说我们现在，需要一个更优秀的写法，来规避这些问题。
很开心的是，我们拥有了`async/await`

代码就就如下：
```javascript
async function findFoodAndEat(){
	var food = await asyncToFindFood()
	eat(food)
}
```
使用了`async/awiait`之后，程序美观了许多，如果发生异常，也可以直接使用`try catch`去捕获。

继续阅读这段代码，会发现一个问题，通过`asyncToFindFood`找到了多少食物，就必须要`eat`多少。

这时候的需求来了，在`findFood`的时候，我们找到的不只是只够一次吃的食物，找到的食物是无穷的，也就是说只要`findFood`成功一次，以后就不需要再进行`findFood`了，那么我们就需要在寻找的到食物的时候要存储起来，下次也可以去`eat`
这个时候，我们就需要调整代码内部的逻辑。

所以代码如下：
```javascript
var food
async function findFood(){
	if(!food)
		food = await asyncToFindFood()
	eat(food)
}
```
上面的代码，表示，找到了食物要存储起来，如果下次再调用方法，我就去查看一下是不是有食物，如果有食物，我就不再`findFood`了，直接`eat`

这时候，新的需求又来了，我现在有了一个闹铃，闹铃响了的时候代表我饿了，必须要`eat`，程序这时候增加了一个闹铃方法`alarmGoOff`，当闹铃响起的时候`alarmGoOff`会被调用，之后我们就需要调用`eat()`，但是呢我们要保证，在闹钟响了的时候`eat`是能吃到食物的。

```javascript
function alarmGoOff(){
	eat(food)
}
```

那么我们要怎么保证在`alarmGoOff()`闹铃响了的时候一定能吃到食物呢？

想了一下，决定在页面加载的时候调用`findFood`。只要程序一开始运行我就先去找食物，这样之后我都会有食物，是不是可行呢？

```javascript
function init(){
	findFood()
}
init()
```

但总有事情不凑巧，虽然在程序一开始执行就调用了`findFood`，但因为`findFood`是异步的，闹铃正好在你`findFood`期间响起来了，由于`javascript`单线程的原因，又因为`EventLoop`模型。

这时候你无法等待`findFood`结束了，直接触发了`alarmGoOff`里面的方法`eat`。
但是很明显这个时候`food`是`null`
你吃掉了一口`null`
就这样，嘎嘣一声程序就挂了。

在实际的场景中，我们经常性的会遇到这种问题，比如说一个点击事件依赖一个异步数据，这个异步数据在程序初始化的时候被执行，但有时候因为网速的原因啊，用户进行点击事件的时候异步数据还并没有返回，这时候就造成了异常。

通常我们用最简单的解决办法。**在闹铃响起来的时候，也先去寻找食物**，然后当程序触发`findFood`的时候，也去寻找食物，两者谁先进行，谁就先保存食物。

```javascript
var food
async function alarmGoOff(){
	if(!food)
		food = await asyncToFindFood()
	eat(food)
}

async function findFood(){
	if(!food)
		food = await asyncToFindFood()
	eat(food)
}
```
😭但是，总感觉，这两个代码好像一毛一样。一个是普通的程序执行过程中的`findFood`，另外一个是`alarmGoOff`因为闹铃响了要去吃东西。两者的代码有很大的冗余。但是这样，确实是能够保证程序没有异常

但就算如此，现在代码没有问题吗？
虽然在两个函数中都判断了`food`是否存在，但如果两者被调用的时候，两个函数都没有被返回，那么就会触发两次`asyncToFindFood()`，因为`async/awaut`本质还是异步的。虽然这样不会对程序造成异常。但貌似还是不完美。那么我们应该怎么样解决呢？

当某一个函数，在调用`asyncToFindFood`的时候，设置一个变量表示正在请求，你就不用请求了等着就行了。

看下面的代码

```javascript
var food
var wait
async function alarmGoOff(){
	if(!food&&!wait){
		wait = new Promise(()=>{
			food = await asyncToFindFood()
			resolve()
		})
	}else if(wait&&!food){
		awiat wait
	}

	eat(food)
}
```

这段代码表示
* 如果没有`food`也没有`wait`，那么我们就生成一个`Promise`表示：后面的你等着吧，前面的机器人正在找食物呢，如果你也要找食物，就等我找完了再说。
* 如果没有`food`但是有`wait`，很明显就是前面的机器人已经去找食物了，但是还没有回来，我们等着找完了回来直接`eat`就行了，不用再去找一遍。
* 最后一种就是已经有`food`了 直接开吃

终于完美了，但是看这段代码像什么？
一个标志表示事件是否结束，如果没有结束，就等待，如果结束了，就立刻执行。
是不是，像是一个消息队列。哈哈哈，其实是因为`zcoil`就是实现了一个这样的消息队列。

使用`zcoil`超级简单的处理这种问题。

使用`zcoil`生成一个消息队列

```javascript
	z.$coil()
```

在初始化的时候在方法消息队列里插入一个`findFood`方法

```javascript
	z.$coil().findFood()
```

不用担心，这个时候，`findFood`不会被执行，队列只有在调用`exec`方法的时候被执行。

ok，这时候闹钟响了怎么办，很简单。只需要将队列保存下来，在闹钟响了的时候，在队列里插入`eat()`，并调用`exec()`执行队列就可以了。当然，返回值还是一个队列，可以继续被调用。

```javascript
var some = z.$coil().findFood()

function alarmGoOff(){
	var some =  some.eat().exec()
}

```

使用`zcoil`生成队列添加的函数，永远都在前一个方法结束的时候被执行，后面的方法总会等待前面的方法结束，而且使用起来非常方便，可以说是前端异步请求的终极解决方案。是不是很酷？




