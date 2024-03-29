import { mergeOptions ,isObject} from "../util.js";

// VUe.mixin是在实例上 扩展的方法
export function initGlobalAPI(Vue) {
  // 用户存放全局属性的,每个组件初始化的时候都会和options选项进行合并
  // Vue.component
  // Vue.filter
  // Vue.directive
  // 整合了所有全局相关的内容
  Vue.options = {};
  Vue.options._base = Vue;  
  Vue.minxin = function (mixin) {
    // console.log("mixin",mixin)
    this.options = mergeOptions(this.options, mixin);
    return this;
  };
  // 生命周期的合并 [beforeCreated,beforeCreated]
  Vue.minxin({
    a: 1,
    beforeCreate() {
      // console.log("global-hook", 1);
    },
  });
  Vue.minxin({
    b: 2,
    beforeCreate() {
      // console.log("global-hook", 2);
    },
  });
  // _base 就是Vue的构造函数
  // 无论后续创建多少个子类，都可以通过_base找到Vue
  // Vue._base = Vue;
  Vue.options.components = {}

  Vue.component = function(id,definition){
    let name = definition.name || id;
    definition.name = name; 
    // 如果用户传入的为对象，则需要手动的调用Vue.extend将其转换为函数
    if(isObject(definition)){
      definition = Vue.extend(definition);
    }
    // 给当前的组件名赋值，就是封装了init方法的回调函数
    Vue.options.components[name] = definition;
    return this;
  }

  Vue.extend = function(opt){
    const Super = this;
    const Sub = function(options){
      this._init(options)
    }
    // 这里一定要继承父类的原型，否则不会去原型上找_init方法
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    // 将父子组件的options进行合并处理
    Sub.options = mergeOptions(Super.options,opt);
    // console.log('Sub.options',Sub.options)
    //继承父类的静态属性
    Sub.extend = Super.extend;
    Sub.minxin = Super.minxin;
    return Sub;
  }
}
