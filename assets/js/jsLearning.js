// alert("woo")

// function myFunction()
// {
//     // \ 用于代码换行等价于matlab的...
//     // document.getElementById("demo").innerHTML="我的第一个 \
//     // JavaScript 函数";
//     document.getElementById("demo").innerHTML = Date();
//     document.getElementById("demo").style.color="red";
//     this.innerHTML = "time";
// }

// a = 5;
// b = 6;
// console.log(a*b)

// a = 16;
// b = "john";
// 数字转换成字符串
// console.log(a+b)
// console.log(b+a)

// array
// num = [1,2,3,4];
// console.log(num)
// num[2] = "string";
// console.log(num)

// object
// student = {
//     "name1":10,
//     "name2": "test",
// };
// console.log(student)
// console.log(student.name1)
// console.log(student["name2"])

// function
// function myAdd(a,b){
//     return a + b
// }
// console.log(myAdd(1,2))

// global variable
// name = "name";
// // "name"
// console.log(name)
// function changeName(){
//     // local variable
//     var name1 = "name1";
//     name = "name1";
// }
// changeName()
// // "name1"
// console.log(name)
// // error，报错之后下面不执行
// // console.log(name1)
// window.name = "name2";
// // window.name
// console.log(name)

// string
// s1 = "string one";
// s2 = new String('string two');
// console.log(typeof(s1))
// console.log(typeof(s2))

// operator
// x = 1;
// y = x--;
// z = --x;
// console.log(y,z)
// age = 20;
// voteable=(age<18)?"年龄太小":"年龄已达到";
// console.log(voteable)

// // 
// if (age<18){
//     voteable = "no ok";
// }
// else{
//     voteable = "ok";
// }
// console.log(voteable)

// for loop
// for (i=0; i<10; i++){
//     if (i>5){
//         console.log(i)
//     }
// }

// 返回对象的key，array也是对象
// for (n in student){
//     console.log(n)
// }

// for (i=0; num[i]; i++){
//     console.log(num[i])
// }

// 表单验证
// function validateForm(){
//     var x = document.forms['myForm']["password"].value;
//     alert(x)
// }

// 异步
// setTimeout(function () {
//     console.log("1");
// }, 1000);
// console.log("2");

//  promises
// new Promise(function (resolve, reject) {
//     setTimeout(function () {
//         console.log("First");
//         resolve();
//     }, 1000);
// }).then(function () {
//     return new Promise(function (resolve, reject) {
//         setTimeout(function () {
//             console.log("Second");
//             resolve();
//         }, 4000);
//     });
// }).then(function () {
//     setTimeout(function () {
//         console.log("Third");
//     }, 3000);
// });


// jQuery

// $(document).ready(function(){
//     $("#demo").hover(function(){
//         $(this).text("oOps");
//     });
    
//     $("#demo").click(function(){
//         $(this).hide(1000);
//     });
// });

// 需要等网页载入完成后才能引用，上面的代码有延时输出
// document.getElementById('echart').style.height = "600px";
// d.style.height = "600px";

$(document).ready(function(){
    // start with 'echart'
    $("[id^=echart]").css({"height":"400px"});
});
// style="width: 600px;height:400px;"

// echart
// $(document).ready(function(){
//     // 基于准备好的dom，初始化echarts实例
//     var myChart = echarts.init(document.getElementById('echart'));
    
//     // 指定图表的配置项和数据
//     var option = {
//         title: {
//             text: '第一个 ECharts 实例'
//         },
//         tooltip: {},
//         legend: {
//             data:['销量']
//         },
//         xAxis: {
//             data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
//         },
//         yAxis: {},
//         series: [{
//             name: '销量',
//             type: 'bar',
//             data: [5, 20, 36, 10, 10, 20]
//         }]
//     };

//     // 使用刚指定的配置项和数据显示图表。
//     myChart.setOption(option);

// });


// 数据动态更新
data= [];
rawData = []; // 用于存储全部数据
dataX = [];
T = 2; // second
fs = 1000;
n = T*fs;

for (i=0; i<(n); i++){
    data.push(Math.sin(2*Math.PI*1*i/fs));
    dataX.push(i);
}

// console.log(data)
function shiftArray(data, n){
    // 把最后面的n个数转移到前面
    for (i=0; i<n; i++){
        data.unshift(data.pop());
    }
    return data
}
// data = shiftArray(data, 2);
// console.log(data)

