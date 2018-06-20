import zcoil from './index'

let z = new zcoil()
z.init({
    data() {
        return {
            len: 2,
            text: ""
        }
    },
    fetch() {
        return Promise.reject('test error')
    },
    do() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(20)
            }, 1000)
        })
    },
    j20() {
        this.len += 20
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
    }
})

z.$coil({rollback: false, errorContinue: true}).d20().x2().j20().exec((data: any, error: any) => {
    console.log(data.len)
    console.log(error)
})




