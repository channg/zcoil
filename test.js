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
      }).catch(()=>{
        //donothing
      })
    }
  }
);

z8.$coil({rollback:true,saveWithExec:false}).aa().exec(function(data){

}).bb().exec(function (data,error) {
  console.log(z8.index)
  console.log(data.index)
  debugger
})


/*
Vue.use(z)
var vm = new Vue({
  el:"#vm",
  data(){
    return{
      z:this.$zcoil,
      message:"lululu"
    }
  },
  watch:{
    message(some){
    }
  },
  created(){
    this.z.$use(this,['message'])
    this.z.$coil().say("enjoy this ,").name().exec((some,error)=>{
      debugger
    })
  }
})*/
