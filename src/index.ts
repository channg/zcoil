interface zcoilInterface{
    init:Function;
}

class zcoil implements zcoilInterface {
    init({data,fetch}:Config){
    };
    constructor() {
    }
}

var z = new zcoil();

z.init({data(){},fetch(){}})

interface Config {
    data: Function;
    fetch: Function;
}
