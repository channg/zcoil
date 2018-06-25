import {isEqual,cloneDeep} from 'lodash'
/**
 * watch  每调用一次$watch 就会初始化一个 watch 对象
 */
export class watch{
    _expression:String|Array<String>;
    _expression_is_array:Boolean
    _init_data:any
    _callback:Function
    _on_data_change(to:any){
        // expression 为string
        if(isEqual(to,this._init_data)){
        }else{
            this._callback(this._init_data,to)
            this._init_data = cloneDeep(to)
        }
    }
    constructor(expression:any,callback:Function,_data:any){
        this._callback = callback
        this._init_data = _data
        if(typeof expression=='string'){
            this._expression = expression
            this._expression_is_array = false
        }else if(Array.isArray(expression)){
            this._expression = expression
            this._expression_is_array = true
        }
    }
}