<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll'
export default {
  name: 'Scroll',
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scroll: null,
      // message: '哈哈哈'
    }
  },
  mounted() {
    // 1、创建better-scroll对象
    this.scroll=new BScroll(this.$refs.wrapper,{
      observeDOM: true,
      click: true,
      probeType: this.probeType,
      pullUpLoad:this.pullUpLoad
    })
    console.log(this.scroll)
    // this.scroll.scrollTo(x,y,time)可以做到点击回到某个固定位置的效果
    // 2、监听滚动位置
    if(this.probeType==2 || this.probeType==3) {
      this.scroll.on('scroll',(position)=>{
      // console.log(position)
      // 发送到需要使用的组件中去
      this.$emit('scroll',position)
    })
    }
    // 3、监听上拉事件
    if(this.pullUpLoad) {
      this.scroll.on('pullingUp',()=>{
      // console.log("上拉加载更多")
      this.$emit('pullingUp')
    })
    }

  },
  methods: {
    scrollToAim(x,y,time=300) {
      this.scroll && this.scroll.scrollTo(x,y,time)
    },
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp()
    },
    refresh() {
      // console.log("refresh")
      this.scroll && this.scroll.refresh()
    },
    getScollY() {
      return this.scroll?this.scroll.y:0
    }
  }
}
</script>
<style scoped>
  /* .wrapper {

  } */
</style>
