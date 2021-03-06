import { initMixin } from "./init";
import { renderMixin } from "./render";//将render挂载到原型上
import { lifecycleMixin } from "./lifecycle";
import { initGlobalAPI } from "./initGlobalAPI/index";
import { stateMixin } from "./state";
function Vue(options) {
  this._init(options);
}
initMixin(Vue);
renderMixin(Vue);
lifecycleMixin(Vue);
stateMixin(Vue)//扩展原型，状态合并
// es6 Moduel必须要使用export default

// 初始化全局的api
initGlobalAPI(Vue);
export default Vue;
