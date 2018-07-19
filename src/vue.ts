import forIn = require('lodash/forIn');
/**
 * vue install function
 * @param Vue
 * @param options
 */
export function install(Vue:any, options:any) {
    Vue.prototype.$zcoil = this
    /**
     *  $use to watch the data and save in vm
     * @param vm
     * @param options
     */
    this.$invoke = (vm:any, options:any)=> {
        this.$watch((from:any, to:any)=> {
            if (!!options) {
                if(Array.isArray(options)){
                    options.forEach((key)=>{
                        vm[key] = to[key]
                    })
                }else{
                    forIn(options,(value:any,key:any)=>{
                        vm[key] = to[value]
                    })
                }
            }else{
                forIn(to, (value:any, key:any)=> {
                    if (vm[key] !== undefined) {
                        vm[key] = value
                    }
                })
            }
        })
    }
}