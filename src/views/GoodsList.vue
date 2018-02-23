<template>
	<div>
	<nav-header></nav-header>
	<nav-bread>
		<span slot="bread">Goods</span>
	</nav-bread>

	<div class="accessory-result-page accessory-page">
		  <div class="container">
		    <div class="filter-nav">
		      <span class="sortby">Sort by:</span>
		      <a href="javascript:void(0)" class="default cur">Default</a>
		      <a href="javascript:void(0)" class="price" @click="sortGoods">Price <svg class="icon icon-arrow-short" v-bind:class="{'sort-up':sortFlag}"><use xlink:href="#icon-arrow-short"></use></svg></a>
		      <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop()">Filter by</a>
		    </div>
		    <div class="accessory-result">
		      <!-- filter -->
		      <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show': filterBy}">
		        <dl class="filter-price">
		          <dt>Price:</dt>
		          <dd><a href="javascript:void(0)" v-bind:class="{'cur':priceChecked=='all'}" @click="setPriceFilter('all')">All</a></dd>
		          <dd v-for="(price, index) in priceFilter">
		            <a href="javascript:void(0)" v-bind:class="{'cur': priceChecked==index}" @click="setPriceFilter(index)">{{price.startPrice}} - {{price.endPrice}}</a>
		          </dd>
		        </dl>
		      </div>
		
		      <!-- search result accessories list -->
		      <div class="accessory-list-wrap">
		        <div class="accessory-list col-4">
		          <ul>
		            <li v-for="(item, index) in goodsList">
		              <div class="pic">
		                <a href="#"><img v-lazy="'/static/'+item.productImage" alt=""></a>
		              </div>
		              <div class="main">
		                <div class="name">{{item.productName}}</div>
		                <div class="price">{{item.salePrice | currency('$')}}</div>
		                <div class="btn-area">
		                  <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
		                </div>
		              </div>
		            </li>
		            
		          </ul>
		          <div class="view-more-normal"
		          	  v-infinite-scroll="loadMore" 
		          	  infinite-scroll-disabled="busy" 
		          	  infinite-scroll-distance="20">
                   <img v-show="loading" src="/static/loading-svg/loading-spinning-bubbles.svg" alt="" />
                  </div>
		        </div>
		      </div>
		    </div>
		  </div>
		</div>
	<modal v-bind:mdShow="mdShow" @close="closeModal">
		<p slot="message">
			您当前仍未登录，请先登录
		</p>
		<div slot="btnGroup">
			<a href="javascript:;" class="btn btn--m btn--red" @click="mdShow=false">去登录</a>
			<a href="javascript:;" class="btn btn--m" @click="mdShow=false">关闭</a>
		</div>
	</modal>
	<modal v-bind:mdShow="mdShowCart" @close="closeModal">
		<p slot="message">
			<svg class="icon-status-ok">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
            </svg>
            <span>加入购物车成功!</span>
		</p>
		<div slot="btnGroup">
			<a class="btn btn--m" href="javascript:;" @click="mdShowCart = false">继续购物</a>
            <router-link class="btn btn--m btn--red" href="javascript:;" to="/cart">查看购物车</router-link>
		</div>
	</modal>
	<!--遮罩层-->
	<div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
	<!--页脚组件-->
	<nav-footer></nav-footer>
	<!-- 图标  -->
        <svg style="position: absolute; width: 0; height: 0; overflow: hidden;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <defs>
              <symbol id="icon-arrow-short" viewBox="0 0 25 32">
                  <title>arrow-short</title>
                  <path class="path1" d="M24.487 18.922l-1.948-1.948-8.904 8.904v-25.878h-2.783v25.878l-8.904-8.904-1.948 1.948 12.243 12.243z"></path>
              </symbol>
              <symbol id="icon-status-ok" viewBox="0 0 32 32">
                <title>status-ok</title>
                <path class="path1" d="M22.361 10.903l-9.71 9.063-2.998-2.998c-0.208-0.209-0.546-0.209-0.754 0s-0.208 0.546 0 0.754l3.363 3.363c0.104 0.104 0.241 0.156 0.377 0.156 0.131 0 0.261-0.048 0.364-0.143l10.087-9.414c0.215-0.201 0.227-0.539 0.026-0.754s-0.539-0.226-0.754-0.026z"></path>
                <path class="path2" d="M16 30.933c-8.234 0-14.933-6.699-14.933-14.933s6.699-14.933 14.933-14.933c8.234 0 14.933 6.699 14.933 14.933s-6.699 14.933-14.933 14.933zM16 0c-8.822 0-16 7.178-16 16 0 8.823 7.178 16 16 16s16-7.177 16-16c0-8.822-7.178-16-16-16z"></path>
              </symbol>
            </defs>
        </svg>
	</div>
