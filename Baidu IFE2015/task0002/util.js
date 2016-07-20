//判断arr是不是一个数组，返回一个布尔值
function isArray(arr){
    //your code
    return Object.prototype.toString.call(arr) === "[object Array]";
}

//判断一个fn是否为函数，返回一个bool值
function isFunction(fn){
    //your code
    return Object.prototype.toString.call(fn) === "[object Function]";
}

//判断一个obj是否为对象，返回一个bool值
function isPlain(obj){
    return Object.prototype.toString.call(obj) === "[object Object]";
}

function cloneObject(src){
   var result = src, i, len;
    if(!src
        || src instanceof Number
        || src instanceof Boolean
        || src instanceof String ){
        result = src;
    }else if(isArray(src)){
        result = [];
        for(i = 0, len = src.length; i < len; i++){
            result[i] = cloneObject(src[i]);
        }
    }else if(isPlain(src)){
        result = {};
        for(var item in src){
            if(src.hasOwnProperty(item)){
                result[item] = cloneObject(src[item]);
            }
        }
    }
    return result;
}
/**
 * 测试用例：
 * */
var srcObj = {
    a: 1,
    b: {
        b1: ["hello", "hi"],
        b2: "JavaScript"
    }
};
var abObj = srcObj;
var tarObj = cloneObject(srcObj);
console.log(tarObj);
srcObj.a = 2;
srcObj.b.b1[0] = "Hi";

console.log(abObj.a);
console.log(abObj.b.b1[0]);

console.log(tarObj.a);      // 1
console.log(tarObj.b.b1[0]);    // "hello"


//数组去重
function uniArray(arr){
    //your code
    var newArr = [];
    for(var i = 0, len = arr.length; i < len; i++){
        if(arr[i] == )
    }
}
