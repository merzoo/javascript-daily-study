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
    var obj = {};
    var result = [];
    for(var i = 0, len = arr.length; i < len; i++){
        var key = arr[i];
        if(!obj[key]){
            result.push(key);
            obj[key] = true;
        }
    }
    return result;
}

/**
 * 测试用例
 * */
var  arr1 = [1,4,4,4,6];

console.log(uniArray(arr1));


// 实现一个简单的trim函数，用于去除一个字符串，头部和尾部的空白字符
// 假定空白字符只有半角空格、Tab
// 练习通过循环，以及字符串的一些基本方法，分别扫描字符串str头部和尾部是否有连续的空白字符，并且删掉他们，最后返回一个完成去除的字符串
function simpleTrim(str) {
    // your code


}

// 很多同学肯定对于上面的代码看不下去，接下来，我们真正实现一个trim
// 对字符串头尾进行空格字符的去除、包括全角半角空格、Tab等，返回一个字符串
// 尝试使用一行简洁的正则表达式完成该题目
function trim(str) {
    // your implement
}

// 使用示例
var str = '   hi!  ';
str = trim(str);
console.log(str); // 'hi!'



// 实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
function each(arr, fn) {
    // your implement
    var len = arr.length, i;
    for(i = 0, i < len; i++){
        fn(arr[i], i);
    }

}

// 其中fn函数可以接受两个参数：item和index

// 使用示例
var arr = ['java', 'c', 'php', 'html'];
function output(item) {
    console.log(item)
}
each(arr, output);  // java, c, php, html



//----------------------------------------------------------------------
//Ajax
//----------------------------------------------------------------------


/**
 @param {string} url 发送请求的url
 * @param {Object} options 发送请求的选项参数
 * @config {string} [options.type] 请求发送的类型。默认为GET。
 * @config {Object} [options.data] 需要发送的数据。
 * @config {Function} [options.onsuccess] 请求成功时触发，function(XMLHttpRequest xhr, string responseText)。
 * @config {Function} [options.onfail] 请求失败时触发，function(XMLHttpRequest xhr)。
 *
 * @return {XMLHttpRequest} 发送请求的XMLHttprequest对象
 */
