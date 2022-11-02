// import 
export function patch(oldnode,vnode){
  if(!oldnode){
    return vnodeToRealElm(vnode) ; // 产生组件的真实节点
  }
  const isRealElement = oldnode.nodeType;
  /**
   *  如果是第一次渲染，则isRealElement == 1 说明为真实的节点，则
   * 直接创建真实的节点，插入页面替换原有的dom
   * 为了保持节点的位置，使用insertBefore,先获取旧节点的父节点的位置
   * insertBefore(新创建的节点，旧节点的.nextSibling)
   * 删除页面中旧有的节点
  */
  if(isRealElement){
    const realNode = vnodeToRealElm(vnode);
    const parentNode = oldnode.parentNode;
    parentNode.insertBefore(realNode,oldnode.nextSibling);
    parentNode.removeChild(oldnode);
  }
}

/**
 * 判断是否为组件
 * 
 * */ 
function createComponent(vnode){
  let init = vnode.data;
  if(init.hook && init.hook.init){
    init.hook.init(vnode);    
  } 
  if(vnode.componentInstance){
    return vnode.componentInstance;
  }
}


/**
 * 根据虚拟节点渲染真实的节点
 * 
 * */ 
function vnodeToRealElm(vnode){
  let {vm, tag,data,key,children,text,Ctor} = vnode;
  if(typeof tag === 'string'){
    /**
     * 每一个节点对应的vnode为 vnode
     * 
     * createComponent(vnode)
    */
    if(createComponent(vnode)){
      return vnode.componentInstance.$el;
    }
    vnode.el = document.createElement(tag);
    // 解析属性
    updateProperties(vnode,vnode.data);
    if(children){
      children.forEach(child => {
        return vnode.el.appendChild(vnodeToRealElm(child))
      });
    }
  } else {
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}

/**
 * 解析属性
{
    "id": "app",
    "class": "myclass",
    "style": {
        "color": " red"
    }
}
转换成
属性放入到标签上

 * */ 

  // 新旧节点如何对比差异？
  function updateProperties(vnode,oldProps = {}){
  // 对标签上的属性进行新旧的对比处理
  let newProps = vnode.data || {};
  /**
   * 真实的dom,在根据虚拟节点创建真实节点的时候，在虚拟节点上挂载了真实的节点
   * */ 
  let el = vnode.el; 
  /**
   * 新的属性，不管旧的 有没有都用新的
   * 
   * */ 
  for(let key in newProps){
    if(key === 'style'){
      let styleValue = newProps.style;
      let attributes = Object.keys(styleValue);
      attributes.forEach((attribute) => {
        el.style[attribute] = newProps.style[attribute] 
      })
    }
  }
 }

/**
 * 修改dom的属性，dom.style.color = 属性值
 * 
 * */  