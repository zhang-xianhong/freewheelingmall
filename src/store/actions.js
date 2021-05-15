import { ADD_COUNTER, ADD_TO_CART } from './mutation-types'
export default {
    // 逻辑较为复杂的或是异步操作也放在actions中
    // payload表示新添加的商品
    addCart(context, payload) {
        return new Promise((resolve, reject) => {
            // state.cartList.push(payload)
            // console.log(state)
            // 1、查找之前购物车中是否有商品
            let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
            if (oldProduct) {
                context.commit(ADD_COUNTER, oldProduct)
                resolve('当前的商品数量+1')
            } else {
                payload.count = 1
                context.commit(ADD_TO_CART, payload)
                resolve('添加了新的商品')
            }
        })
    }
}
