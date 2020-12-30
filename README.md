## 🚀react-gsm是一个轻量级的全局状态管理库

##### **⭐️安装**

`yarn add react-gsm`

##### **⭐️初始化**

请尽可能提前初始化,react-gsm会在浏览器localStorage中主动取出键值对存储全局变量中

```
import {initGlobal} from 'react-gsm';

const defaultGlobal = {  userInfo: null,  token: null };

const AsyncStorageListKey = ['token', 'userInfo'];

initGlobal(defaultGlobal, AsyncStorageListKey);
```

##### **⭐️简单使用**

bindData会监听全局变量的改变,从而改变每一个页面state中的值,第二参数传入this   bindData(key, local)

setGlobal修改全局变量的值 setGlobal(key, value, callback)

getGlobal获取全局变量的值  getGlobal(key)

```
import {bindData, setGlobal} from 'react-gsm';
export default class Test extends React.Component {  
    constructor(props) {  
        super(props);
        this.state = {  
            userInfo: bindData('userInfo', this), 
        }
    }
    componentDidMount() {
         setTimeout(() => {
            setGlobal('userInfo', {'name': 'luoyukun'}, ()=> {
                console.log(this.state.userInfo);
            })
         }, 1000)
    }
}
```

##### **⭐️localStorage联合使用**

场景:需要缓存用户信息到网页本地,并随时刷新用户信息,在第一次网络请求还没有拿到用户信息的时候能够展示用户上一次缓存的用户信息

setGlobalStorage(key, value, otherKey)

```
setGlobalStorage('userInfo', {'name': 'luoyukun'});
```

##### **⭐️待完善**

react-native-gsm 链接:-
