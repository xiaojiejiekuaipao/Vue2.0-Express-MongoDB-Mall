var express = require('express');
require('./../util/util')
var router = express.Router();
var Good = require('../models/Goods');
var User = require('../models/Users');

router.get('/checkLogin', function(req, res, next) {
  var userId = req.session.userId;
  if (userId) {
  	User.findOne({userId: userId})
  	.then(function (doc) {
  	  // console.log(doc)
  		if (doc) {
  			res.json({
        status: "0",
        msg: '',
        result: {
          userName: doc.userName
        }
      })
  		}
  	})
  }
});


router.post('/login', function(req, res, next) {
  // console.log(req.body)
  var params = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  User.findOne(params)
  .then(function (doc) {
  	if (doc) {
  	  // console.log(doc)
  	  req.session.userId = doc.userId;
  	  res.json({
        status: "0",
        msg: '',
        result: {
          userName: doc.userName
        }
      })
  	}
  }).catch(function (err) {
  	if (err) {
  	  console.log(err)
  		res.json({
  		  status: "1",
  		  msg: err
  		})
  	}
  })
  });
  // 登出接口
router.get('/loginOut', function(req, res, next) {
  console.log('登出')
  // 将cookie生存时间设为-1,达到删除cookie的作用
  res.cookie("userId","", {
    path: "/",
    maxAge: -1
  })
  res.json({
    status: "0",
    msg: '',
    result: ''
  })
})
// 查询购物车数量
router.get('/getCartCount', function (req, res, next) {
	if (req.session.userId) {
		var userId = req.session.userId;
		User.findOne({userId: userId})
		.then(function (doc) {
			var cartList  = doc.cartList,
			    cartCount = 0;
			
			cartList.forEach(function (item) {
				cartCount += parseInt(item.productNum)
			});
			
			res.json({
			  status: '0',
			  msg: '',
			  result: cartCount
			})
		})
	}
})

// 查询当前用户购物车列表信息
router.get("/cartList", function (req, res, next) {
   var userId = req.session.userId;
   console.log(userId)
	 User.findOne({userId: userId})
	 .then(function (doc) {
	 	if (doc) {
	 	  console.log('hehe')
	 	  console.log(doc.cartList)
	 	  res.json({
	 	    status: "0",
	 	    msg: '',
	 	    result: doc.cartList
	 	  })
	 	}
	 }).catch(function (err) {
	 	if (err) {
      console.log(err)
      res.json({
        status: "1",
        msg: err,
        result: ''
      })
    }
	 })
})

// 修改购物车商品数量以及勾选状态
router.post('/editCart', function (req, res, next) {
	var userId     = req.session.userId,
	    productId  = req.body.productId,
	    productNum = req.body.productNum,
	    checked    = req.body.checked;
	User.update({"userId": userId, "cartList.productId": productId}, {
	  "cartList.$.productNum": productNum,
	  "cartList.$.checked"   : checked,
	}).then(function (doc) {
		if (doc) {
			res.json({
			  status: '0',
			  msg: '',
			  result: '修改成功'
			})
		}
	}).catch(function (err) {
    if (err) {
      console.log(err)
      res.json({
        status: "1",
        msg: err,
        result: ''
      })
    }
   })
	 
})

// 更改购物车商品全选状态
router.post('/editCheckAll', function (req, res, next) {
	var userId   = req.session.userId,
	    checkAll = req.body.checkAll ; 
	
	User.findOne({userId: userId})
	.then(function (user) {
		if (user) {
			user.cartList.forEach(function (item) {
				item.checked = checkAll;
			})
			user.save()
			.then(function (doc) {
				if (doc) {
          console.log(doc)
          res.json({
            status: '0',
            msg: '',
            result: '修改成功'
          })
        }
			})
		}
	}).catch(function (err) {
    if (err) {
      console.log(err)
      res.json({
        status: "1",
        msg: err,
        result: ''
      })
    }
   })
	
})

// 删除购物车商品
router.post('/delCart', function (req, res, next) {
	var userId    = req.session.userId,
	    productId = req.body.productId;
	    
	User.update({userId: userId}, { // 将User中的子文档cartList中对应的商品删除
	  $pull: {
	    'cartList': {'productId': productId}
	  }
	}).then(function (doc) {
		res.json({
		  status: '0',
		  msg: '',
		  result: '购物车删除成功!'
		})
	}).catch(function (err) {
    if (err) {
      console.log(err)
      res.json({
        status: "1",
        msg: err,
        result: ''
      })
    }
   })
	
})

