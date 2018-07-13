var expect = chai.expect;




var z6 = new zcoil({
  name:"test01",
  localStorage:true
})
z6.init({
    data() {
      return {
        index: 4
      }
    },
    assignment() {
      this.index = 300
    }
  }
)
z6.assignment()
describe('zcoil serialize', function() {
  it('The value is correct when not serialized.', function() {
    expect(z6.index).to.be.equal(300);
  });
  it('Check the value after serialization(Will succeed on the second).', function(done) {
    localforage.setItem('test01',{index:400}).then(()=>{
      localforage.setItem('_test01_deadline',new Date().getTime()+1000000).then(()=>{
        z6.$deserialize().then((data)=>{
          expect(z6.index).to.be.equal(400);
          expect(data.index).to.be.equal(400);
          done()
        })
      })
    })
  });
  it('Test zcoil in vue with $mixin.', function(done) {
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
              }, 200)
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
            expect(data.$mixin.message).to.be.equal('hello world ,lll,come on ,It works really well');
            expect(this.message).to.be.equal('hello world ,lll,come on ,It works really well');
            done()
          })
        }
      }
    }).$mount("#vm")
    vm.dosome()
  });
  
});


