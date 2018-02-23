var express = require('express');
var Good = require('../models/Goods');
var User = require('../models/Users');

var router = express.Router();

/* GET home page. */
router.get('/list', function(req, res, next) {
  var current_page = parseInt(req.query.page) || 1;   // 当前是第几页
  var limit = parseInt(req.query.pageSize);           // 一页有多少条
  var skip = limit*(current_page -1)
  var sort = req.query.sort;                         // 排序规则
  var priceLevel = req.query.priceLevel;
  var priceGt = ''; // 价格最小值
  var priceLt = ''  // 价格最大值
  var priceParams = {}
  if (priceLevel != 'all') { // 当价格等级不是'all',通过价格等级筛选价格区间
  	switch (priceLevel){
  		case '0':
  		  priceGt = 0;
  		  priceLt = 100;
  			break;
  		case '1':
        priceGt = 100;
        priceLt = 500;
        break;
      case '2':
        priceGt = 500;
        priceLt = 1000;
        break;
      case '3':
        priceGt = 1000;
        priceLt = 5000
        break;
  	}
  	 priceParams = {
  	     salePrice: {
  	       $gt: priceGt,
  	       $lte: priceLt
  	     }
}
}
  Good.find(priceParams).limit(limit).skip(skip).sort({salePrice: sort})
  .then(function (doc) {
  	res.json({
  	  status: '0',
  	  msg: '',
  	  result: {
  	    count: doc.length,
  	    list: doc
  	  }
  	})
  }).catch(function (err) {
    if (err) {
    	res.json({
    	  status: '1',
    	  msg: err
    	})
    }
  	console.log(err)
  })
});

// 加入购物车
router.post('/addCart', function (req, res, next) {
	var userId    = req.session.userId,
	    productId = req.body.productId;
	console.log(userId + '和'+ productId)
	User.findOne({userId: userId})
	.then(function (userDoc) {
		if (userDoc) { // 若用户存在
		  let goodsItem = ''
			userDoc.cartList.forEach(function (item) {  // 遍历当前用户的购物车
				if (item.productId == productId) {        // 如果当前商品存在购物车中
				  goodsItem = item
					item.productNum ++;
				}
			})
			if (goodsItem) { // 商品存在购物车中
				userDoc.save(function () {
        res.json({
          status: '0',
          msg: '',
          result: '添加成功!'
        })
      })
			} else{ // 如果商品不存在购物车中，则添加
			  // 在Good中找到商品，将其添加到User的购物车列表中
				Good.findOne({productId: productId})
				.then(function (doc) {
					if (doc) {
						doc.productNum = 1;
						doc.checked = 1;
						userDoc.cartList.push(doc);
						userDoc.save(function (doc2) {
							res.json({
                status: '0',
                msg: '',
                result: '添加成功!'
               })
						})
					}
				})
			}
		}
	})
})


module.exports = router;
