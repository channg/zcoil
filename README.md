<h1 align="center">zcoil</center></h3>

<p align="center">
  <a href="https://travis-ci.org/channg/zcoil"><img alt="Travis Status" src="https://img.shields.io/travis/channg/zcoil/master.svg?style=flat-square"></a>
  <a href="https://www.npmjs.com/package/zcoil"><img alt="npm" src="https://img.shields.io/npm/v/zcoil.svg?style=flat-square"></a>
  <a href="https://github.com/channg/zcoil/blob/master/LICENSE"><img alt="license" src="https://img.shields.io/github/license/channg/zcoil.svg?style=flat-square"></a>
</p>


> `Zcoil` is a model layer framework for more convenient and elegant data manipulation
<h3>use</h3>
<p>install zcoil with npm</p>

```  
npm i zcoil
```
<h3>easy to use in Hello world</h3>

**Instantiated object**

```javascript
var z = new zcoil()
```

**initialization with param**

```javascript
z.init({
  data() {
    return {
      message: "hello world "
    }
  },
  asyncGetSaySomething(param) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(param)
      }, 1000)
    })
  },
  say(param) {
    this.asyncGetSaySomething(param).then((say) => {
      this.message += "," + say
    })
  },
  endToSay(){
    this.message += ",come on "
  }
})
```
**Magical method call process with**`$coil()`

```javascript
var hl = z.$coil().say("Thank your star this project")

hl = hl.endToSay()

hl  = hl.say("It works really well")

hl.exec((data)=>{
  data.message  //"hello world ,Thank your star this project,come on ,It works really well" 
  z.message     //"hello world ,Thank your star this project,come on ,It works really well" 
})
```

**You can use the `$watch` method to get the data before the `$coil` method is executed**

```javascript
z.$watch((from,to)=>{
  console.log(from.message)
  console.log(to.message)
})
```

<h3>test it online</h3>

try it in[ jsfiddle](https://jsfiddle.net/channg/uhfxqsj4/11/)


<h3>document</h3>

>Currently only Chinese documents are available

[doc is here](https://channg.github.io/zcoil/)

