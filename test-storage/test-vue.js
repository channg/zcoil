var expect = chai.expect;

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
describe('zcoil with vue', function() {
  it('vue use $coil', function(done) {
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
          if(some==='hello world ,enjoy this ,'){
            expect(z.message).to.be.equal(this.message);
            
          }
          if(some==='hello world ,enjoy this ,my friend'){
            expect(z.message).to.be.equal(this.message);
            done()
          }
        }
      },
      store:z,
      created(){
        this.z.$use(this)
        this.z.$coil().say("enjoy this ,").name().exec()
      }
    })
  });
})




