# 穿针引线

`zcoil`提供了一个方法，用于合并两个`zocil`实例对象。

```javascript
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
```

使用`zcoil.$assign(z3,z4)`

```
var zassign  = zcoil.$assign(z3,z4)
```
前者相同的方法，属性，将会被后者覆盖。

```javascript
zassign.index  // 4
zassign.assignment()
zassign.index  //300
```
>**tips**
>
>`zcoil.$assign` 相当于新生成了一个zcoli实例对象，之前的对象如果发生改变，生成的对象不会同步改变。

