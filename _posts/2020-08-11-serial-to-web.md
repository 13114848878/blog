### 数据从串口到网页
通过串口实时读取的数据，通过网页进行数据的展示。

### websocket 方法
通过 python、node.js 等读取串口的数据，将数据通过 websocket 传输给网页（通过 Javascript 接收），并实时显示。
我由于之前用 matlab 写了串口读取的程序，就直接用 matlab 来做服务器了。有大佬写了 [matlabWebSocket][github] ，你可以从 github 上下载 clone ，如果你觉得太慢的话，我已经把该[项目][gitee]转移到了码云，同样方法进行clone。安装方式详见项目说明。

#### 具体过程
假设你已经得到了从串口读取的数据，经过转换得到了一个`1*1000`的向量，现在将这1000个数字传输到网页进行显示。基本的思想是将数字转换成字符（也可以使用二进制字节进行传输，后一种方法在Javascript上转换比较麻烦，我就不用了）。

#### 1、开启服务器
在matlab中输入一下代码，打开服务器端口8888，当客户端建立连接之后开始发送数据。
```matlab
clear; clc;
% 模拟串口数据
t = 0:0.001:10;
a = sin(2*pi*2*t);
% a = rand(1, 100000);

% 打开8888端口
server = EchoServer(8888);

while isempty(server.Connections)
    pause(0.1);
end
clientCode = server.Connections(1).HashCode;
% 模拟发送数据
step = 100;
for s = 1:step:length(a)-step
    % 数字转成字符，格式是以逗号分隔'0.55555,0.66666,'
    b = num2str(a(s:s+step-1), '%3.5f,');
    server.sendTo(clientCode, b(1:end-1));
    pause(0.1);
end

server.stop();
server.closeAll();
```

#### 2、开启客户端
我使用echart来呈现数据，依赖jQuery和bootstrap，在网页中html的代码为：

```html
<div class="card mt-2">
    <div id="echart-online">
        {% comment %} 此处显示数据 {% endcomment %}
    </div>
    <div class="card-body">
        <div class="form-group">
            <label for="exampleInputEmail1">IP</label>
            <input type="text" class="form-control" id="IP" aria-describedby="emailHelp">
        </div>
        <div class="form-group">
            <label for="exampleInputPassword1">port</label>
            <input type="text" class="form-control" id="port" name="password">
        </div>
        <div class="text-between">
            <button class="btn btn-primary" onclick="setWsConfig()">open</button>
            <button class="btn btn-primary" id="down">Download</button>
        </div>
    </div>
</div>
```

js代码为：
```javascript
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
            data: dataX
        },
        yAxis: {
        },
        series: [
            {
                // name: "实时读取websocket的",
                type:'line',
                data: data
            },
        ],

        title: {
            text: "实时读取websocket的数据"
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
        s = evt.data.split(",");
        // console.log(s.length);
        data = string2array(s);
        rawData = rawData.concat(data);
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

```

最终在网页中的显示结果如下图所示，你可以在IP一行添加你电脑的IP，例如`192.168.1.1`；在端口一栏添加`8888`，与你的服务器端的端口一致；最后点击open即可连接，此时你的matlab中应该会显示。

![axGoh8.png](https://s1.ax1x.com/2020/08/12/axGoh8.png)

**提示**：如果你懒得写前端的代码，可以直接到[我的博客][blog]中使用，只要正确进行设置`IP`和`port`即可，每次最多传输最好不超过**2000**个数据点，否则数据可视化效果不好。
#### 3、数据下载
点击`Download`下载传输的数据。
### 其他方法
最直接的方法是客户端直接读取串口数据并显示，听说chrome的插件可以实现。

[github]: https://github.com/jebej/MatlabWebSocket
[gitee]: https://gitee.com/Wakes_T/MatlabWebSocket
[blog]: http://wakes_t.gitee.io/blog/jsLearning.html