// 查询用户地址接口
router.get('/addressList', function (req, res, next) {
	var userId = req.session.userId;
	User.findOne({userId: userId})
	.then(function (doc) {
		if (doc) {
      res.json({
        status: "0",
        msg: '',
        result: doc.addressList
      })
		}
	})
	
})


// 设置默认地址接口
router.post('/setDefault', function (req, res, next) {
	var userId    = req.session.userId,
	    addressId = req.body.addressId;
	if (!addressId) {
      res.json({
        status: "1",
        msg: '未接收到地址信息',
        result: ''
      })
	} else {
	  User.findOne({userId: userId})
	  .then(function (doc) {
	    var addressList = doc.addressList;
	  	addressList.forEach(function (item) {
	  		if (item.addressId == addressId) {
	  			item.isDefault = true;
	  		} else {
	  		  item.isDefault = false;
	  		}
	  	})
	  	doc.save(function (newdoc) {
	  		res.json({
	  		  status: '0',
	  		  msg: '',
	  		  result: '修改成功'
	  		})
	  	})
	  })
	}
});

// 删除收货地址接口
router.post('/delAddress', function (req, res, next) {
  var userId    = req.session.userId,
      addressId = req.body.addressId;
	User.update({userId: userId}, { // 将User中的子文档addressList中对应的地址删除
    $pull: {
      'addressList': {'addressId': addressId}
    }
  }).then(function (doc) {
  	if (doc) {
  		res.json({
  		  status: '0',
  		  msg: '',
  		  result: ''
  		})
  	}
  })
});

router.post('/payment', function (req, res, next) {
  // 订单需要的信息：订单号，商品，金额，收货地址，创建时间，订单状态
	var userId = req.session.userId,
	    addressId = req.body.addressId,
	    orderTotal = req.body.orderTotal;
	    
	    User.findOne({userId: userId})
	    .then(function (doc) {
	    	var address = '',
	    	    goodList = [];
	    	
	    	// 根据地址Id获得当前用户选择的收货地址
	    	doc.addressList.forEach((item) => {
	    		if (item.addressId == addressId) {
	    			address = item
	    		}
	    	})
	    	
	    	// 获取用户的购物车选中商品信息
	    	doc.cartList.filter(function (item) {
	    		if (item.checked == '1') {
	    			goodList.push(item)
	    		}
	    		})
	    	console.log(goodList)
	    	// 创建订单ID
	    	var platform = '622'; // 平台系统架构码
	    	var r1 = Math.floor(Math.random()*10);
	    	var r2 = Math.floor(Math.random()*10);
	    	
	    	var sysDate = new Date().Format('yyyyMMddhhmmss') // 系统时间: 年月日时分秒
	    	var orderId = platform + r1 + sysDate + r2; // 使用两个随机数并不确保订单ID唯一性 
	    	
	    	// 订单创建时间
	    	var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
	    	
	    	// 生成订单
	    	var order = {
	    	  orderStatus: '1',         // 订单状态, 1:成功
	    	  orderId: orderId,         // 订单Id
	    	  orderTotal: orderTotal,   // 订单总额
	    	  goodsList: goodList,      // 购买的商品列表
	    	  shippingAddress: address, // 收货地址
	    	  createDate: createDate    // 订单创建时间
	    	}
	    	// 将订单保存到文档的订单列表中
	    	doc.orderList.push(order);
	    	
	    	doc.save(function (doc) {
	    		res.json({
	    		  status: '0',
	    		  msg: '',
	    		  result: {
	    		    orderId: order.orderId,
	    		    orderTotal: order.orderTotal
	    		  }
	    		})
	    	})
	   })
})

router.get('/orderDetail', function (req, res, next) {
	var userId  = req.session.userId,
	    orderId = req.query.orderId;
	
	User.findOne({userId: userId})
	.then(function (userInfo) {
		var orderList = userInfo.orderList;
		if (orderList.length > 0) {  
			var orderTotal = 0;
			
			orderList.forEach((item) => {
				if (item.orderId == orderId) {
					orderTotal = item.orderTotal
				}
			})
			
			if (orderTotal > 0) {
				res.json({
				  status: '0',
				  msg: '',
				  result: {
				    orderId: orderId,
				    orderTotal: orderTotal
				  }
				})
			} else { // 订单金额小于0,暂时设置为错误
			  res.json({
        status: '120002',
        msg: '无此订单',
        result: ''
        })
			}
			
		} else { // 订单信息为空
		  res.json({
		    status: '120001',
		    msg: '当前用户为创建订单',
		    result: ''
		  })
		}
	})
	
})


 module.exports = router;
