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





describe('zcoil serialize', function() {
  it('The value is correct when not serialized.', function() {
    expect(z6.index).to.be.equal(4);
  });
  it('Check the value after serialization(Will succeed on the second).', function(done) {
    z6.$deserialize().then((data)=>{
      expect(z6.index).to.be.equal(300);
      expect(data.index).to.be.equal(300);
      z6.assignment()
      done()
    })
  });
  
});

