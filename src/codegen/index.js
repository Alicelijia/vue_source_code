/**
 * 一下匹配以 hello{{ name }}world 为例
 * */ 
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
function gen(node) {
  if (node.type == 1) {
    // 只要是元素则递归解析
    return generate(node);
  } else {
    // node.type == 2文本节点
    let text = node.text;
    if (defaultTagRE.exec(text)) {
      let lastIndex = defaultTagRE.lastIndex = 0;
      let index = 0;
      let match;
      let tokens = [];
      while(match = defaultTagRE.exec(text)){
        /**
         * 匹配文字 hello{{name}}world ，此时的index为5 
         * 步近值移动到
         * 
         * */ 
        index = match.index; // 将计步器移动到匹配到插值表达式的位置
        // 记步器的位置 > 上一次的索引值，说明匹配到了文本
        if(index > lastIndex){
          tokens.push(JSON.stringify(text.slice(lastIndex,index)));
        }
        tokens.push(`_s(${match[1].trim()})`);
        // index 就是 hello匹配完之前的索引值为5, match[0],就是"{{name}}"
        lastIndex = index + match[0].length;
      }
      // 说明匹配完插值表达式后面还有文本
      if(lastIndex < text.length){
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }
      /**
       * 将 tokens = ['"hello"', '_s(name)', '"world"']
       * 转换成'"hello"+_s(name)+"world"'
       * */ 
      return `_v(${tokens.join('+')})`
    } else {
      // 如果插值表达式的正则匹配不到，则说明是纯文本
      return `_v(${JSON.stringify(text)})`
    }
  }
}
// 生成儿子节点
function getChildren(el) {
  // console.log("child", child);
  const children = el.children;
  if (children) {
    return `${children.map((c) => gen(c)).join(",")}`;
  } else {
    return false;
  }
}

// 生成属性
function genProps(attrs) {
  // 生成属性
  // console.log("attrs",attrs);
  let str = "";
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    if (attr.name === "style") {
      let obj = {};
      attr.value.split(";").forEach((item) => {
        let [key, value] = item.split(":");
        obj[key] = value;
      });
      attr.value = obj;
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`;
  }
  // console.log("str",str)
  return `{${str.slice(0, -1)}}`;
}

export function generate(el) {
  // console.log("el", el);
  let children = getChildren(el);
  let code = `_c('${el.tag}',${
    el.attrs.length ? `${genProps(el.attrs)}` : "undefined"
    }${children ? `,${children}` : ""})`;
  // console.log("code", code);
  return code;
}




/**
 * genProps 做了什么？将对象属性转换成
[
    {
        "name": "id",
        "value": "app"
    },
    {
        "name": "class",
        "value": "myclass"
    },
    {
        "name": "style",
        "value": "color: red;"
    }
]

id:"app",class:"myclass",style:{"color":" red"},
 * 
 * 
 * */ 



/**
 * 为什么匹配的时候需要维护一个lastIndex？
 * 因为 exec匹配捕获的时候会有bug
 * 如：let  reg = /b/g;
 * reg.exec('abc');
 * ['b', index: 1, input: 'abc', groups: undefined]
 * 其中会返回匹配到的index的值
 * ps: 在书中120p有写
 * */ 