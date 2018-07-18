var zcoil = require('../dist/zcoil')
const assert = require('assert');
var z = new zcoil()
var z0 = new zcoil()
z0.init({
  data:{
    a:1
  }
})
z.init({
  data() {
    return {
      index: 0
    }
  },
  fetch2() {
    return Promise.resolve(2)
  },
  timeout() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(20)
      }, 500)
    })
  },
  addIndex() {
    this.fetch2().then((data) => {
      this.index += data
    })
  },
  multiply() {
    this.timeout().then((data) => {
      this.index *= data
    })
  },
  assignment() {
    this.index = 200
  }
})

var z2 = new zcoil()
z2.init({
    data() {
      return {
        index: 0
      }
    },
    assignment() {
      this.index = 200
    }
  }
)

var z3 = new zcoil()
z3.init({
    data() {
      return {
        index: 2,
        type:'last'
      }
    },
    assignment() {
      this.index = 200
    }
  }
)

var z4 = new zcoil()
z4.init({
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

var zassign  = zcoil.$assign(z3,z4)

var z5 = new zcoil()
z5.init({
    data() {
      return {
        index: 4
      }
    },
    settimeout() {
      var that = this
      setTimeout(function(){
        z5.index = 100
        that.$commit()
      },200)
    }
  }
)
z5.$watch(function(from,to){
})
z5.settimeout()

var z6 = new zcoil()
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

var z7 = new zcoil({});
z7.init({
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

var z9 = new zcoil({});
z9.init({
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

var z10 = new zcoil()
z10.init({
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
        reject(param)
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
    }).catch(()=>{})
  }
})


describe('||||  ZCOIL MOCHA TEST  ||||', () => {
  it('use data as a Object', () => {
    assert.strictEqual(z0.a , 1);
  });
  it('use zcoil', () => {
    assert.strictEqual(zcoil !== null, true);
  });
  it('new zcoil();', () => {
    assert.strictEqual(z !== null, true);
  });
  it('init z.index', () => {
    assert.strictEqual(z.index, 0);
  });

  it('z.fetch()', (done) => {
    z.fetch2().then((data) => {
      assert.strictEqual(data, 2);
      done()
    })
  });
  it('z.$watch()', (done) => {
    z2.$watch((from, to) => {
      assert.strictEqual(z2.index, to.index);
      done()
    })
    z2.assignment()
  });


  it('z.$coil().addIndex().multiply().assignment().multiply()', (done) => {
    z.$coil().addIndex().multiply().assignment().multiply().exec(function(data){
      assert.strictEqual(z.index, 4000);
      assert.strictEqual(data.index, 4000);
      assert.strictEqual(this.index, 4000);
      done()
    })
  });

  it('zcoil.$assign()', () => {
      assert.strictEqual(zassign.index, 4);
      assert.strictEqual(zassign.type, 'last');
  });

  it('zcoil.$assign().method()', () => {
    zassign.assignment()
    assert.strictEqual(zassign.index, 300);
  });

  it('z.$watch() by $commit', (done) => {
    z6.$watch((from, to) => {
      assert.strictEqual(z6.index, 200);
      assert.strictEqual(from.index, 4);
      assert.strictEqual(to.index, 200);
      done()
    })
    z6.index = 200
    z6.$commit()
  });
  var some = null
  it('zcoil.$coil two exec', (done) => {
     some = z7.$coil().some().exec(function () {

    }).jj().exec(function (data) {
      assert.strictEqual(data.index, 96);
      assert.strictEqual(z7.index, 96);
      done()
    })
  });
  it('zcoil.$coil next exec', (done) => {
    some.some().exec(function(data){
      assert.strictEqual(z7.index, 104);
      assert.strictEqual(data.index, 104);
      done()
    })
  });


  it('zcoil more one exec() use saveWithExec = false and rollback = true.', (done) => {
    z8.$coil({rollback:true,saveWithExec:false}).aa().exec(function(data){
    
    }).bb().exec(function (data,error) {
      assert.strictEqual(z8.index, 4);
      assert.strictEqual(data.index, 4);
      done()
    })
  });
  it('zcoil more one exec() use rollback = true  but saveWithExec = true.', (done) => {
    z9.$coil({rollback:true,saveWithExec:true}).aa().exec(function(data){
      debugger
    }).bb().exec(function (data,error) {
      assert.strictEqual(z9.index, 6);
      assert.strictEqual(data.index, 6);
      done()
    })
  });
  it('z.$coir() exec one error ', (done) => {
    z10.$coil().say('err').name().exec(function (data,error) {
      assert.strictEqual(error,'err');
      done()
    })
  });

})



