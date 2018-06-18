import {forIn,assign,has} from 'lodash'
import {zcoilInterface} from './interface'
import {isPromise} from './utils'
import {coil} from './coil'
class zcoil implements zcoilInterface {
    [key: string]: any;
    _data:any = {};
    _func:any = {};
    _caller:any = {};

    $coil(args?:any) {
        return new coil(this._data, this._func, this._model, this)
    }

    /**
     * init 方法初始化数据,并绑定方法,根据返回值不同,在不同时刻进行不同操作监听数据变动,
     * @param data
     * @param func
     */
    init({data,...func}:any) {
        this._model = {}
        this._data = data()
        this._func = func
        let that = this
        forIn(func, (value, key)=> {
            this[key] = this._model[key] = function (...arg:any[]) {
                let _to_model:any = that._model
                if (this._call) {
                    this._call(key, 'push')
                    _to_model = new Jumper(that._model, this, that._data).model
                }
                that._before(key)
                that._dataTransToThis(_to_model)
                let _mr = value.apply(_to_model, arg)
                if (_mr) {
                    if (isPromise(_mr)) {
                        return new Promise((reserve, reject)=> {
                            const _calls = this._call
                            _mr.then((datas:any)=> {
                                reserve(datas)
                                Promise.resolve(this).then((data)=> {
                                    that._after(key, _to_model)
                                    that._dataTransToThis(this)
                                    if (_calls) {
                                        _calls(key, 'pop')
                                    }
                                })
                            }).catch((error:any)=> {
                                reject(error)
                                Promise.resolve().then(()=> {
                                    that._error(key, _to_model)
                                    if (_calls) {
                                        _calls(key, 'err')
                                    }
                                })
                            })
                        })
                    } else {
                        Promise.resolve().then(()=> {
                            if (this._call) {
                                this._call(key, 'pop')
                            }
                            that._after(key, _to_model)
                        })
                        return _mr
                    }
                } else {
                    Promise.resolve().then(()=> {
                        if (this._call) {
                            this._call(key, 'pop')
                        }
                        that._after(key, _to_model)
                    })
                }
            }
        })
        this._dataTransToThis()
    };

    private _before(key:String) {
        //console.log('before:' + key)
    };

    private _after(key:any, _to_model:any) {
        this._dataTransToThis(_to_model)
        if (this._caller[key] == null) {
            this._caller[key] = 1
        } else {
            this._caller[key]++
        }
        //console.log('after:' + key)
    };

    private _error(key:String, _to_model:any) {
        this._dataTransToThis(_to_model)
        //console.log('error:' + key)
    };

    public _dataTransToThis(_to_model?:any) {
        forIn(this._data, (value, key)=> {
            if (!!_to_model) {
                this._data[key] = this[key] = value = this._model[key] = _to_model[key]
            }
            else if (!!this._model[key]) {
                this._data[key] = this[key] = value = this._model[key]
            }
            else {
                this._data[key] = this[key] = this._model[key] = value
            }
        })
    }

    constructor() {
    }
}

class Jumper{
    model:any = {}
    constructor(_model:any, some:any, data:any) {
        forIn(_model, (value, key)=> {
            if (has(data,key)) {
                this.model[key] = data[key]
            } else {
                this.model[key] = value
            }
        })
        this.model['_call'] = some._call
    }
}



export default zcoil;
