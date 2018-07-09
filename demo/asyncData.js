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
        resolve('channg')
      }, 2000)
    })
  },
  name() {
    this.asyncGetName().then((name) => {
      this.message += name
    })
  }
})

z.name()
z.$watch((from,to)=>{
  debugger
})