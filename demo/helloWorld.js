var z = new zcoil()
z.init({
    data(){
        return {
            message: "hello world "
        }
    },
    name(yourName){
        this.message+=yourName
    }
})
z.name("channg")

console.log(z.message)