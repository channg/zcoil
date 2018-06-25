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
            this.len = d
        })
    },
    testCommit(){
        setTimeout(()=>{
            this.len = 200
            this.$commit()
        },1000)
    }
})

z.$watch(function (from:any,to:any) {
    debugger
})

z.testCommit()





