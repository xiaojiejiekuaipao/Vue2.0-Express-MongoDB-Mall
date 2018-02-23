<template>
	<div>
  <div class="container">
    <div class="page-title-normal">
      <h2 class="page-title-h2"><span>check out</span></h2>
    </div>
    <!-- 进度条 -->
    <div class="check-step">
      <ul>
        <li class="cur"><span>Confirm</span> address</li>
        <li class="cur"><span>View your</span> order</li>
        <li class="cur"><span>Make</span> payment</li>
        <li class="cur"><span>Order</span> confirmation</li>
      </ul>
    </div>

    <div class="order-create">
      <div class="order-create-pic"><img src="static/ok-2.png" alt=""></div>
      <div class="order-create-main">
        <h3>Congratulations! <br>Your order is under processing!</h3>
        <p>
          <span>Order ID：{{orderId}}</span>
          <span>Order total：{{orderTotal}}</span>
        </p>
        <div class="order-create-btn-wrap">
          <div class="btn-l-wrap">
          	<router-link class="btn btn--m" to='/cart'>Cart List</router-link>
          </div>
          <div class="btn-r-wrap">
            <router-link class="btn btn--m" to='/'>Good List</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
	import NavHeader from '@/components/NavHeader.vue' // 头部
	import NavFooter from '@/components/NavFooter.vue' // 底部
	import NavBread from '@/components/NavBread.vue' // 面包屑
	import axios from 'axios'
	
	export default {
		data () {
			return {
				orderId: '', //订单id
				orderTotal: 0 // 订单总金额
			}
		},
		components: {
			NavHeader,
			NavBread,
			NavFooter,
		},
		mounted () {
			this.init()
		},
		computed: {
			
		},
		methods: {
			init () {
				var orderId = this.$route.query.orderId;
				console.log(orderId)
				axios.get('api/users/orderDetail', {
					params: {
					  orderId: orderId
					}
				}).then( (response) => {
					let res = response.data;
					console.log(res)
					if (res.status == '0') {
						this.orderId = orderId,
						this.orderTotal = res.result.orderTotal
					}
				})
			}
		}
	}
</script>

