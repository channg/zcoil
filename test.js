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
z.say("how are you .")