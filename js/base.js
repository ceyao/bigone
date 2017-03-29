//test JQuery插件
//http://www.cnblogs.com/joey0210/p/3408349.html
//http://blog.csdn.net/adparking/article/details/18967021
//http://www.jb51.net/article/43697.htm
//http://blog.csdn.net/qq_18661257/article/details/50434475


//（一）、1、扩展jQuery对象本身:jQuery.extend() 方法有一个重载。
//jQuery.extend(object) ,一个参数的用于扩展jQuery类本身，也就是用来在jQuery类/命名空间上增加新函数，或者叫静态方法，例如jQuery内置的 ajax方法都是用jQuery.ajax()这样调用的，有点像 “类名.方法名” 静态方法的调用方式。下面我们也来写个jQuery.extend(object)的例子：
jQuery.extend({
    "minValue": function (a, b) {
        ///<summary>
        /// 比较两个值，返回最小值
        ///</summary>
        return a < b ? a : b;
    },
    "maxValue": function (a, b) {
        ///<summary>
        /// 比较两个值，返回最大值
        ///</summary>
        return a > b ? a : b;
    }
});
//调用
var i = 100; j = 101;
var min_v = $.minValue(i, j); // min_v 等于 100
var max_v = $.maxValue(i, j); // max_v 等于 101

/*
* 重载版本：jQuery.extend([deep], target, object1, [objectN])

 用一个或多个其他对象来扩展一个对象，返回被扩展的对象。
 如果不指定target，则给jQuery命名空间本身进行扩展。这有助于插件作者为jQuery增加新方法。
 如果第一个参数设置为true，则jQuery返回一个深层次的副本，递归地复制找到的任何对象。否则的话，副本会与原对象共享结构。
 未定义的属性将不会被复制，然而从对象的原型继承的属性将会被复制。
 参数
 deep:       可选。如果设为true，则递归合并。
 target:     待修改对象。
 object1:   待合并到第一个对象的对象。
 objectN:   可选。待合并到第一个对象的对象。
 示例1：
 合并 settings 和 options，修改并返回 settings。
 var settings = { validate: false, limit: 5, name: "foo" };
 var options = { validate: true, name: "bar" };
 jQuery.extend(settings, options);
 结果：
 settings == { validate: true, limit: 5, name: "bar" }

 示例2：
 合并 defaults 和 options, 不修改 defaults。
 var empty = {};
 var defaults = { validate: false, limit: 5, name: "foo" };
 var options = { validate: true, name: "bar" };
 var settings = jQuery.extend(empty, defaults, options);
 结果：
 settings == { validate: true, limit: 5, name: "bar" }
 empty == { validate: true, limit: 5, name: "bar" }
 这个重载的方法，我们一般用来在编写插件时用自定义插件参数去覆盖插件的默认参数。*/



//(一)、2、jQuery.fn.extend(object)扩展 jQuery 元素集来提供新的方法（通常用来制作插件）。
/*首先我们来看fn 是什么东西呢。查看jQuery代码，就不难发现。

 jQuery.fn = jQuery.prototype = {
 　　　init: function( selector, context ) {.....};
 };

 原来 jQuery.fn = jQuery.prototype，也就是jQuery对象的原型。那jQuery.fn.extend()方法就是扩展jQuery对象的原型方法。我们知道扩展原型上的方法，就相当于为对象添加”成员方法“，类的”成员方法“要类的对象才能调用，所以使用jQuery.fn.extend(object)扩展的方法， jQuery类的实例可以使用这个“成员函数”。jQuery.fn.extend(object)和jQuery.extend(object)方法一定要区分开来。*/
// sample:扩展jquery对象的方法，bold()用于加粗字体。
(function ($) {
    $.fn.extend({
        "bold": function () {
            ///<summary>
            /// 加粗字体
            ///</summary>
            return this.css({ fontWeight: "bold" });
        }
    });
})(jQuery);

////调用方法
$(function(){
    $("p").bold();
});

//二、自执行的匿名函数/闭包
//1、匿名函数创建方法一：
//var double = function(x) { return 2* x; }
//注意“=”右边的函数就是一个匿名函数，创造完毕函数后，又将该函数赋给了变量square。
/*2、匿名函数创建方法二：
* 第二种方式：
 (function(x, y){
 alert(x + y);
 })(2, 3);
 这里创建了一个匿名函数(在第一个括号内)，第二个括号用于调用该匿名函数，并传入参数。括号是表达式，是表达式就有返回值，所以可以在后面加一对括号让它们执行.

 1. 什么是自执行的匿名函数?
 它是指形如这样的函数: (function {// code})();
 另外， 函数转换为表达式的方法并不一定要靠分组操作符()，我们还可以用void操作符，~操作符，!操作符……
 如：
 !function(){
 alert("另类的匿名函数自执行");
 }();
 *******************匿名函数与闭包

 闭包的英文单词是closure，这是JavaScript中非常重要的一部分知识，因为使用闭包可以大大减少我们的代码量，使我们的代码看上去更加清晰等等，总之功能十分强大。
 闭包的含义：闭包说白了就是函数的嵌套，内层的函数可以使用外层函数的所有变量，即使外层函数已经执行完毕（这点涉及JavaScript作用域链）。
 function checkClosure(){
 var str = 'rain-man';
 setTimeout(
 function(){ alert(str); } //这是一个匿名函数
 , 2000);
 }
 checkClosure();


 ******************用闭包来优化代码
 function forTimeout(x, y){
 alert(x + y);
 }
 function delay(x , y  , time){
 setTimeout('forTimeout(' +  x + ',' +  y + ')' , time);
 }
 /**
 * 上面的delay函数十分难以阅读，也不容易编写，但如果使用闭包就可以让代码更加清晰
 * function delay(x , y , time){
 *     setTimeout(
 *         function(){
 *             forTimeout(x , y)
 *         }
 *     , time);
 * }
 */