</template>


<script>
	import NavHeader from '@/components/NavHeader.vue'
	import NavFooter from '@/components/NavFooter.vue'
	import NavBread from '@/components/NavBread.vue'
	import Modal from '@/components/Modal.vue'
	import axios from  'axios'
	export default {
		data () {
			return {
				goodsList: [],
				priceFilter: [
				  {
				  	startPrice: '0.00',
				  	endPrice  : '100.00'
				  },
				  {
				  	startPrice: '100.00',
				  	endPrice  : '500.00'
				  },
				  {
				  	startPrice: '500.00',
				  	endPrice  : '1000.00'
				  },
				  {
				  	startPrice: '1000.00',
				  	endPrice  : '5000.00'
				  }
				],
				priceChecked: 'all', // 判断被点击到的价格标签
				filterBy: false,
				overLayFlag: false,
				
				sortFlag: true,
				page: 1,
				pageSize: 8,
				
				busy: true,       // 默认滚动失效
				loading: false,
				
				mdShow: false,     // 未登录购物车模态框
				mdShowCart: false // 已登录购物车模态框 
			}
		},
		components: {
			NavHeader,
			NavFooter,
			NavBread,
			Modal
		},
		mounted: function () {
			this.getGoodsList()
		},
		methods: {
			getGoodsList (flag) {
				if (!flag) { // 判断如果是点击价格区间，则当前页为第一页
					this.page = 1
				}
				let params = {
					page: this.page,
					pageSize: this.pageSize,
					sort: this.sortFlag ? 1:-1,
					priceLevel: this.priceChecked
				}
				
				axios.get("api/goods/list", {
					params: params
				}).then((response) => {
					// 数据获取有两种: 
					// 1.首页显示，直接填充返回的数据
					// 2.滚动分页数据获取，将获取的分页数据拼接到原来的商品数据上显示 
					let res = response.data;
					this.loading = false;  // 获取数据后，隐藏loading图标
					if (res.status=="0") { // 正确返回
						if (flag) {
							this.goodsList = this.goodsList.concat(res.result.list)
							if (res.result.count == 0) { // 如果所有商品数据返回完全，则禁用滚动插件
								this.busy = true
							} else{
								this.busy = false
							}
						} else{
							this.busy = false
							this.goodsList = res.result.list
						}
					} else{ // 出错
						this.goodsList = []
					}
				})
			},
			setPriceFilter (index) {
				this.priceChecked = index;
				this.closePop();
				this.getGoodsList()
			},
			sortGoods () { // 价格排序点击
				this.sortFlag = ! this.sortFlag; // 每点击一次排序取反
				this.page = 1;     //从第一页开始
				this.getGoodsList() // 显示商品
			},
			addCart (productId) {
				axios.post('api/goods/addCart', {
					productId: productId
				})
				.then((response) => {
					let res = response.data
					if (res.status == '0') {
						// alert('添加成功!')
						this.mdShowCart = true
						this.$store.commit("updateCartCount", 1)
					} else{
						// console.log('失败')
						this.mdShow = true
					}
				})
			},
			showFilterPop () { // 显示价格区间弹窗,因为当前页面是响应式，当页面缩小时，价格区间被隐藏
				this.filterBy = true;
				this.overLayFlag = true;
			},
			closePop () {     // 关闭弹窗
				this.filterBy = false;
				this.overLayFlag = false;
			},
			loadMore () { // 滚动加载执行函数
				// 请求数据前，先禁用滚动插件
				this.busy = true
				this.loading = true
				setTimeout(() => {  // 利用setTimeout,防止由于滚动过快加载大量数据
					this.page ++;
					this.getGoodsList(true); //传参表明当前是请求分页数据
				}, 500)
			},
			closeModal () {
				this.mdShow = false;
				this.mdShowCart = false
			}
		}
	}
</script>
