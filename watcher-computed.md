# Watch & Computed

## 一、Watch实现原理

```javascript
watcher的常用3种使用方法
let vm = new Vue({
    el:"#app",
    data(){
        return {name :"jiajia",age:18}
    },
    watch:{
        age:[
           function (newVal,oldVal)  {
               
		  },
           function (newVal,oldVal)  {
               
		  },
        ],
        age:"a"
        name(newVal,oldVal){
            console.log(newVal)
        }
	},
     methods:{
         a(){
             console.log("watch也可以调用methods里面的方法")
		}
     }
})
```

### 1 在state.js中，可以初始化initWatch

```js
if(opts.watch){
    initWatch(vm,opts.watch);//获取用户传入的watch对象
}
```

### 2  选项中如果有watch则对watch进行初始化

```js
function initWatch(vm, watches){
    // 用户传入的watchers可能有3种情况
    for(let key in watches){
        let handler = watches[key];
        if(Array.isArray(handler)){
            
        }else {
            
        }
    }
}
```

