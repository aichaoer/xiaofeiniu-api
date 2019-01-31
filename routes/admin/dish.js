/**
 * 菜品相关路由
 */

const express=require("express");
const pool=require("../../pool");
var router=express.Router();
module.exports=router;

/**
 * API: GET /admin/dish
 * 获取所有的菜品（按类别进行分类）
 * 返回结果：
 * [
 *   {cid:1,cname:"肉类",dishList:[{},{},{}]}
 *   {cid:2,cname:"丸滑类",dishList:[{},{},{}]}
 *   {cid:3,cname:"海鲜类",dishList:[{},{},{}]}
 *                     …………
 * ]
 */
router.get("/",(req,res)=>{
    //查询所有的菜品类别
    pool.query("SELECT cid,cname FROM xfn_category ORDER BY cid",(err,result)=>{
        if(err) throw err;
        var categoryList=result;//菜品类别数组
        // res.send(categoryList);
        var finishCount=0;   //已经查询完菜品类别的数量
        for(let c of categoryList){
            //循环查询每个类别下有哪些菜品
            pool.query("SELECT * FROM xfn_dish WHERE categoryId=? ORDER BY did DESC",c.cid,(err,result)=>{
                if(err) throw err;
                c.dishList=result;
                finishCount++;
                //保证所有类别下的菜品全部查询完成，才能发送响应消息  ————这些查询都是异步执行的
                if(finishCount==categoryList.length){
                    res.send(categoryList)
                }
            })
        }
    })
})


/**
 * POST /admin/dish/image
 * 请求参数：
 * 接收客户端上传的图片，保存在服务器上，返回该图片在服务器上的随机文件名
 * 响应数据：
 *      {code:200,msg:"upload success",flieName:"13512873612-2342.jpg"}
 */
//引入multer中间件
const multer=require("multer");
const fs=require("fs");
var upload = multer({ dest: 'tmp/' })  //指定客户端上传的文件临时存储路径
//定义路由，使用文件上传中间件
router.post("/image",upload.single("dishImg"),(req,res)=>{
    //console.log(req.file);   //客户端上传的文件
    //console.log(req.body);   //客户端随同图片提交的字符数据
    //把客户端上传的文件从临时目录转移到永久的图片路径下
    var tmpFile=req.file.path;  //临时文件路径
    var suffix=req.file.originalname.substring(req.file.originalname.lastIndexOf("."));  //原始文件名的后缀部分
    var newFile=randomFileName(suffix);   //目标文件名
    fs.rename(tmpFile,"img/dish/"+newFile,()=>{
        res.send({code:200,msg:"upload success",flieName:newFile})     //把临时文件转移
    })
})
//生成一个随机文件名
//  min-max之间的随机数：Math.random()*(max-min)+min
//参数suffix表示要生成的文件名中的后缀
function randomFileName(suffix){
    var time=new Date().getTime();   //当前系统随机戳
    var num=Math.floor(Math.random()*(10000-1000)+1000);  //4位的随机数字
    return time+"-"+num+suffix;
}

/**
 * POST /admin/dish
 * 添加一个新的菜品
 * 请求参数：{title:"xx",imgUrl:"",price:cc,detail:"xx",categoryId:xx}
 * 输出消息
 *    {code:200,msg:"dish added success",dishId:46}
 */
router.post("/",(req,res)=>{
    var data=req.body;  
    pool.query("INSERT INTO xfn_dish SET ?",data,(err,result)=>{
        if(err) throw err;
        res.send({code:200,msg:"dish added success",dishId:result.insertId});  //将insert产生的自增编号输出给客户端
    })
})

/**
 * DELETE /admin/dish/:did
 * 根据指定的菜品编号删除该菜品
 * 输出数据：
 *    {code:200,msg:"dish deleted success"}
 *    {code:400,msg:"dish not exists"}
 */
router.delete('/:did',(req,res)=>{
    pool.query("DELETE FROM xfn_dish WHERE did=?",req.params.did,(err,result)=>{
        if(err) throw err;
        if(result.affectedRows>0){
            res.send({code:200,msg:"dish deleted success"});
        }else{
            res.send({code:400,msg:"dish not exists"});
        }
    })
})

/**
 * PUT /admin/dish
 * 请求参数：{did:xx,title:"xx",imgUrl:"",price:cc,detail:"xx",categoryId:xx}
 * 根据指定的菜品编号修改该菜品
 * 输出数据：
 *    {code:200,msg:"dish updated success"}
 *    {code:400,msg:"dish not exists"}
 */

router.put("/",(req,res)=>{
    var data=req.body;  
    pool.query("UPDATE xfn_dish SET ? WHERE did=?",[data,data.did],(err,result)=>{
        if(err) throw err;
        // console.log(result);
        if(result.changedRows>0){
            //实际更新了一行
            res.send({code:200,msg:"1 dish modified"});
        }else if(result.affectedRows==0){
            res.send({code:400,msg:"0 dish modified,not exists"});
        }else if(result.affectedRows==1 && result.changedRows==0){
            //影响到1行，但修改了0行————新值与旧值完全一样
            res.send({code:401,msg:"0 dish modified,no modification"})
        }
    })
})

