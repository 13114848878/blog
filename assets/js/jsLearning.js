// alert("woo")

function myFunction()
{
    // \ 用于代码换行等价于matlab的...
    // document.getElementById("demo").innerHTML="我的第一个 \
    // JavaScript 函数";
    document.getElementById("demo").innerHTML = Date();
    document.getElementById("demo").style.color="red";
    this.innerHTML = "time";
}

a = 5;
b = 6;
console.log(a*b)

a = 16;
b = "john";
// 数字转换成字符串
console.log(a+b)
console.log(b+a)

// array
num = [1,2,3,4];
console.log(num)
num[2] = "string";
console.log(num)

// object
student = {
    "name1":10,
    "name2": "test",
};
console.log(student)
console.log(student.name1)
console.log(student["name2"])

// function
function myAdd(a,b){
    return a + b
}
console.log(myAdd(1,2))

// global variable
name = "name";
// "name"
console.log(name)
function changeName(){
    // local variable
    var name1 = "name1";
    name = "name1";
}
changeName()
// "name1"
console.log(name)
// error，报错之后下面不执行
// console.log(name1)
window.name = "name2";
// window.name
console.log(name)

// string
s1 = "string one";
s2 = new String('string two');
console.log(typeof(s1))
console.log(typeof(s2))

// operator
x = 1;
y = x--;
z = --x;
console.log(y,z)
age = 20;
voteable=(age<18)?"年龄太小":"年龄已达到";
console.log(voteable)

// 
if (age<18){
    voteable = "no ok";
}
else{
    voteable = "ok";
}
console.log(voteable)

// for loop
for (i=0; i<10; i++){
    if (i>5){
        console.log(i)
    }
}

for (n in student){
    console.log(n)
}

for (i=0; num[i]; i++){
    console.log(num[i])
}