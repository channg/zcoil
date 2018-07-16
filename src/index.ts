import assign = require('lodash/assign');
import cloneDeep =  require('lodash/cloneDeep');
import forIn = require('lodash/forIn');
import  merge =require('lodash/merge');
import {getTimestamp, isPromise} from './utils'
import {coil} from './coil'
import {coilConif} from './interface/coilConfig'
import {zcoilConif} from './interface/zcoilConig'
import {watch} from './watch'
import scoil from './scoil'
import {getData, serializeData} from "./serialize";
import {install} from "./vue.ts";
class zcoil {
    constructor(config?: zcoilConif) {
        this.install = install
        if (config) {
            config = assign({}, zcoil._init_config, config)
            this._config = config
            this.$mixin = config.mixin
        }
    }
    [key: string]: any;
    private _config: any = {}
    private _data: any = null;
    private _func: any = {};
    _watch_array: any[] = []
    $mixin:any = {}

    static _init_config = {
        localStorage: true,
        deadline: 30 * 24 * 3600 ,
        cover: true,
        mixin:{}
    }

    static $assign(...datas: any[]) {
        let _merge = merge({}, ...datas)
        let _merge_func = cloneDeep(_merge._func)
        let _config: any = {
            data() {
                return cloneDeep(_merge._data)
            }
        }
        forIn(_merge_func, (value: any, key: any) => {
            _config[key] = value
        })
        let _assign_obj = new zcoil()
        _assign_obj.init(_config)
        return _assign_obj
    }

    $coil(args?: coilConif) {
        return new coil(this, args)
    };

    $watch(callback?: Function): void;
    $watch(expression?: String | Array<String>, callback?: Function): void;
    $watch(expression?: any, callback?: Function) {
        if (typeof expression === 'function') {
            this._watch_array.push(new watch(null, expression, cloneDeep(this._data)))
        }
        else {
            this._watch_array.push(new watch(expression, callback, cloneDeep(this._data)))
        }
    }

    $commit() {
        if (this.$zcoil) {
            this.$zcoil._dataTransToThis.call(this.$zcoil, this)
        } else {
            this._dataTransToThis.call(this, this)
        }
    }

    _push_dictate(model: any) {
        model.$commit = this.$commit
    }

    /**
     * init 方法初始化数据,并绑定方法,根据返回值不同,在不同时刻进行不同操作监听数据变动,
     * @param data
     * @param func
     */
    init({data, ...func}: any) {
        this._model = {}
        this._serialize()
        if(data){
            this._data = data()
        }else{
            this._data = {}
        }
        func.$deserialize = this.$deserialize
        this._func = func
        let that = this
        forIn(func, (value, key) => {
            this[key] = this._model[key] = function (...arg: any[]) {
                let _to_model: any = that._model
                if (this._call) {
                    _to_model = new scoil(that._model, this, that._data).model
                }
                _to_model.$zcoil = that
                that._push_dictate(_to_model)
                if (this._call) {
                    this._call(key, 'push')
                }
                that._before(key)
                that._dataTransToThis(_to_model)
                _to_model.$mixin = that._config.mixin
                let _mr = value.apply(_to_model, arg)
                if (_mr) {
                    if (isPromise(_mr)) {
                        return new Promise((reserve, reject) => {
                            const _calls = this._call
                            _mr.then((datas: any) => {
                                reserve(datas)
                                Promise.resolve().then(() => {
                                    that._after(key, _to_model)
                                    that._dataTransToThis(this)
                                    if (_calls) {
                                        _calls(key, 'pop')
                                    }
                                })
                            }).catch((error: any) => {
                                reject(error)
                                Promise.resolve().then(() => {
                                    that._error(key, _to_model)
                                    if (_calls) {
                                        _calls(key, 'err')
                                    }
                                })
                            })
                        })
                    } else {
                        that._dataTransToThis(_to_model)
                        if (this._call) {
                            this._call(key, 'pop')
                        }
                        that._after(key, _to_model)
                        return _mr
                    }
                } else {
                    that._dataTransToThis(_to_model)
                    if (this._call) {
                        this._call(key, 'pop')
                    }
                    that._after(key, _to_model)
                }
            }
        })
        this._dataTransToThis()

    };

    /**
     * 反序列化数据方法
     */
    $deserialize() {
        let that = this.$zcoil || this
        return new Promise((resolve) => {
            if (that._config && that._config.name && that._config.localStorage) {
                getData(that._config.name).then((d) => {
                    if (d && that._config.cover) {
                        that._data = d
                        that._dataTransToThis(d)
                        resolve(that._data)
                    } else if (d) {
                        resolve(d)
                    } else {
                        resolve(that._data)
                    }
                })
            } else {
                resolve(that._data)
            }
        })

    }

    private _before(key: String) {
        //console.log('before:' + key)
    };

    private _after(key: any, _to_model: any) {
        this._dataTransToThis(_to_model)
        //console.log('after:' + key)
    };

    private _error(key: String, _to_model: any) {
        this._dataTransToThis(_to_model)
        //console.log('error:' + key)
    };

    private _watch_each_call(to: any) {
        if (this._watch_array.length > 0) {
            this._watch_array.forEach((_watch) => {
                _watch._on_data_change(to)
            })
        }
    }

    private _serialize() {
        if (this._config && this._config.name && this._config.localStorage) {
            this.$watch((from: any, to: any) => {
                if (from) {
                    serializeData(this._config.name, this._data).catch(() => {
                        throw new Error('new zcoil(); serialize error');
                    })
                    serializeData(`_${this._config.name}_deadline`, getTimestamp() + this._config.deadline * 1000).catch(() => {
                        throw new Error('new zcoil(); serialize error');
                    })
                }
            })
        }
    }

    private _dataTransToThis(_to_model?: any) {
        forIn(this._data, (value, key) => {
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
        if (this._watch_array.length > 0) {
            this._watch_each_call(this._data)
        }
    };
}

export default zcoil