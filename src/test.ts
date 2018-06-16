import zcoil from './index'

let z = new zcoil()
z.init({
    data(){
        return {
            len: 0
        }
    },
    fetch(){
        console.log(this.len)
        return Promise.resolve(100)
    },
    get(){
        this.len = 100
    }
})

z.fetch().then((data:any)=>{
    console.log(data)
})

z.get()