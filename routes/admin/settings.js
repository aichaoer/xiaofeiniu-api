const express=require("express");
const pool=require("../../pool");
var router=express.Router();
module.exports=router;

/**
 * GET /admin/setting 
 * 获取所有的全局设置信息
 * 返回数据：
 *    {appName:"xx",adminUrl:"xxx"……}
 */
router.get('/',(req,res)=>{
    pool.query("SELECT * FROM xfn_settings LIMIT 1",(err,result)=>{
        if(err) throw err;
        res.send(result[0]);
    })
})

/**
 * API:PUT  /admin/settings  
 * 请求(主体)参数（json格式）：{appName:"xx",adminUrl:"xxx"……}  
 * 含义：根据菜品类别编号，修改该菜品类别
 * 返回值形如： 
 *     {code:200,msg:"settings updated success"}
 */
router.put("/",(req,res)=>{
    pool.query("UPDATE xfn_settings SET ?",req.body,(err,result)=>{
        if(err) throw err;
        res.send({code:200,msg:"settings updated success"});
    })
})



