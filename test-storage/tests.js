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
  
});

