<template>
  <div class="tab-bar-item" @click="itemClick">
    <!-- 所有的图片和文字都展示相同的图片和文字，如果不展示相同的，可以动态设置为具名插槽slot -->
      <div v-if="!isActive"><slot name="item-icon"></slot></div>
      <div v-else><slot name="item-icon-active"></slot></div>
      <div :style="activeStyle"><slot name="item-text"></slot></div>
  </div>
</template>
<script>
export default {
  name: 'TabBarItem',
  props: {
    path: String,
    activeColor: {
      type: String,
      default: 'red'
    }
  },
  data() {
    return {
      // isActive: false
    }
  },
  computed: {
    isActive() {
      return this.$route.path.indexOf(this.path)!==-1
    },
    activeStyle() {
      return this.isActive?{color:this.activeColor}:{}
    }
  },
  methods: {
    itemClick() {
      // console.log("itemClick")
      this.$router.replace(this.path)
    }
  }
}
</script>
<style scoped>
    .tab-bar-item {
    flex: 1;
    height: 49px;
    text-align: center;
    font-size: 14px;
  }
  .tab-bar-item img {
    width: 24px;
    height: 24px;
    margin-top: 3px;
    margin-bottom: 2px;
    vertical-align: middle;
  }
  /* .active {
    color: #f00;
  } */
</style>
