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
      }, 100)
    })
  },
  asyncGetSaySomething(param) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(param)
      }, 200)
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

Vue.use(z)
var vm = new Vue({
  el:"#vm",
  data(){
    return{
      z:this.$zcoil,
      message:""
    }
  },
  watch:{
    message(some){
      debugger
    }
  },
  created(){
    this.z.$use(this)
    this.z.$coil().say("enjoy this ,").name().exec()
  }
})