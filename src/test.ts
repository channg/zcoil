import zcoil from './index'

let z = new zcoil()
z.init({
    data() {
        return {
            len: 2,
            text: "",
            msg:{aa:11}
        }
    },
    fetch() {
        return Promise.resolve(2)
    },
    do() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(20)
            }, 1000)
        })
    },
    j20() {
        this.msg.aa +=200
    },
    x2() {
        this.fetch().then((id: any) => {
            this.len *= id
        })
    },
    d20() {
        this.do().then((d: any) => {
            this.msg.aa = 200
        })
    },
    testCommit(){
        setTimeout(()=>{
            this.len = 200
            this.$commit()
        },1000)
    }
})

z.$coil().d20().x2().j20().exec(function(data:any){
})

z.$watch(function(from:any,to:any){
    console.log(from)
    console.log(to)
})





