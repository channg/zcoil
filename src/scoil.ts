import forIn = require('lodash/forIn')
import has = require( 'lodash/has')
export default class scoil {
    model: any = {};
    constructor(_model: any, zcoil: any, data: any) {
        forIn(_model, (value, key) => {
            if (has(data, key)) {
                this.model[key] = data[key]
            } else {
                this.model[key] = value
            }
        })
        this.model['_call'] = zcoil._call
        this.model.$zcoil = zcoil
    };
}