import {setItem,getItem,removeItem} from 'localforage'
import {getTimestamp} from './utils'

export function serializeData(id:string,data:any){
    return setItem(id,data)
}

export function getData(id:string){
    return new Promise((resolve,reject)=>{
        getItem(`_${id}_deadline`).then((time:number)=>{
            if(time&&time>getTimestamp()){
                getItem(id).then((data)=>{
                    resolve(data)
                }).catch(()=>{
                    resolve()
                })
            }else{
                resolve()
                removeItem(id)
                removeItem(`_${id}_deadline`)
            }
        })
    })
}