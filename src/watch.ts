import {isEqual,cloneDeep,get} from 'lodash'
/**
 * watch  每调用一次$watch 就会初始化一个 watch 对象
 */
export class watch{
    _expression:string;
    _expression_is_array:Boolean
    _init_data:any
    _callback:Function
    _on_data_change(to:any){
        // expression 为string
        if(this._expression&&!this._expression_is_array){
            var isEq = this._expressionEquals(this._expression,to,this._init_data)
            if(!isEq){
                this._callback(get(this._init_data,this._expression),get(to,this._expression))
                this._init_data = cloneDeep(to)
            }
        }else{
            if(!isEqual(to,this._init_data)){
                let deep_to = cloneDeep(to)
                this._callback(this._init_data,deep_to)
                this._init_data = deep_to
            }
        }
    }

    _expressionEquals(expression:any,to:any,from:any){
        return isEqual(get(to,expression),get(from,expression))

    }
    constructor(expression:any,callback:Function,_data:any){
        this._callback = callback
        this._init_data = _data
        if(typeof expression=='string'){
            this._expression = expression
            this._expression_is_array = false
        }
    }
}