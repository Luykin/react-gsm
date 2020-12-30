import {setDefaultGlobal} from './global';

export function initGlobal(defaultGlobal = {}, AsyncStorageListKey = []) {
    try {
        const promiseList = [];
        AsyncStorageListKey.forEach(item => {
            promiseList.push(
                new Promise((resolve, reject) => {
                    const res = localStorage.getItem(item);
                    let globalKey = item;
                    // if (globalKey.indexOf(ENV) === 0) {
                    //     globalKey = globalKey.replace(ENV, '');
                    // }
                    console.log('内存取出', globalKey, res);
                    setKey(defaultGlobal, globalKey, res, resolve);
                })
            );
        });
        setDefaultGlobal(defaultGlobal);
        return Promise.all(promiseList);
    } catch (e) {
        console.log(e)
    }
}

function setKey(defaultGlobal, key, res, resolve) {
    if (res) {
        try {
            defaultGlobal[key] = JSON.parse(res);
        } catch (e) {
            defaultGlobal[key] = res;
        }
    }
    resolve && resolve(res);
}
