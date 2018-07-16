import forIn = require('lodash/forIn');
export function install(Vue:any,options:any){
    Vue.prototype.$zcoil = this
    this.$use = (vm:any)=>{
        this.$watch((from:any,to:any)=>{
            forIn(to,(value:any,key:any)=>{
                if(vm[key]!==undefined){
                    vm[key] = value
                }
            })
        })
    }
}