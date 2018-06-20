import {assign, forIn} from 'lodash'
import {coilConif} from './interface/coilConfig'

export class coil {
    pArray: any[] = [];
    [key: string]: any;
    _call_index: any = 0;
    _callback: Function;
    _model: any;
    _call_stack: any[] = [];
    _zcoil: any;
    _error:Error
    _default_config: coilConif = {
        rollback: false,
        errorContinue: true
    }
    _rollback_data_: any = {}
    constructor(data: any, funcs: any, model: any, zcoil: any, config?: coilConif) {
        assign(this._default_config, config)
        // 注意 rollback 的数据 将为 $coil 被调用时的数据，如果调用过程中有并行的数据改变，rollback不会记录。
        if (this._default_config.rollback) {
            this._save_data(data)
        }

        let that = this
        this._zcoil = zcoil
        this._model = model
        forIn(funcs, (value, key) => {
            this[key] = function (...args: any[]) {
                that.pArray.push(() => {
                    zcoil[key].call({
                        _call: (key: any, type: any) => {
                            that._call_stack.push({[type]: key})
                            that._ca(key, type)
                        }
                    }, ...args)
                })
                return that
            }
        })
    };

    exec(_callback?: Function) {
        this._callback = _callback
        this._next()
    };

    _next() {
        if (this.pArray.length > 0) {
            this.pArray.shift()()
        } else {
            this._check_call_array()
        }
    };

    _ca(key: any, type: String) {
        if (type === 'push') {
            ++this._call_index
        } else if (type === 'pop'||(this._default_config.errorContinue&&type === 'err')) {
            --this._call_index
            if(type==='err'){
                this._error = new Error('The call chain has reject')
            }
            this._check_call_array()
        } else if (type === 'err'&&!this._default_config.errorContinue) {
            this._call_index = 0
            this.pArray = []
            this._error = new Error('The call chain has reject')
            this._check_call_array()
        }
    };

    _check_call_array() {
        if (this._call_index === 0 && this._callback) {
            this._zcoil._dataTransToThis()
            if (this.pArray.length > 0) {
                this._next()
            } else {
                if(!!this._error&&this._default_config.rollback){
                    this._zcoil._dataTransToThis(this._rollback_data_)
                }
                this._callback(this._model, this._error)
                this._error = null
                this._call_stack = []
            }
        }
    };

    _save_data(data:any){
        forIn(data,(value,key)=>{
            this._rollback_data_[key] = value
        })
    }
}


