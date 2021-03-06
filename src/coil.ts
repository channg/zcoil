import forIn =require('lodash/forIn');
import assign = require('lodash/assign');
import {coilConif} from './interface/CoilConfig'

export class coil {
    pArray: any[] = [];
    [key: string]: any;
    _call_index: any = 0;
    _callback: Function;
    _model: any;
    _call_stack: any[] = [];
    _zcoil: any;
    _error: any
    _default_config: coilConif = {
        rollback: false,
        errorContinue: true,
        saveWithExec: true
    }
    _ncoil: any
    _rollback_data_: any = {}
    _wait: any = null
    _next_exec: Function

    constructor(zcoil: any, config?: coilConif, wait?: any) {
        if (wait) {
            this._wait = wait
        }
        assign(this._default_config, config)
        // 注意 rollback 的数据 将为 $coil 被调用时的数据，如果调用过程中有并行的数据改变，rollback不会记录。
        if (this._default_config.rollback) {
            this._save_data(zcoil._data)
        }

        let that = this
        this._zcoil = zcoil
        this._model = zcoil._model
        this._model.$mixin = zcoil.$mixin
        /**
         * 初始化调用栈
         */
        forIn(zcoil._func, (value, key) => {
            this[key] = function (...args: any[]) {
                that.pArray.push(() => {
                    zcoil[key].call({
                        _call: (key: any, type: any,error?:any) => {
                            that._call_stack.push({[type]: key})
                            that._ca(key, type,error)
                        }
                    }, ...args)
                })
                return that
            }
        })
        this._add_deserialize(zcoil)
    };

    exec(_callback?: Function) {
        let nCoil = new coil(this._zcoil, this._default_config, true)
        this._ncoil = nCoil
        this._callback = _callback
        // is the queue is be perform ,do not run _next
        if (!this._wait) {
            this._next()
        }
        return nCoil
    };

    _add_deserialize(zcoil: any) {
        this.$deserialize = (...args: any[]) => {
            this._call_stack.push({push: 'deserialize'})
            this._ca('deserialize', 'push')
            zcoil.$deserialize(...args).then((data: any) => {
                this._call_stack.push({pop: 'deserialize'})
                this._ca('deserialize', 'pop')
            })
            return this
        }
    }

    _next() {
        if (this.pArray.length > 0) {
            this.pArray.shift()()
        } else {
            this._check_call_array()
        }
    };

    _ca(key: any, type: String,error?:any) {
        if (type === 'push') {
            ++this._call_index
        } else if (type === 'pop' || (this._default_config.errorContinue && type === 'err')) {
            --this._call_index
            if (type === 'err') {
                this._set_error(error)
            }
            this._check_call_array()
        } else if (type === 'err' && !this._default_config.errorContinue) {
            this._call_index = 0
            this.pArray = []
            this._error = new Error('The call chain has reject')
            this._check_call_array()
        }
    };

    /**
     * When only one error occurs in the queue, the error is returned, and when two or more errors occur, an array is returned
     * @param error
     * @private
     */
    _set_error(error: any) {
        if(!error){
            error = new Error('no message reject')
        }
        if (!this._error) {
            this._error = error
        } else {
            if (Array.isArray(this._error)) {
                this._error.push(error)
            } else {
                this._error = [this._error, error]
            }
        }
    }

    _check_call_array() {
        if (this._call_index === 0&&this.pArray.length > 0) {
            this._next()
        }
        //done the queue
        else if (this._call_index === 0 && this.pArray.length === 0) {
            if (this._callback) {
                this._zcoil._dataTransToThis()
                //Check whether the data is rolled back
                if (!!this._error && this._default_config.rollback) {
                    this._zcoil._dataTransToThis(this._rollback_data_)
                }
                this._callback.call(this._zcoil, this._model, this._error)
                this._error = null
                this._call_stack = []
            }
            //next exec : if this._ncoil.pArray.length  >0 means the next queue is be perform
            if (this._ncoil.pArray.length > 0) {
                //check saveWithExec
                if (this._ncoil._default_config.rollback && this._ncoil._default_config.saveWithExec) {
                    this._ncoil._save_data(this._zcoil._data)
                }
                this._ncoil._next()
            } else {
                this._ncoil._wait = false
            }
        }
    };

    _save_data(data: any) {
        forIn(data, (value, key) => {
            this._rollback_data_[key] = value
        })
    }
}