$(document).ready(function(){
    // 基于准备好的dom，初始化echarts实例
    myChart = echarts.init(document.getElementById('echart-online'), "dark");
    option = {
        xAxis: {
            data: dataX,
            name: "Point",
            nameLocation: "center",
            nameTextStyle: {
                // [上, 右, 下, 左]
            padding: [20, 0, 0, 0]
            }
            
        },
        yAxis: {
            name: "Amplitude(\μV)",
            nameLocation: "center",

            nameTextStyle: {
                // [上, 右, 下, 左]
            padding: [0, 0, 30, 0]
            }
        },
        series: [
            {
                // name: "实时读取websocket的",
                type:'line',
                data: data
            },
        ],

        title: {
            text: "实时展示数据"
        },

        legend: {
            // data: ["legend"]
        }
    };

    // setInterval(function () {
    //     data = shiftArray(data, 100);
    //     myChart.setOption({
    //         series: [{
    //             data: data
    //         }]
    //     });
    // }, 100);

    myChart.setOption(option);
    
});

function string2array(stringArray){
    var res =[];
    // console.log(s[0]);
    for (i in stringArray){
        // console.log(stringArray[i]);
        res.push(parseFloat(stringArray[i]));
    };
    return res
}

// var  wsServer = 'ws://localhost:8888';
// var  websocket = new WebSocket(wsServer);
// websocket.onopen = function (evt) { onOpen(evt) };
// websocket.onclose = function (evt) { onClose(evt) };
// websocket.onmessage = function (evt) { onMessage(evt) };
// websocket.onerror = function (evt) { onError(evt) };

function onOpen(evt) {
console.log("Connected to WebSocket server.");
}
function onClose(evt) {
console.log("Disconnected");
}
function onMessage(evt) {
    if (typeof(evt.data) === "string"){
        // console.log('Retrieved data from server: ' + evt.data);
        // using json format
        backendData = JSON.parse(evt.data)
        // // string array
        // s = evt.data.split(",");
        // // console.log(s.length);
        // data = string2array(s);
        // 脑电数据
        rawData = rawData.concat(backendData.data);
        // 判断眼睛的状态
        if (backendData.eyeState == 1){
            closed();
        };
        if (backendData.eyeState == 2){
            open();
        };
        if (backendData.eyeState == 3){
            blink();
        };

        // 展示最新的2000个数据点
        if ( rawData.length > n ){
            data = rawData.slice(rawData.length-n-1, rawData.length);
        }else{
            data = rawData;
        }

        // 更新数据
        myChart.setOption({
            xAxis: {
                data: dataX.slice(0, data.length)
            },
            series: [{
                data: data
            }]
        });
        
        // console.log(data[0]);
        // console.log(data[999]);
    }
    // console.log(evt.data)
    // if(event.data instanceof ArrayBuffer){
    //     var buffer = event.data;
    //     console.log("Received arraybuffer");
    //     console.log(buffer)
    //   }

}
function onError(evt) {
console.log('Error occured: ' + evt.data);
}

// 开始websocket连接
function setWsConfig(){
    $(document).ready(function(){
        IP = $("#IP").val();
        port = $("#port").val();
        var  wsServer = 'ws://'+IP+':'+port;
        var  websocket = new WebSocket(wsServer);
        websocket.onopen = function (evt) { onOpen(evt) };
        websocket.onclose = function (evt) { onClose(evt) };
        websocket.onmessage = function (evt) { onMessage(evt) };
        websocket.onerror = function (evt) { onError(evt) };
        // console.log(IP);
        // console.log(port);
    });
}


// 数据下载
function download(filename, content) {
    var blob = new Blob([content], {type: 'text/plain'});
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');

    a.style = "display: none";
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 5);
}

$(document).ready(function(){
    $("#down").click(function () {
        var filename = "rawData.txt";
        var content = rawData;
        download(filename, content);
    });
});


// 控制眨眼
function closed(){
    $(document).ready(function(){
        
        // fast: 200ms; slow: 600ms; defualt: 400ms;
        $('[id^=eye]').animate({height:"2px"}, 'fast');
        // $('[id^=eye]').animate({height:"2px"}, 'slow');
        // $('#eye').animate({}, function(){
        //     $('[id^=eye]').css({height:"2px"});
        //     $("#eye-out").css({'transform':'rotate(0deg)','margin-left':"0px"});
        // });
    });
}

function open(){
    $(document).ready(function(){
        // $('#eyelid-top').animate({top:"-20%"}, 'slow')
        setTimeout(function(){
            $('#eye').animate({height:"50px"}, 'fast');
        }, 1)
        setTimeout(function(){
            $('#eye-ball').animate({height:"30px"}, 'fast');
        }, 2)

        // $('[id^=eye]').animate({height:"10000%"}, 'fast');
        // $('#eye').animate({}, function(){
        //     $("#eye-out").css({'transform':'rotate(45deg)', 'margin-left':"20px"});
        //     $('#eye').css({height:"50px"});
        //     $('#eye-ball').css({height:"30px"});
        // });
    });
}


function blink(){
    closed();
    // setTimeout(function(){
    //     var a=1;
    // }, 1000);
    open();
}

$(document).ready(function(){
    $('#eye').click(blink);
});

// $(document).ready(function(){
//     $('#eye').click(open)
// });
// setInterval(blink, 1000);