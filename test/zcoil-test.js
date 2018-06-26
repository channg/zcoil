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

describe('zcoil', () => {
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
    z.$coil().addIndex().multiply().assignment().multiply().exec(() => {
      assert.strictEqual(z.index, 4000);
      done()
    })
  });
})



