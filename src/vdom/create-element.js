
/**
 * 特别注意这里的children不能为展开式
 * */ 
import { isReservedTag, isObject } from '../util'
export function createElement(vm,tag,data = {},...children){  
  if(isReservedTag(tag)){
    return new Vnode(vm,tag,data,data.key,children,undefined);
  } else {
    // 组件的渲染
   
    let Ctor = vm.$options.components[tag];   
    return createComponent(vm,tag,data,data.key,children,undefined,Ctor)
  }
}

export function createTextNode(vm,text){
  return new Vnode(vm,undefined,undefined,undefined,undefined,text,undefined);
}

function Vnode(vm,tag,data,key,children,text,Ctor){
  this.vm = vm; // 当前的实例
  this.tag = tag;
  this.data = data;
  this.key = key;
  this.children = children;
  this.text = text;
  this.Ctor = Ctor;
}

// 组件的创建
function createComponent(vm,tag,data,key,children,undefined,Ctor){
  if(isObject(Ctor)){
    Ctor = vm.$options._base.extend(Ctor);
  }
  data.hook = {
    init(vnode){
      // console.log("组建的额vnode",vnode);
      let child = vnode.componentInstance = new Ctor({});
      child.$mount();
    },
    prepatch(){

    },
    postpatch(){

    }
  }
  // console.log("tag",new Vnode(`vue-component-${Ctor.cid}-${tag}`,data,key,undefined,{Ctor,children});
  return new Vnode(vm,`vue-component-${tag}`,data,key,undefined,children,{Ctor})
}

/**
 * 特别注意这里的children不能使用展开式，因为这样孩子节点就直接展开项成了元素的属性了
 * */ 