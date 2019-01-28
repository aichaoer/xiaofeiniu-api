/**
 * 管理员相关路由
 */
const express=require("express");
const pool=require("../../pool");
var router=express.Router();
module.exports=router;

/** GET请求可以有主体吗?
 * API:GET /admin/login
 * 完成用户登录验证(提示：有的项目情景下会选择POST)
 * 请求数据：{aname:admin,apwd:"xxx"}
 * 返回数据：
 *    {code:200,msg:"login success"}
 *    {code:400,msg:"aname or apwd err"}
 */

router.get('/login/:aname/:apwd',(req,res)=>{
    var aname=req.params.aname;
    var apwd=req.params.apwd;
    pool.query("SELECT aid FROM xfn_admin WHERE aname=? AND apwd=PASSWORD(?)",[aname,apwd],(err,result)=>{
        if(err) throw err;
        if(result.length>0){
            //查询到一行数据，登录成功
            res.send({code:200,msg:"login success"});
        }else{
            //没有查到数据
            res.send({code:400,msg:"aname or apwd err"});
        }
    })
})
/** 
 * API:PATCH(改部分用patch，打补丁)  /admin
 * 根据用户名修改管理员密码
 * 请求数据：{aname:admin,oldPwd:"xxx",newPwd:"xxx"}
 * 返回数据：
 *    {code:200,msg:"modified success"}
 *    {code:400,msg:"aname or apwd err"}
 *    {code:401,msg:"apwd not modified"}
 */
router.patch("/",(req,res)=>{
    var data=req.body;
    // console.log(data);
    //首先根据aname/oldPwd查询该用户是否存在
    pool.query("SELECT aid FROM xfn_admin WHERE aname=? AND apwd=PASSWORD(?)",[data.aname,data.oldPwd],(err,result)=>{
        if(err) throw err;
        if(result.length==0){
            res.send({code:400,msg:"aname or apwd err"});
            return;
        }
        //如果查询到了用户，再修改其密码
        pool.query("UPDATE xfn_admin SET apwd=PASSWORD(?) WHERE aname=?",[data.newPwd,data.aname],(err,result)=>{
            if(err) throw err;
            if(result.changedRows>0){
                //密码修改成功
                res.send({code:200,msg:"modified success"});
            }else{
                //新旧密码一样，未做修改
                res.send({code:401,msg:"apwd not modified"});
            }
        })
    })
})

