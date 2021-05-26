<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content" ref="scroll" @scroll="contentScroll" :probe-type="3">
    <!-- <ul>
      <li v-for="(item,index) in $store.state.cartList" :key="index">
        {{item}}
      </li>
    </ul> -->

      <detail-swipper :top-images="topImages"></detail-swipper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @detailImageLoad="detailImageLoad"></detail-goods-info>
      <detail-param-info :param-info="paramInfo" ref="params"/>
      <detail-comment-info :comment-info="commentInfo" ref="comment"/>
      <goods-list :goods="recommends" ref="recommend"/>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"/>
    <back-top @click.native="backTopClick" v-show="isShowbackTop"/>
  </div>
</template>
<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwipper from './childComps/DetailSwipper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import GoodsList from 'components/content/goods/GoodsList'
import DetailBottomBar from './childComps/DetailBottomBar'


import Scroll from 'components/common/scroll/Scroll'

import {getDetail,Goods,Shop,GoodsParam,getRecommend} from 'network/detail'
import {debounce} from 'common/utils'
import {itemListenerMixin,backTopMixin} from 'common/mixin'
import {BACKTOP_DISTANCE} from 'common/const'
import { mapActions } from 'vuex'

export default {
  name: 'Detail',
   components: {
    DetailNavBar,
    DetailSwipper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodsList,
    DetailBottomBar
  },
  mixins: [itemListenerMixin,backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0
    }
  },
  created() {
    // 1、保存传入的iid
    this.iid=this.$route.params.iid
    // console.log(this.$route.params)
    // 2、根据iid请求详情数据
    getDetail(this.iid).then(res=>{
      console.log(res)
      const data=res.result

      // 1、获取顶部的图片轮播
      this.topImages=data.itemInfo.topImages
      // console.log(this.topImages)

      // 2、获取商品信息
      this.goods=new Goods(data.itemInfo,data.columns,data.shopInfo.services)
      // console.log(this.goods)

      // 3、创建店铺信息对象
      this.shop=new Shop(data.shopInfo)

      // 4、保存商品的详情数据
      this.detailInfo=data.detailInfo

      // 5、获取参数信息
      this.paramInfo=new GoodsParam(data.itemParams.info,data.itemParams.rule)

      // 6.保存评论信息
      if (data.rate.cRate!==0) {
        this.commentInfo = data.rate.list[0];
      }

      /*
      this.$nextTick(()=>{
        // 根据最新的数据渲染Dom，但是图片依然还没有加载完（目前获取到offsetTop不包含其中的图片）
        // offsetTop值不对的时候，都是因为图片的问题
        // 加载的值不对： 值不对的原因：图片还未加载完毕
        this.themeTopYs=[]
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        console.log(this.themeTopYs)
      })
      */
    })

    // 3、请求推荐数据
    getRecommend().then(res=>{
      console.log(res)
      this.recommends=res.data.list
    })

    // 4、给getThemeTopY赋值, 进行防抖，用于降低回调频率
    this.getThemeTopY = debounce(()=>{
        this.themeTopYs=[]
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE)
        // console.log(this.themeTopYs)
    },100)

  },
  destroyed() {
    // 2、取消事件的监听
    this.$bus.$off('itemImageLoad',this.homeImgListener)
    console.log("des")
  },
  mounted() {

  },
  methods: {
    ...mapActions(['addCart']),

    // 4、监听详情页图片加载完成
    detailImageLoad() {
      // let refresh = debounce(this.$refs.scroll.refresh,500)
      // this.$refs.scroll.refresh()
      // 进行防抖操作，让页面只刷新一次
      this.refresh()

      this.getThemeTopY()
    },
    titleClick(index) {
      // console.log(index)
      this.$refs.scroll.scrollToAim(0,-this.themeTopYs[index],200)
    },
    contentScroll(position) {
      // console.log(position)
      // 1、获取y值
      const positionY = -position.y
      // 2、position中y值和主题中y值做对比
      // 主题中y值：0, 8685, 9665, 9902
      // positoinY在O和7938 之间，index = 0
      // positoinY 在7938和9120之间 >=，index =1
      // positoinY在9120和9452之间,index = 2

      // positoinY超过9120值,index = 3，第四个区间可以设置为到最大值Number.MAX_VALUE

      let length = this.themeTopYs.length;
      for(let i=0;i<length-1;i++) {
        // if(this.currentIndex !== i && (i<length-1 && positionY>=this.themeTopYs[i] && positionY<this.themeTopYs[i+1]) || (i==length-1 && positionY>=this.themeTopYs[i])) {
        //   // console.log(i)
        //   this.currentIndex = i
        //   this.$refs.nav.currentIndex = this.currentIndex
        //   // console.log(this.currentIndex)
        // }
        // 降低代码量，在themeTopYs最后push一个Number的最大值
        if(this.currentIndex!==i && positionY>=this.themeTopYs[i] && positionY<this.themeTopYs[i+1]) {
          this.currentIndex = i
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }

      this.isShowbackTop=(-position.y)>BACKTOP_DISTANCE
    },
    addToCart() {
      // console.log('接收到购物车')
      // 1、获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid

      // 2、将商品添加到购物车里
      // this.$store.commit('addCart',product)
      this.addCart(product).then(res=>{
        console.log(res)
      })

      // this.$store.dispatch('addCart',product).then(res=>{
      //   console.log(res)
      // })

      // 添加到购物车成功

    }
  }
}
</script>
<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .content {
    /* height: calc(100vh - 44px); */
    position: absolute;
    top: 44px;
    bottom: 60px;
    background-color: #fff;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
</style>
