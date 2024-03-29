export function isFunction(val) {
  return typeof val === "function";
}
export function isObject(val) {
  return typeof val === "object" && typeof val !== null;
}
 const LIFECYCLE_HOOKS = [
  "beforeCreate",
  "created",
  "beforeMount",
  "mounted",
  "beforeUpdate",
  "update",
  "beforeDestory",
  "destoryed",
];
// 针对不同的策略不同的方法
const strats = {};
export function mergeHook(parentVal, childVal) {
  // 有新的
  if (childVal) {
    if (parentVal) {
      // 新旧都有
      return parentVal.concat(childVal);
    } else {
      // 第一次parentVal默认是空对象，第一次已经将childVal变为数组
      return [childVal];
    }
  } else {
    // 没有新的用老的
    return parentVal;
  }
}

LIFECYCLE_HOOKS.forEach((hook) => {
  strats[hook] = mergeHook;
});


// components的合并策略，就是让子继承父的
strats.components = function(parent, child){
  // 先根据父亲的原型创建一个对象
  let fatherPrototype = Object.create(parent);
  if(child){
    for(let key in child){
      // 让新的对象上，copy儿子的属性
      fatherPrototype[key] = child[key];
    }
  }
  return fatherPrototype;
}

export function mergeOptions(parent, child) {
  // 1. 初始化父为空
  const options = {};
  // 父有儿没有
  for (let key in parent) {
    mergeField(key);
  }
  //儿有父没有
  for (let key in child) {
    if (!parent.hasOwnProperty(key)) {
      mergeField(key);
    }
  }
  // 父子都有
  function mergeField(key) {
    // 默认的合并策略 但是有些属性 需要有特殊的合并方式 如生命周期的合并
    let parentVal = parent[key];
    let childVal = child[key]
    // 策略模式，如果用if else 判断太对了
    if (strats[key]) { // 如果有对应的策略采用对应的策略
    //  strats[key](parentVal,childVal) 实际上调用的是mergeHook()
      return (options[key] = strats[key](parentVal,childVal));
    }
    if (typeof parentVal == "object" && typeof childVal == "object") {
      options[key] = {
        ...parentVal,
        ...childVal,
      };
    } else if (childVal == null) {
      // 儿子没有则以父为准
      options[key] = parentVal;
    } else if (parent[key] == null) {
      // 父没有以子为准
      // 父亲中有，儿子中没有
      options[key] = child[key] || parent[key];
    }
  }
  return options;
}

export const isReservedTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
    'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
    's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
    'embed,object,param,source,canvas,script,noscript,del,ins,' +
    'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
    'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
    'output,progress,select,textarea,' +
    'details,dialog,menu,menuitem,summary,' +
    'content,element,shadow,template,blockquote,iframe,tfoot'
)
function makeMap(str){
  let map ={};
  str.split(',').forEach((tag) => {
    map[tag] = true;
  })
  return (match) => map[match] || false;
}