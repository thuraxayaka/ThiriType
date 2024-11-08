export const utils = {
    isObjectEmpty : (Obj) => {
        return Object.keys(Obj).length === 0;
    },
    clearAll: (Obj) => {
        Object.keys(Obj).forEach((key) => {
            delete Obj[key];
        })
    }
}