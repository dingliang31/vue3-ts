// @ts-ignore
function create(){
  //创建一个空对象
  let obj = new Object();
  //获取构造函数
  let Constructor = [].unshift.call(arguments);
  //链接到原型
  obj.__proto__ = Constructor.prototype;
  //绑定this值
  let result = Constructor.apply(obj,arguments);//使用apply，将构造函数中的this指向新对象，这样新对象就可以访问构造函数中的属性和方法
  //返回新对象
  return typeof result === "object" ? result : obj;//如果返回值是一个对象就返回该对象，否则返回构造函数的一个实例对象
}

var a = create('ll', 'mm', 'll')
console.log(a)
alert()

/**/
function Person (name) {
  this.name = name
}
Person.prototype.SayHello = function () {
  console.log('Hello, im' + this.name)
}
function Employee (name, salary) {
  Person.call(this, name)
  this.salary = salary
}
Employee.prototype = new Person()
Employee.prototype.showMeTheMoney = function () {
  console.log(this.name + '$' + this.salary)
}
var billGates = new Person('Bill Gates')
var steveJobs = new Employee('Steve Jobs', 1234)
billGates.SayHello()
steveJobs.SayHello()
steveJobs.showMeTheMoney()

console.log(steveJobs.SayHello == billGates.SayHello)

/**/

function sum(a, b) {
  return a + b;
}

const handler = {
  apply: function(target, thisArg, argumentsList) {
    console.log(`Calculate sum: ${argumentsList}`, thisArg);
    return target(argumentsList[0], argumentsList[1]) * 2;
  }
};

let proxy = new Proxy(sum, handler);

console.log(sum(1, 2));     // 3
console.log(proxy(1, 2));   // Calculate sum：1,2
                            // 6
// 快速排序

function quickSort (arr, start, end) {
  if (start >= end) return
  const mid = arr[start]
  let low = start
  let high = end
  while (low < high) {
    while (low < high && arr[high] > mid) {
      high -= 1
    }
    while (low < high && arr[low] <= mid) {
      low += 1
    }
    let a = arr[high]
    arr[high] = arr[low]
    arr[low] = a
  }
  if (mid > arr[low]) {
    let b = arr[start]
    arr[start] = arr[low]
    arr[low] = b
    // arr[start] = arr[low] + arr[start]
    // arr[start] = arr[start] - arr[low]
    // arr[low] = arr[start] - arr[low]
  }
  quickSort(arr, 0, low - 1)
  quickSort(arr, low + 1, end)
}
const _list = [1, 2, 4, 7, 8, 10, 12, -2, 0, 24]
quickSort(_list, 0, _list.length - 1)
console.log(_list)
// 甘露语法

function Class() {
    var aDefine = arguments[arguments.length - 1]; // 最后一个参数是类定义
    if (!aDefine) return;
    var aBase = arguments.length > 1 ? arguments[0] : object; // 解析基类
    function prototype_ () {} ; // 构造prototype的临时函数，用于挂接原型链
    prototype_.prototype = aBase.prototype; // 准备传递prototype
    var aPrototype = new prototype_(); // 建立类需要用的prototype
    for (var member in aDefine) { // 复制类定义到当前类的prototype
        if (member != 'Create') { // 构造函数不用复制
            aPrototype[member] = aDefine[member]
        }
    }
    if (aDefine.Create) { // 若有构造函数
        var aType = aDefine.Create // 类型即为构造函数
    } else { // 否则为默认构造函数
        aType = function () {
            this.base.apply(this, arguments)
        }
    }
    aType.prototype = aPrototype; // 设置类(构造函数)的prototype
    aType.Base = aBase
    aType.prototype.Type = aType; // 为本类对象扩展一个Type属性
    return aType
}
// 根类 object 定义：
function object() {}; // 定义小写的object根类，用于实现最基本的方法等
object.prototype.isA = function (aType) { // 判断对象是否属于某类型
    var self = this.Type;
    while(self) {
        if (self == aType) return true;
        self = self.Base;
    };
    return false
}
object.prototype.base = function() { // 调用基类构造函数
    var Caller = object.prototype.base.caller;
    Caller && Caller.Base && Caller.Base.apply(this, arguments)
}
// 语法甘露的应用效果：
var Person = Class({
    Create: function (name, age) {
        this.base();
        this.name = name;
        this.age = age;
    },
    SayHello: function() {
        alert('hello, im ' + this.name + ',' + this.age + ' years old')
    }
});
var Employee = Class(Person, { // 派生自Person类
    Create: function (name, age, salary) {
        this.base(name, age); // 调用基类的构造函数
        this.salary = salary;
    },
    ShowMeTheMoney: function () {
        alert(this.name + ' $' + this.salary);
    }
});

