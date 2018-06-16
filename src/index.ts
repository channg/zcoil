import {forIn} from 'lodash'
import {zcoilInterface} from './interface'
import {isPromise} from './utils'

class zcoil implements zcoilInterface {
    _data:any = {};
    _func:any = [];
    [key: string]: any;
    /**
     * init 方法初始化数据,并绑定方法,根据返回值不同,在不同时刻进行不同操作监听数据变动,
     * @param data
     * @param func
     */
    init({data,...func}:any) {
        this._data = data()
        this._func = func
        forIn(func, (value, key)=> {
            this[key] = function (...arg:any[]) {
                this._before(key)
                let _mr =  value.apply(this._data, arg)
                if(_mr) {
                    if(isPromise(_mr)){
                        return new Promise((reserve,reject)=>{
                            _mr.then((datas:any)=> {
                                reserve(datas)
                                Promise.resolve().then(()=>{
                                    this._after(key)
                                })
                            }).catch((error:any)=>{
                                reject(error)
                                Promise.resolve().then(()=>{
                                    this._error(key)
                                })
                            })
                        })
                    } else{
                        this._after(key)
                        return _mr
                    }
                }else{
                    this._after(key)
                }
            }
        })
    };

    _before(key:String) {
        console.log('before')
    };

    _after(key:String) {
        console.log('after')
    };

    _error(key:String) {
        console.log('error')
    };



    constructor() {
    }
}


export default zcoil;
