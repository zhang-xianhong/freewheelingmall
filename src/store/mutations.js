import { ADD_COUNTER, ADD_TO_CART } from './mutation-types'
export default {
    // addCart(state, payload) {
    //     // state.cartList.push(payload)
    //     // console.log(state)
    //     // 1、查找之前购物车中是否有商品
    //     let oldProduct = state.cartList.find(item => item.iid === payload.iid)
    //     if (oldProduct) {
    //         oldProduct.count += 1
    //     } else {
    //         payload.count = 1
    //         state.cartList.push(payload)
    //     }
    // }
    // mutations的目的就是修改state中状态，并且每个方法尽可能完成的事件比较单一一点
    [ADD_COUNTER](state, payload) {
        payload.count++
    },
    [ADD_TO_CART](state, payload) {
        payload.checked = true
        state.cartList.push(payload)
    }
}