/**
 * MySQL数据库连接池
 */

const mysql=require('mysql');
var pool=mysql.createPool({
    host:"127.0.0.1",   //数据库地址
    port:3306,          //端口号
    user:"root",        //数据库管理员
    password:"",        //数据库管理员密码
    database:"xiaofeiniu",  //默认连接的数据库
    connectionLimit: 10     //连接池中连接数量
   /*
   //配合新浪云修改
   host:process.env.MYSQL_HOST,
   port:process.env.MYSQL_POST,
   user:process.env.MYSQL_ACCESSKEY,
   password:process.env.MYSQL_SECRETKEY,
   database:"app_"+process.env.MYSQL_APPNAME,
   connectionLimit: 3
   */
});

//导出模块
module.exports=pool;
