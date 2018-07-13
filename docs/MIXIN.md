# 与其他框架混用

当我们并不需要将数据存储在`zcoil`中时。我们可以不去传入`data方法`。我们需要在`new zcoil`传入我们存储数据的变量。

```javascript
new zcoil({
          mixin:xxx
        })
```

这样我们就能在程序中 使用`this.$mixin`去获取传入的数据用于赋值操作了。

## 与vue混用

```javascript
var vm = new Vue({
  data() {
    return {
      z: {},
      coil: {},
      message: "hello world ",
    }
  },
  created() {
    this.z = new zcoil({
      mixin:this
    })
    this.z.init({
      asyncGetSaySomething(param) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(param)
          }, 200)
        })
      },
      
      say(param) {
        this.asyncGetSaySomething(param).then((say) => {
          this.$mixin.message += "," + say
        })
      },
      endToSay() {
        this.$mixin.message += ",come on "
      }
    })
  },
  methods: {
    dosome() {
      this.coil = this.z.$coil().say("do some")
      this.coil = this.coil.endToSay()
      this.coil = this.coil.say("It works really well")
      this.coil = this.coil.exec((data)=>{
        console.log(this.message)
      })
    }
  }
}).$mount("#vm")

vm.dosome()
```

很遗憾的是，`zcoil`的`$coil`并不能直接使用`vue`内的`methods`，因为`vue`在调用的时候改变了`this`的指向。所以还是需要在`init`的时候传入需要执行的方法。