const localObj = {};
let global = null;

function proxy(key) {
    if (global && (key in global)) {
        let val = global[key];
        Object.defineProperty(global, key, {
            get: function () {
                return val;
            },
            set: function (newValue) {
                try {
                    if (newValue !== val) {
                        if (localObj[key]) {
                            localObj[key].forEach((local) => {
                                if (local.setState) {
                                    local.setState({
                                        [key]: newValue,
                                    });
                                }
                            });
                        }
                        val = newValue;
                        this[key] = newValue;
                    }
                } catch (e) {
                    console.log(e);
                }
            },
        });
    }
}

function clearLocal(local) {
    try {
        const componentWillUnmount = local.componentWillUnmount ? local.componentWillUnmount : () => {
        };
        local.componentWillUnmount = () => {
            componentWillUnmount.call(local);
            local.setState = () => {
                return null;
            };
        };
    } catch (e) {
        console.log(e);
    }
}

export function bindData(key, local) {
    if (global && (key in global)) {
        // eslint-disable-next-line no-unsafe-negation
        if (!localObj[key] || !localObj[key] instanceof Array) {
            localObj[key] = [local];
            clearLocal(local);
        } else {
            localObj[key].push(local);
        }
        proxy(key);
        return global[key];
    } else {
        console.log(`${key} key not in global`);
        return {};
    }
}

export function setGlobal(key, value, callback) {
    if (global && (key in global)) {
        // console.log(`全局设置${key},${JSON.stringify(value)} `);
        global[key] = value;
        if (callback) {
            callback();
        }
    } else {
        console.log(`${key} key not in global`);
    }
}

export function getGlobal(key) {
    if (global && (key in global)) {
        return global[key];
    } else {
        console.log(`${key} key not in global`);
        return {};
    }
}

export function setDefaultGlobal(value) {
    if (!global) {
        // eslint-disable-next-line no-const-assign
        global = value;
    }
}

export function setGlobalStorage(key, value, otherKey) {
    try {
        if ((typeof key === 'string')) {
            setGlobal(key, value);
            localStorage.setItem(otherKey || key, JSON.stringify(value));
        }
    } catch (e) {
        console.log(e);
    }
}

export function initGlobal(defaultGlobal = {}, AsyncStorageListKey = []) {
    try {
        const promiseList = [];
        AsyncStorageListKey.forEach(item => {
            promiseList.push(
                new Promise((resolve, reject) => {
                    const res = localStorage.getItem(item);
                    let globalKey = item;
                    // console.log('内存取出', globalKey, res);
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
