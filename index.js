/**
 * 小肥牛扫码点餐项目API子系统
 */

console.log("准备启动API服务器");
console.log(new Date().toLocaleString());

const PORT=8090;
const express=require("express");  //modules中的不加./；./本地
const cors=require("cors");
const bodyParser=require("body-parser");
const categoryRouter=require("./routes/admin/category");
const adminRouter=require("./routes/admin/admin");
const dishRouter=require("./routes/admin/dish");

//创建HTTP应用服务器，启动主服务器
var app=express();
app.listen(PORT,()=>{
    console.log("API服务器启动成功……");
    console.log("Server Listening "+PORT+"...");
})

//使用中间件
app.use(cors());
// app.use(bodyParser.urlencoded({})); //把application/x-www-form-urlencoded格式的请求注意数据解析出来放入req.body中
app.use(bodyParser.json()); //把json格式的请求注意数据解析出来放入req.body中

//挂载路由器
app.use('/admin/category',categoryRouter);
app.use('/admin',adminRouter);
app.use('/admin/dish',dishRouter);

