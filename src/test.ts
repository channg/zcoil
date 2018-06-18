import zcoil from './index'

let z = new zcoil()
z.init({
    data(){
        return {
            len: 0,
            text: ""
        }
    },
    fetch(){
        return Promise.resolve(2)
    },
    do(){
        return new Promise((resolve)=> {
            setTimeout(()=>{
                resolve(20)
            },1000)
        })
    },
    j20(){
        console.log(this.len)
        this.len+=20
        console.log(this.len)
    },
    x2(){
        console.log(this.len)
        this.fetch().then((id:any)=>{
            this.len*=id
        })
    },
    d20(){
        this.do().then((d:any)=>{
            this.len = d
        })
    }
})






z.$coil().d20().x2().j20().d20().x2().j20().exec(()=>{
    console.log('callback')
    console.log(z.len)
})



