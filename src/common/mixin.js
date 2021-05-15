import { debounce } from './utils'
import BackTop from 'components/content/backTop/BackTop'
export const itemListenerMixin = {
    data() {
        return {
            homeImgListener: null,
            refresh: null
        }
    },
    // 这个地方的图片确实被加载，但是其中的图片还没有安全占据高度
    mounted() {
        // 进行防抖操作，只进行刷新一次
        this.refresh = debounce(this.$refs.scroll.refresh, 100)
            // 2、对监听的事件进行保存
        this.homeImgListener = () => {
                // this.$refs.scroll.refresh()
                // console.log(this.$refs.scroll.refresh)
                this.refresh()
            }
            // 3、监听item中图片加载完成
        this.$bus.$on('itemImageLoad', this.homeImgListener)
        console.log('我是混入中的内容')
    }
}

export const backTopMixin = {
    data() {
        return {
            isShowbackTop: false
        }
    },
    components: {
        BackTop
    },
    methods: {
        backTopClick() {
            console.log('backTopClick')
                //  console.log(this.$refs.scroll.message)
            this.$refs.scroll.scrollToAim(0, 0, 500)
        }
    }
}