var BillGates = new Person('Bill Gates', 52);
var SteveJobs = new Employee('Steve Jobs', 53, 1234);
BillGates.SayHello();
SteveJobs.SayHello();
SteveJobs.ShowMeTheMoney();

var LittleBill = new BillGates.Type('Little Bill', 6); // 用 BillGate 的类型建LittleBill
LittleBill.SayHello();
alert(BillGates.isA(Person));
alert(BillGates.isA(Employee));
alert(SteveJobs.isA(Person));

/**
 *  给定一个数字，按照如下规则翻译成字符串：0翻译成“a”，1翻译成“b”…25翻译成“z”。一个数字有多种翻译可能，例如12258一共有5种，分别是bccfi，bwfi，bczi，mcfi，mzi。实现一个函数，用来计算一个数字有多少种不同的翻译方法。
 *
 *  自上而下，从最大的问题开始，递归 ：
                      12258
                    /       \
                b+2258       m+258
                /   \         /   \
            bc+258 bw+58  mc+58  mz+8
            /  \      \        \     \
        bcc+58 bcz+8   bwf+8   mcf+8  mzi
          /        \       \     \
    bccf+8        bczi    bwfi   mcfi
      /
  bccfi

  有很多子问题被多次计算，比如258被翻译成几种这个子问题就被计算了两次。

  自下而上，动态规划，从最小的问题开始 ：
  f(r)表示以r为开始（r最小取0）到最右端所组成的数字能够翻译成字符串的种数。对于长度为n的数字，f(n)=0,f(n-1)=1,求f(0)。
  递推公式为 f(r-2) = f(r-1) + g(r-2,r-1) * f(r)。
  其中，如果r-2，r-1能够翻译成字符，则g(r-2,r-1)=1，否则为0。
  因此，对于12258：
  f(5) = 0
  f(4) = 1
  f(3) = f(4) + f(5) = 1
  f(2) = f(3) + f(4) = 2
  f(1) = f(2) + f(3) = 3
  f(0) = f(1) + f(2) = 5

  把数字翻译成字符串(0-25翻译成a-z)
*/
function getTranslationCountNumber(number) {
  if(number < 0) return 0;
  if(number == 1) return 1;
  return getTranslationCountString(String(number));
}
//动态规划，从右到左计算。
//f(r-2) = f(r-1) + g(r-2, r-1) * f(r);
//如果r-2，r-1能够翻译成字符，则g(r-2,r-1)=1，否则为0
function getTranslationCountString(number) {
  let f1 = 0
  let f2 = 1
  let g = 0
  let temp
  for (let i = number.length - 2; i >= 0; i--) {
    if(parseInt(number.charAt(i) + "" + number.charAt(i + 1)) < 26) {
      g = 1
    } else {
      g = 0
    }
    temp = f2
    f2 = f2 + g * f1
    f1 = temp
  }
  return f2
}
console.log(getTranslationCountNumber(2235))
/**
 * async await 执行顺序
 * 0
 * 1 1
 * 2 10
 * 3 20
 */
var a = 0
var b = async () => {
  console.log(a)
  a = a + await 10
  console.log('2', a)
  a = (await 10) + a
  console.log('3', a)
}
b()
a++
console.log('1', a)

/**
 * if 作用域 function 变量提升 问题
 */
var a = 1
if (1) {
  console.log(a)
  console.log('w', window.a)
  a = 3
  console.log(a)
  console.log('w', window.a)
  function a () {}
  console.log(a)
  console.log('w', window.a)
  a = 2
  console.log(a)
  console.log('w', window.a)
  function a () {}
  console.log(a)
  console.log('w', window.a)
}
console.log(a)