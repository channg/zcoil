var z = new zcoil()
z.init({
  data() {
    return {
      message: "hello world "
    }
  },
  asyncGetSaySomething(param) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(param)
      }, 1000)
    })
  },
  say(param) {
    this.asyncGetSaySomething(param).then((say) => {
      this.message += "," + say
    })
  },
  endToSay(){
    this.message += ",come on "
  }
})

z.$watch((from,to)=>{
  console.log(from.message)
  console.log(to.message)
})


var hl = z.$coil().say("Thank your star this project")

hl = hl.endToSay()

hl  = hl.say("It works really well")

hl.exec((data)=>{
  debugger
})

