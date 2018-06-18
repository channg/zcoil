import {forIn} from 'lodash'
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
                that.pArray.push(new Promise((resolve)=> {
                    zcoil[key].call({
                        _call:  (key:any, type:any) => {
                            that._call_stack.push({[type]:key})
                            that._ca(key,type)
                        }
                    }, ...args)
                    resolve()
                }))
                return that
            }
        })
    };


    exec(_callback?:Function) {
        this._callback = _callback
        let box:any = null;
        this.pArray.forEach((item:any)=> {
            if (box === null) {
                box = item
            } else {
                box = this._re(box, item)
            }
        })
        box.then(()=>{

        })

    }

    _re(pro:any, proNext:any) {
        return new Promise((resolve)=> {
            pro.then(()=> {
                proNext.then(()=> {
                    resolve()
                })
            })
        })
    };

    _ca(key:any, type:String) {
        if (type === 'push') {
            ++this._call_index
        } else if (type === 'pop') {
            --this._call_index
            this._check_call_array(this._model)
        } else if (type === 'err') {
            this._call_index = 0
            this._check_call_array(this._model,new Error('The call chain has reject'))
        }
    };

    _check_call_array(_model:any,err?:any) {
        if (this._call_index === 0 && this._callback) {
            this._zcoil._dataTransToThis()
            this._callback(_model,err)
        }
    };
}