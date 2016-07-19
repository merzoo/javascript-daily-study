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

function cloneObject(src){
    //your code
    var newSrc = showType(src);
    switch (newSrc){
        case "String":
            console.log(1);
            break;
        case "Function":
            console.log(2);
            break;
    }

}

function showType(str){
    return Object.prototype.toString.call(str).slice(8,-1);
}
