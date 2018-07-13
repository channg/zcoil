var vm = new Vue({
  data() {
    return {
      z: {},
      coil: {},
      message: [],
      all:0
    }
  },
  created() {
    this.z = new zcoil({
      mixin:this
    })
    this.z.init({
      asyncGetSaySomething(time) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(time)
          }, time)
        })
      },
      say(time) {
        this.asyncGetSaySomething(time).then(() => {
          this.$mixin.message.shift()
          this.$mixin.all+=time
        })
      }
    })
    this.coil = this.z.$coil()
  },
  methods: {
    dosome(time) {
      var some = this.randomRgb()
      some.width = time/10+'px'
      this.message.push({color:some})
      this.coil = this.coil.say(time).exec(()=>{
        console.log(this.message)
      })
    },
    randomRgb: function () {
      var R = Math.floor(Math.random() * 255);
      var G = Math.floor(Math.random() * 255);
      var B = Math.floor(Math.random() * 255);
      return { background: 'rgb(' + R + ',' + G + ',' + B + ')' };
    },
    run(){
      setInterval(()=>{
        if(this.message[0]){
          
          var width = parseInt(this.message[0].color.width.split("px")[0])
          width = width -3
          this.message[0].color.width = width+'px'
        }
      },30)
    }
  }
}).$mount("#vm")
vm.dosome(1000)
vm.dosome(2000)
vm.dosome(3000)
vm.dosome(5000)

vm.run()
