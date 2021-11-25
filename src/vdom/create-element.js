
/**
 * 特别注意这里的children不能为展开式
 * */ 

export function createElement(vm,tag,data = {},...children){
  const vnode =  new Vnode(vm,tag,data,data.key,children,undefined);
  // console.log("vnode",vnode);
  return vnode;
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

/**
 * 特别注意这里的children不能使用展开式，因为这样孩子节点就直接展开项成了元素的属性了
 * */ 