//$$$$%%%%%%%%%%^^^^^^^^&&&&&&&&&&**********一步一步封装JQuery插件
////闭包限定命名空间
//1.定一个闭包区域，防止插件"污染"
//2.jQuery.fn.extend(object)扩展jquery 方法，制作插件
//3.给插件默认参数，实现 插件的功能
/*链式调用
* 这里只能 直接调用，不能链式调用。我们知道jQuey是可以链式调用的，就是可以在一个jQuery对象上调用多个方法，如：
 $('#id').css({marginTop:'100px'}).addAttr("title","测试“);
 但是我们上面的插件，就不能这样链式调用了。比如：$("p").highLight().css({marginTop:'100px'}); //将会报找不到css方法，原因在与我的自定义插件在完成功能后，没有将 jQuery对象给返回出来。接下来，return jQuery对象，让我们的插件也支持链式调用。（其实很简单，就是执行完我们插件代码的时候将jQuery对像return 出来，和上面的代码没啥区别）*/

(function($){
    $.fn.extend({
        "highlight":function(options){
            //do something
            var opts= $.extend({},defaults,options);//使用jQuery.extend 覆盖插件默认参数
            return this.each(function(){//这里的this 就是 jQuery对象  这里return 为了支持链式调用
                //遍历所有的要高亮的dom,当调用 highLight()插件的是一个集合的时候。
                var $this=$(this);//获取当前dom 的 jQuery对象，这里的this是当前循环的dom
                //根据参数来设置 dom的样式
                $this.css({
                    background:opts.bgcolor,
                    color:opts.forecolor
                });
            });
        }
    });

    //默认参数
    var defaults={
        bgcolor:"red",
        forecolor:"yellow"
    };
})(jQuery)

//插件结束，调用插件
$(function(){
    $("p").highlight();//调用自定义 高亮插件
});

//4.暴露公共方法 给别人来扩展你的插件（如果有需求的话）
//比如的高亮插件有一个format方法来格式话高亮文本，则我们可将它写成公共的，暴露给插件使用者，不同的使用着根据自己的需求来重写该format方法，从而是高亮文本可以呈现不同的格式。
//公共的格式化 方法. 默认是加粗，用户可以通过覆盖该方法达到不同的格式化效果。
$.fn.highLight.format = function (str) {
    return "<strong>" + str + "</strong>";
}
/*5.插件私有方法
有些时候，我们的插件需要一些私有方法，不能被外界访问。例如 我们插件里面需要有个方法 来检测用户调用插件时传入的参数是否符合规范。
6.其他的一些设置，如：为你的插件加入元数据插件的支持将使其变得更强大。*/


//**************************完整的高亮插件代码如下：
//闭包限定命名空间
(function ($) {
    $.fn.extend({
        "highLight": function (options) {
            //检测用户传进来的参数是否合法
            if (!isValid(options))
                return this;
            var opts = $.extend({}, defaluts, options); //使用jQuery.extend 覆盖插件默认参数
            return this.each(function () {  //这里的this 就是 jQuery对象。这里return 为了支持链式调用
                //遍历所有的要高亮的dom,当调用 highLight()插件的是一个集合的时候。
                var $this = $(this); //获取当前dom 的 jQuery对象，这里的this是当前循环的dom
                //根据参数来设置 dom的样式
                $this.css({
                    backgroundColor: opts.background,
                    color: opts.foreground
                });
                //格式化高亮文本
                var markup = $this.html();
                markup = $.fn.highLight.format(markup);
                $this.html(markup);
            });

        }
    });
    //默认参数
    var defaluts = {
        foreground: 'red',
        background: 'yellow'
    };
    //公共的格式化 方法. 默认是加粗，用户可以通过覆盖该方法达到不同的格式化效果。
    $.fn.highLight.format = function (str) {
        return "<strong>" + str + "</strong>";
    }
    //私有方法，检测参数是否合法
    function isValid(options) {
        return !options || (options && typeof options === "object") ? true : false;
    }
})(jQuery)

//调用
//调用者覆盖 插件暴露的共公方法
$.fn.highLight.format = function (txt) {
    return "<em>" + txt + "</em>"
}
$(function () {
    $("p").highLight({ foreground: 'orange', background: '#ccc' }); //调用自定义 高亮插件
});



