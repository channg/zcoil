var zcoil = require('../dist/zcoil')
const assert = require('assert');
var z = new zcoil()
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



describe('||||  ZCOIL MOCHA TEST  ||||', () => {
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
  
})



