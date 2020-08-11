### 数据从串口到网页
通过串口实时读取的数据，通过网页进行数据的展示。

### websocket 方法
通过 python、node.js 等读取串口的数据，将数据通过 websocket 传输给网页（通过 Javascript 接收），并实时显示。
我由于之前用 matlab 写了串口读取的程序，就直接用 matlab 来做服务器了。有大佬写了 [matlabWebSocket][github] ，你可以从 github 上下载 clone ，如果你觉得太慢的话，我已经把该[项目][gitee]转移到了码云，同样方法进行clone。安装方式详见项目说明。

#### 具体过程
假设你已经得到了从串口读取的数据，经过转换得到了一个`1*1000`的向量，现在将这1000个数字传输到网页进行显示。基本的思想是将数字转换成字符（也可以使用二进制字节进行传输，后一种方法在Javascript上转换比较麻烦，我就不用了）。

#### 1、开启服务器
在matlab中输入一下代码，打开服务器端口8888。
```matlab
% 模拟串口数据
a = rand(1, 1000);
% 数字转成字符，格式是以逗号分隔'0.55555,0.66666,'
b = num2str(a, '%3.5f,');
% 打开8888端口
server = EchoServer(8888);
```

#### 2、开启客户端
我使用echart来呈现数据，依赖jQuery和bootstrap，在网页中html的代码为：

```html
<div class="card mt-2">
    <div id="echart-online">
    </div>
    
    <div class="form-group">
        <label for="exampleInputEmail1">IP</label>
        <input type="text" class="form-control" id="IP" aria-describedby="emailHelp">
    </div>
    <div class="form-group">
        <label for="exampleInputPassword1">port</label>
        <input type="text" class="form-control" id="port" name="password">
    </div>
    <button type="submit" class="btn btn-primary" onclick="setWsConfig()">open</button>
</div>
```

js代码为：
```javascript
data= [];
dataX = [];
T = 10; // second
fs = 1000;
n = T*fs;

for (i=0; i<(n); i++){
    data.push(Math.sin(2*Math.PI*1*i/fs));
    dataX.push(i);
}

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

    };
    myChart.setOption(option);
    
});

function string2array(stringArray){
    // 字符串数组转换成数字数组
    var res =[];
    for (i in stringArray){
        res.push(parseFloat(stringArray[i]));
    };
    return res
}

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
        myChart.setOption({
            xAxis: {
                data: dataX.slice(0, data.length)
            },
            series: [{
                data: data
            }]
        });
    }
}
function onError(evt) {
console.log('Error occured: ' + evt.data);
}

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
```

最终在网页中的显示结果如下图所示，你可以在IP一行添加你电脑的IP，例如`192.168.1.1`；在端口一栏添加`8888`，与你的服务器端的端口一致；最后点击open即可连接，此时你的matlab中应该会显示。
![aXNdJO.png](https://s1.ax1x.com/2020/08/11/aXNdJO.png)

#### 3、传输数据
当连接建立以后，可以通过服务器向客户端传输数据。具体代码为
```matlab
clientCode = server.Connections(1).HashCode;
server.sendTo(clientCode, b(1:end-1));
```
此时页面的数据应该已经产生了变化。
**提示**：如果你懒得写前端的代码，可以直接到[我的博客][blog]中使用，只要正确进行设置`IP`和`port`即可，每次最多传输**10000**个数据点。

### 其他方法
最直接的方法是客户端直接读取串口数据并显示，听说chrome的插件可以实现。

[github]: https://github.com/jebej/MatlabWebSocket
[gitee]: https://gitee.com/Wakes_T/MatlabWebSocket
[blog]: http://wakes_t.gitee.io/blog/jsLearning.html