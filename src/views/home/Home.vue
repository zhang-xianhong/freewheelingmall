<template>
  <div id="home">
    <nav-bar class="home-bar">
      <div slot="center">随心购商场</div>
    </nav-bar>
    <tab-control :titles="['流行','新款','精选']" @tabClick="tabClick" ref="tabControl1" class="tabcontrols" v-show="isTabFixed"/>
    <scroll class="content"
      ref="scroll" :probe-type="3" @scroll="contentScroll" :pull-up-load="true"
      @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control :titles="['流行','新款','精选']" @tabClick="tabClick" ref="tabControl"/>
      <goods-list :goods="showGoods" />
    </scroll>
    <back-top @click.native="backTopClick" v-show="isShowbackTop"/>
  </div>
</template>
<script>
import NavBar from 'components/common/navbar/NavBar'

import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'

import {getHomeMultidata,getHomeGoods} from 'network/home.js'
import {debounce} from 'common/utils'
import {itemListenerMixin,backTopMixin} from 'common/mixin'
import {BACKTOP_DISTANCE} from 'common/const'

export default {
  name: 'Home',
  components: {
    NavBar,
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodsList,
    Scroll
  },
  mixins: [itemListenerMixin,backTopMixin],
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop': {
          page: 0,
          list: []
        },
        'new': {
          page: 0,
          list: []
        },
        'sell': {
          page: 0,
          list: []
        }
      },
      currentType: 'pop',
      taboffsetTop: 0,
      isTabFixed: false,
      saveY: 0
    }
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    }
  },
  // 当页面加载时创建，生命周期函数
  created() {
    // 1、请求多个数据
      this.getHomeMultidata()
    // 2、请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
  },
  destroyed() {
    console.log("destroyed")
  },
  activated() {
    // 进来时调用
    // console.log("activetd")
    this.$refs.scroll.scrollToAim(0,this.saveY,0)
    this.$refs.scroll.refresh()
  },
  deactivated() {
    // console.log("deactivetd")
    // 出去时保存1、保存Y值
    this.saveY=this.$refs.scroll.getScollY()
    // console.log(this.saveY)

    // 2、取消事件的监听
    this.$bus.$off('itemImageLoad',this.homeImgListener)
  },
  mounted() {

  },
  methods: {
    /*
    *事件监听相关方法
    */
  //  对于refresh非常频繁的问题，进行防抖操作
   tabClick(index) {
      switch(index) {
        case 0: this.currentType='pop'
        break
        case 1: this.currentType='new'
        break
        case 2: this.currentType='sell'
        break
         // console.log(index)
      }

      // 让两个tabControl的currentIndex保持一致
      if(this.$refs.tabcontrol1 !== undefined) {
        this.$refs.tabcontrol1.currentIndex = index
        this.$refs.tabcontrol.currentIndex = index
      }
   },
  //  这里使用了混入
  //  backTopClick() {
  //    console.log('backTopClick')
  //   //  console.log(this.$refs.scroll.message)
  //    this.$refs.scroll.scrollToAim(0,0,500)
  //  },
   contentScroll(position) {
    //  console.log(position)
    // 1、判断BackTop是否显示
    // this.isShowbackTop=(-position.y)>1000
    this.isShowbackTop=(-position.y)>BACKTOP_DISTANCE
    //  2、决定tabControl是否吸顶（position:fixed）
    this.isTabFixed=(-position.y) > (this.taboffsetTop-30)
   },
   loadMore() {
    //  console.log("loadMore")
    this.getHomeGoods(this.currentType)
   },
   swiperImageLoad() {
    //  $el可以获取元素
    //  console.log(this.$refs.tabControl.$el)
    //  console.log(this.$refs.tabControl.$el.offsetTop)
    this.taboffsetTop=this.$refs.tabControl.$el.offsetTop
   },

    /*
    * 网络请求相关方法
    */
    getHomeMultidata() {
      getHomeMultidata().then(res=>{
      // console.log(res)
      // console.log(res.data.banner.list)
      // console.log(res.data.recommend.list)
      // console.log(res.data.keywords.list)
      this.banners=res.data.banner.list
      this.recommends=res.data.recommend.list
      // this.keywords=res.data.keywords.list
      })
    },
    getHomeGoods(type) {
      const page = this.goods[type].page+1
       getHomeGoods(type,page).then(res=>{
        //  console.log(res)
         this.goods[type].list.push(...res.data.list)
         this.goods[type].page += 1;
        // 完成上拉加载更多
        this.$refs.scroll.finishPullUp()
      })
    }
  }
}
</script>
<style scoped>
  #home {
    padding-top: 44px;
    /* vh视口 */
    height: 100vh;
    /* 第二种方法 */
    /* position: relative; */
  }
  .home-bar {
    background-color: var(--color-tint);
    color: #fff;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9;
  }
  .tabcontrols {
    position: relative;
    z-index: 9;
  }
  /* .tab-control {
    position: sticky;
    top: 44px;
    z-index: 9;
  } */
  .content {
    /* height: 300px; */
    height: calc(100vh - 93px);
    /* overflow: hidden; */
    /* position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0; */
  }
</style>
