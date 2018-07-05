var z6 = new zcoil({
  name: "test0123",
  localStorage: true,
  cover: false
});
z6.init({
    data() {
      return {
        index: 4
      }
    },
    luck(){
      return new Promise((resolve)=>{
        setTimeout(()=>{
          resolve(8)
        },800)
      })
    },
    some(){
      this.luck().then((da)=>{
        this.index+=da
      })
    },
    jj(){
      this.luck().then((da)=>{
        this.index*=da
      })
    }
  }
);
z6.$watch(function (from, to) {
  debugger
})
z6.$coil().some().exec(function () {
  debugger
}).jj().exec(function () {
  debugger
})
