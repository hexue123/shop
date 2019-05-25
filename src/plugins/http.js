// 关于axios变vue插件的文件
// 先引入axios
import axios from "axios";
// 定义一个空对象
var Http = {};
Http.install = function(Vue, options) {
        // 4. 添加实例方法
        axios.defaults.baseURL = "http://localhost:8888/api/private/v1/";
        // 将axios挂载到Vue的原型上
        Vue.prototype.$http = axios;
    }
    //导出Http对象
export default Http;