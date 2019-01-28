SET NAMES UTF8;
DROP DATABASE IF EXISTS xiaofeiniu;
CREATE DATABASE xiaofeiniu CHARSET=UTF8;
USE xiaofeiniu;

/*管理员*/
CREATE TABLE xfn_admin(
    aid	    INT PRIMARY KEY AUTO_INCREMENT,
    aname	VARCHAR(32) UNIQUE,
    apwd	VARCHAR(64)
);

INSERT INTO xfn_admin VALUES (NULL,"admin",PASSWORD("123456")),(NULL,"boss",PASSWORD("999999"));

/*公司信息表*/
CREATE TABLE xfn_settings(
    sid	        INT PRIMARY KEY AUTO_INCREMENT,
    appName	    VARCHAR(32),
    apiUrl	    VARCHAR(64),
    adminUrl	VARCHAR(64),
    appUrl	    VARCHAR(64),
    icp	        VARCHAR(64),
    copyright	VARCHAR(128)
);

INSERT INTO xfn_settings VALUES(NULL,"小肥牛","http://127.0.0.1:8090","http://127.0.0.1:8091","http://127.0.0.1:8092","京ICP备12006809号-3","Copyright © 北京雨佳餐饮有限公司版权所有");

/*桌台表*/
CREATE TABLE xfn_table(
    tid	    INT PRIMARY KEY AUTO_INCREMENT,
    tname	VARCHAR(64),
    type	VARCHAR(16),
    status	INT
);

INSERT INTO xfn_table VALUES (NULL,"月季堂","6-8人桌",1),(NULL,"牡丹阁","4人桌",2),(NULL,"君子兰","10人桌",3),(NULL,"玫瑰园","2人桌",0);

/*桌台预定信息*/
CREATE TABLE xfn_reservation(
    rid	        INT PRIMARY KEY AUTO_INCREMENT,
    contactName	VARCHAR(64),
    phone	    VARCHAR(16),
    contactTime	BIGINT,
    dinnerTime	BIGINT,
    tableId	    INT,
    FOREIGN KEY(tableId) REFERENCES xfn_table(tid)
);

INSERT INTO xfn_reservation VALUES (NULL,"丁丁","17698554863","1548408430420","15487100400000",1),(NULL,"丽丽","17698525686","1548402630420","15487100400000",2),(NULL,"俏俏","17698554856","1548405630420","15487100400000",3),(NULL,"跳跳","17698554762","1548508430420","15487100400000",4);

/*菜品分类表*/
CREATE TABLE xfn_category(
    cid	    INT PRIMARY KEY AUTO_INCREMENT,
    cname	VARCHAR(32)
);

INSERT INTO xfn_category VALUES (NULL,"肉类"),(NULL,"丸滑类"),(NULL,"海鲜类"),(NULL,"蔬菜豆制品"),(NULL,"菌类"),(NULL,"饮品");

/*菜品表*/
CREATE TABLE xfn_dish(
    did	        INT PRIMARY KEY AUTO_INCREMENT,
    title	    VARCHAR(32),
    imgUrl	    VARCHAR(128),
    price	    DECIMAL(6,2),
    detail	    VARCHAR(128),
    categoryId	INT,
    FOREIGN KEY(categoryId) REFERENCES xfn_category(cid)
);

INSERT INTO xfn_dish VALUES (1000,"草鱼片","imgs/r9470.2975695e.jpg",35,"选鲜活草鱼，切出鱼片冷鲜保存。锅开后再煮1分钟左右即可食用",1),(NULL,"脆皮肠","imgs/r9017.73c6111e.jpg",15,"锅开后再煮3分钟左右即可食用",1),(NULL,"酥肉","imgs/r4760.967a2577.jpg",25,"选用冷鲜五花肉，加上鸡蛋，淀粉等原料炸制，色泽黄亮，酥软醇香，肥而不腻。锅开后再煮3分钟左右即可食用",1),(NULL,"牛百叶","imgs/r9302.e0b0e236.jpg",40,"毛肚切丝后，配以调味料腌制而成。锅开后再煮2分钟左右即可食用。",1),(NULL,"腰花","imgs/r9287.76df6419.jpg",32,"选用大型厂家冷鲜腰花，经过解冻、清洗、切片而成。锅开后涮30秒左右即可食用。",1),(NULL,"猪脑花","imgs/r9711.cd193b71.jpg",28,"选用大型厂家冷鲜猪脑经过清洗，过水、撕膜而成。肉质细腻，锅开后再煮8分钟左右即可食用",1);

/*订单表*/
CREATE TABLE xfn_order(
    oid	        INT PRIMARY KEY AUTO_INCREMENT,
    startTime	BIGINT,
    endTime	    BIGINT,
    customerCount	INT,
    tableId	INT,
    FOREIGN KEY(tableId) REFERENCES xfn_table(tid)
);

INSERT INTO xfn_order VALUES (1,1548408430420,1549408430420,3,1)

/*订单详情*/
CREATE TABLE xfn_order_detail(
    did	        INT  PRIMARY KEY AUTO_INCREMENT,
    dishId	    INT,
    dishCount	INT,
    customerName	VARCHAR(64),
    orderId	    INT,
    FOREIGN KEY(dishId) REFERENCES xfn_dish(did),
    FOREIGN KEY(orderId) REFERENCES xfn_order(oid)
)

INSERT INTO xfn_order_detail VALUES (NULL,1000,1,"丁丁",1);
INSERT INTO xfn_order_detail VALUES (NULL,1001,1,"丽丽",1);

