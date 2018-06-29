export function isPromise(obj:any) {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

export function getTimestamp(){
    return new Date().getTime()
}