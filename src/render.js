import {isObject} from './util';
import {createTextNode,createElement} from './vdom/create-element'


export function renderMixin(Vue){
  // 创建 元素型的虚拟节点
  
  Vue.prototype._c = function(){
    const vm = this;
    return createElement(vm,...arguments);
  }
  // 创建文本型的虚拟节点
  Vue.prototype._v = function(text){
    const vm = this;
    return createTextNode(vm,text);
  }
  // JSON.stringify
  Vue.prototype._s = function(val){
    return isObject(val) ? JSON.stringify(val):val;
  }
  // 用当前实例调用原型上的render方法，返回虚拟节点
  Vue.prototype._render = function(){
    const vm = this;
    const {render} = vm.$options;
    const vnode = render.call(vm);;
    // console.log('render生成的vnode',vnode);
    return vnode;
  }
}
