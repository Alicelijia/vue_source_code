import Watcher from "./observer/watcher";
import { patch } from "./vdom/patch";
export function lifecycleMixin(Vue){
  Vue.prototype._update = function(vnode){
    const vm = this;
    /**
     * 为了获取旧的vnode,可以在每次vm._render()产生的新的vnode与之前的vnode进行比对
     * 
     * */ 
    
    const prevVnode = vm._vnode;
    if(prevVnode){
      vm._vnode = vnode;
      vm.$el = patch(prevVnode,vnode)
    } else {
      /**
       *  之前没有，那就是第一次，直接去用户传入的真实的dom
       *  此时的vm.$el, 是通过用户输入的el:"#app",通过querySelectory("#app"),获取到的
      */
      vm.$el = patch(vm.$el,vnode)
    }
  }
}

// 通过mountComponent渲染页面
export function mountComponent(vm,el){
  const updateComponent = function(){
    vm._update(vm._render());
  }
  // 最后一个标志位为true,代表是渲染watcherr
  new Watcher(vm,updateComponent,()=>{},true);
}

