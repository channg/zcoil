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
          }, 1000)
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
      this.coil = this.z.$coil().say("lll")
      this.coil = this.coil.endToSay()
      this.coil = this.coil.say("It works really well")
      this.coil = this.coil.exec((data)=>{
        console.log(this.message)
      })
    }
  }
}).$mount("#vm")
vm.dosome()



