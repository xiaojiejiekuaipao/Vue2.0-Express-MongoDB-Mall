# vue-node-mongodb-project

> A Vue.js project

### 运行项目

1、先安装mongodb和环境搭建, 并启动mongodb： mongodb --dbpath=D:\Mongodb\data\db --port=27017

2、安装mongovue,建立dumall数据库，增加goods和users集合，插入数据(数据在dist/dumall-goods和dist/dumall-users) <br>


3、cnpm install<br>
4、node server/bin/www  // 启动express后端服务<br>
5、npm run dev



> 文件夹列表

```
| - build
| - config
| - mock     -- json静态数据
| - dist -- 静态资源文件
| - server   -- express框架后端文件
    | - models  
        | - goods.js  -- 商品数据模型
        | - users.js  -- 用户数据模型
    | - routes
        | - goods.js  -- 商品相关接口
        | - users.js  -- 用户相关接口
| - src
    | - assets      -- 样式文件
    | - components
        | - Modal.vue      -- 模态框组件
        | - NavHeader.vue  -- 头部组件
        | - NavBread.vue   -- 面包屑组件
        | - NavFooter.vue  -- 底部组件
    | - router -- 路由配置文件
    | - util   -- 公用方法文件
    | - views
        | - GoodsList.vue    -- 商品列表页组件
        | - Cart.vue         -- 购物车列表组件
        | - Address.vue      -- 地址列表页组件
        | - OrderConfirm.vue -- 订单确认页面
        | - OrderSuccess.vue -- 订单成功页面
    | - App.vue
    | - main.js
| - static   -- 项目所用图片，图标
| - show     -- 项目运行网页展示

```

### 项目效果展示

>#### 商品列表页面GoodsList.vue
![image](https://github.com/xiaojiejiekuaipao/Vue2.0-Express-MongoDB-Mall/blob/master/MallImg/goodLists.png)
 <br/>
>#### 购物车页面CartList.vue
![image](https://github.com/xiaojiejiekuaipao/Vue2.0-Express-MongoDB-Mall/blob/master/MallImg/cartList.png)
 <br/>
>#### 收货地址页面Address.vue
![image](https://github.com/xiaojiejiekuaipao/Vue2.0-Express-MongoDB-Mall/blob/master/MallImg/address.png)
 <br/>
 >#### 订单确认页面OrderConfirm.vue
![image](https://github.com/xiaojiejiekuaipao/Vue2.0-Express-MongoDB-Mall/blob/master/MallImg/OrderConfirm.png)
 <br/>
 >#### 订单成功页面OrderSuccess.vue
![image](https://github.com/xiaojiejiekuaipao/Vue2.0-Express-MongoDB-Mall/blob/master/MallImg/orderSuccess.png)
 <br/>


未完待续......


