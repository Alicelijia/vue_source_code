let id = 0;
import { pushTarget, popTarget } from "./dep.js";
class Watcher {
  constructor(vm, exprOrFn, callback, options) {
    this.vm = vm;
    this.exprOrFn = exprOrFn;
    //区分渲染watcher与用户传入的watcher,如果用户不传默认为false !!undefined
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.dirty = options.lazy;//如果是计算属性，那么默认值lazy为true dirty true
    this.cb = callback;
    this.options = options;
    this.id = id++;
    this.deps = [];
    this.depsId = new Set();
    //需将所有的变量的申明放到this.get的前面
    if (typeof exprOrFn == "string") {
      // 需要将表达式转换为函数 school.mid
      this.getter = function () {
        // console.log("如果是用户watcher", "exprOrFn", vm[exprOrFn])
        let path = exprOrFn.split(".");
        let obj = vm;
        for (let i = 0; i < path.length; i++){
          obj = obj[path[i]]
        }
        return obj;
      }
    } else {
      this.getter = exprOrFn;
    }
    // 将初始值记录到value属性上 this.lazy ? undefined :
    this.value = this.get();
  }
  // new Watcher则会让exprOrFn执行
  get() {
    // console.log("thisget", this.depsId);
    // 把当前的watcher存储
    pushTarget(this);
    const value = this.getter.call(this.vm); // 执行函数 （依赖收集）
    popTarget();
    return value;
  }
  update() {
    // 等待着，一起来更新，因为每次调用update的时候 都放入了watcher
    // console.log("this.id", this.id);
    // this.get();
    if (this.lazy) {
      this.dirty = true;
    } else {
        queueWatcher(this);
    }
  }
  addDep(dep) {
    let id = dep.id;
    if (!this.depsId.has(id)) {
      this.depsId.add(id);//dep里面存放watcher
      this.deps.push(dep);
      dep.addSub(this);//watcher里面存放dep
    }
  }
  run() {
    let value = this.get();//获取新值
    let oldVal = this.value;
    this.value = value;
    // console.log("this.callback",this.callback)
    if (this.user) {      
      this.cb.call(this.vm,value,oldVal)
    }
  }
  evaluate() {
    this.value = this.get()
    console.log("this.value",this.value)
    this.dirty = false;//表示当前已经取值过了
  }
}

let queue = [];
let has = {};
// 希望等同步代码执行完毕后再更新watcher
function queueWatcher(watcher) {
  const id = watcher.id;
  if (has[id] == null) {
    queue.push(watcher);
    setTimeout(() => {
      queue.forEach((watcher) => watcher.run());
      // 清空队列
      queue = [];
      has = {};
    }, 0);
  }
}
export default Watcher;
