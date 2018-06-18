### zcoil

>更优雅的使用数据，正在开发中。

demo

```
let z = new zcoil()
z.init({
    data(){
        return {
            len: 0,
            text: ""
        }
    },
    fetch(){
        return Promise.resolve(100)
    },
    do(){
        return new Promise((resolve)=> {
            setTimeout(()=>{
                resolve(20)
            },1000)
        })
    },
    get(){
        this.len+=20
    },
    leng(){
        this.fetch().then((id:any)=>{
            this.len+=id
        })
    },
    dosome(){
        this.do().then((d:any)=>{
            this.len = d
        })
    }
})


z.$coil().dosome({aa:11}).leng().exec(()=>{
    console.log(z.len)
})
```