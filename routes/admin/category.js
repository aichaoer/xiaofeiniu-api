/**
 * 菜品类别路由器
 * RESTful风格的API 
 */

const express=require("express");
const pool=require("../../pool");
var router=express.Router();
module.exports=router;

/**
 * API:GET /admin/category
 * 含义：客户端获取所有的菜品类别，按菜品类别编号升序排列
 * 返回值形如： 
 *     [{cid:1,cname:"..."},{……}]
 */
router.get('/',(req,res)=>{
    pool.query("SELECT * FROM xfn_category ORDER BY cid",(err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})

/**
 * API:DELETE /admin/category/:cid     
 * 含义：根据表示菜品编号的路由参数，删除该菜品
 * 返回值形如： 
 *     {cid:200,msg:"1 category deleted"}
 *     {cid:400,msg:"0 category deleted"}
 */
router.delete('/:cid',(req,res)=>{
    //注意删除菜品类别之前必须先把属于该类别的菜品的类别编号设置为null
    pool.query("UPDATE xfn_dish SET categoryId=NULL WHERE categoryId=?",req.params.cid,(err,result)=>{
        if(err) throw err;
        //至此指定类别的菜品已修改完毕
        pool.query("DELETE FROM xfn_category WHERE cid=?",req.params.cid,(err,result)=>{
            if(err) throw err;
            //获取DELETE语句在数据库中影响的行数
            if(result.affectedRows>0){
                res.send({cid:200,msg:"1 category deleted"});
            }else{
                res.send({cid:400,msg:"0 category deleted"});
            }
        })
    })
})

/**
 * API:POST /admin/category     幂等：一个操作无论执行多少次，结果都是一样的
 * 请求(主体)参数：（k=v&k=v 不推荐）{cname:"..."}  json格式
 * 含义：添加新的菜品类别
 * 返回值形如： 
 *     {cid:200,msg:"1 category added",cid:""}
 */
// router.post("")
router.post("/",(req,res)=>{
    // console.log("获取到请求数据:");
    // console.log(req.body);
    var data=req.body;  //形如{cname:"xxx"}
    pool.query("INSERT INTO xfn_category SET ?",data,(err,result)=>{
        //注意此处sql语句的缩写
        if(err) throw err;
        res.send({cid:200,msg:"1 category added"});
    })
})


/**
 * API:PUT/PATCH  /admin/category   
 * 请求(主体)参数（json格式）：{cid:XX,cname:"..."}  
 * 含义：根据菜品类别编号，修改该菜品类别
 * 返回值形如： 
 *     {cid:200,msg:"1 category modified"}
 *     {cid:400,msg:"0 category modified,not exists"}  类别不存在
 *     {cid:401,msg:"0 category modified,no modification"}  类别存在，但是没被修改
 */
router.put("/",(req,res)=>{
    var data=req.body;  //请求数据{cid:xx,cname:"xx"}
    // console.log(data);
    //TODO: 此处可以对数据进行检验
    pool.query("UPDATE xfn_category SET ? WHERE cid=?",[data,data.cid],(err,result)=>{
        if(err) throw err;
        // console.log(result);
        if(result.changedRows>0){
            //实际更新了一行
            res.send({cid:200,msg:"1 category modified"});
        }else if(result.affectedRows==0){
            res.send({cid:400,msg:"0 category modified,not exists"});
        }else if(result.affectedRows==1 && result.changedRows==0){
            //影响到1行，但修改了0行————新值与旧值完全一样
            res.send({cid:401,msg:"0 category modified,no modification"})
        }
    })
})



 