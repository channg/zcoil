import {forIn,head} from 'lodash'
export class coil {
    pArray:any[] = [];
    [key: string]:any;
    _last:any = {};
    _call_index:any = 0
    _callback:Function
    _model:any
    _call_stack:any[] = []
    _zcoil:any
    _args:any

    constructor(data:any, funcs:any, model:any, zcoil:any) {
        let that = this
        this._zcoil = zcoil
        this._model = model
        forIn(funcs, (value, key)=> {
            this[key] = function (...args:any[]) {
                that.pArray.push(()=> {
                    zcoil[key].call({
                        _call: (key:any, type:any) => {
                            that._call_stack.push({[type]: key})
                            that._ca(key, type)
                        }
                    }, ...args)
                })
                return that
            }
        })
    };


    exec(_callback?:Function) {
        this._callback = _callback
        this._next()

    }


    _next() {
        if (this.pArray.length > 0) {
            this.pArray.shift()()
        }else{
            this._check_call_array()
        }
    }


    _ca(key:any, type:String) {
        if (type === 'push') {
            ++this._call_index
            console.log(key + ':' + type + ';' + this._call_index)
        } else if (type === 'pop') {
            --this._call_index
            console.log(key + ':' + type + ';' + this._call_index)
            this._check_call_array()
        } else if (type === 'err') {
            this._call_index = 0
            this._check_call_array(new Error('The call chain has reject'))
        }
    };

    _check_call_array(err?:any) {
        if (this._call_index === 0 && this._callback) {
            this._zcoil._dataTransToThis()
            if(this.pArray.length>0){
                this._next()
            } else{
                this._callback(this._model, err)
            }
        }
    };
}