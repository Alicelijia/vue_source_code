import { observe } from "./observer/index.js";
import { isFunction, isObject } from "./util";
import Watcher from './observer/watcher'
export function stateMixin(Vue) {
  Vue.prototype.$watch = function (key, handler, options = {}) {
    // 是一个用户自己写的watcher
    options.user = true;
    new Watcher(this,key,handler,options)
  }
}
export function initState(vm) {
  const opts = vm.$options;
  // 根据用户传入的不同的属性，进行初始化操作，如initData
  if (opts.data) {
    initData(vm);
  }
  if (opts.props) {
    initProps(vm);
  }
  if (opts.methods) {
    initMethod(vm);
  }
  if (opts.computed) {
    initComputed(vm,opts.computed);
  }
  if (opts.watch) {
    initWatch(vm,opts.watch);
  }
}
function initProps() {}
function initMethod() {}
function initData(vm) {
  let data = vm.$options.data;
  // 将vm实例上挂载上_data,并且如果data为函数则调用data
  data = vm._data = isFunction(data) ? data.call(vm) : data;
  // 对data进行一层代理 vm._data
  // 用户去vm.name取值类似于去vm._data.name上取值
  for (let key in data) {
    proxy(vm, "_data", key);
  }
  observe(data);
}
function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      // vm._data.name
      return vm[source][key];
    },
    set(newVal) {
      vm[source][key] = newVal;
    },
  });
}

function initWatch(vm,watches) {
  // console.log(watches)
  // 传入用户传入的所有的watcher,
  // 本质上是获取用户传入所有的值并调用，在Watcher并将新值老值一并传给用户
  for (const key in watches) {
    let handler = watches[key];
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++){        
        createWatcher(vm,key,handler[i])
      }
    } else {
      createWatcher(vm,key,handler)
    }
  }
}
//处理用户传入的每一个watch函数
function createWatcher(vm,key,handler,options ={}) {
  // console.log(key,handler,options)
  // 由于用户有2中写法， 直接写函数、或者 'school.mid'
  // if (isObject(handler)) {
  //  console.log(handler)
  // }
  return vm.$watch(key,handler,options)
}


function initComputed(vm, computed) {
  // 存放计算属性的watcher
  const watchers = vm._computedWatchers = {};
  for (let key in computed) {
    const userDef = computed[key]
    // 用户在computed定义的有可能有2种情况，对象/函数，如果是对象就是用户定义的get
    const getter = isFunction(userDef) ? userDef : userDef.get;
    // 创建计算属性watcher
    // z每个属性都记录一个watcher
    watchers[key] = new Watcher(vm, getter, () => { }, { lazy: true });
    // 将key定义在vm上，如同data的挂载
    defineComputed(vm,key,userDef)
  }
}

// 现在知道为什么data里面的值为什么不能与computed命名相同
// 他们的本质都是一样的，都是通过在vm定义而get/set，
// 如果希望取值的时候，实现缓存，则不能直接调用get,使用createComputedGetter
function defineComputed(vm, key, userDef) {
  let sharedProperty = {}
  //如果为函数，则直接在当前属性上取值
  if (isFunction(userDef)) {
    // 
    sharedProperty.get = createComputedGetter(key);
  } else {
    // 如果为对象，这说明用户自己定义了set/get
    sharedProperty.get = createComputedGetter(userDef.get);
    sharedProperty.set = userDef.set;
  }
  // 计算属性就是一个defineProperty
  Object.defineProperty(vm, key, sharedProperty)
}

function createComputedGetter(getter) {
  // 去计算属性走的走的是这个函数
  console.log(getter)
  return function computedGetter() {
    console.log(this)
  }
}