var z8 = new zcoil({});
z8.init({
    data() {
      return {
        index: 4
      }
    },
    reject(){
      return Promise.reject()
    },
    resolve(){
      return Promise.resolve(2)
    },
    aa(){
      this.resolve().then((data)=>{
        this.index+=data
      })
    },
    bb(){
      this.reject().then((data)=>{
        this.index+=data
      })
    }
  }
);

z8.$coil().aa().exec(function(data){
  debugger
}).bb().exec(function (data,error) {
  debugger
})