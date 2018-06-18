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
        return Promise.resolve(100)
    },
    do(){
        return new Promise((resolve)=> {
            setTimeout(()=>{
                resolve(200)
            },1000)
        })
    },
    get(){
        this.len+=20
    },
    leng(){
        console.log(this)
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





z.$coil().dosome().leng().exec(()=>{
    console.log(z.len)
})



