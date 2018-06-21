
export class watch{
    _expression:String|Array<String>;
    _on_data_change(from:any,to:any){
        debugger
        console.log(from)
        console.log(to)
    }
    _expression_is_array:Boolean
    constructor(expression?:any,callback?:Function){
        if(typeof expression=='string'){
            this._expression = expression
            this._expression_is_array = false
        }else if(Array.isArray(expression)){
            this._expression = expression
            this._expression_is_array = true
        }


    }
}