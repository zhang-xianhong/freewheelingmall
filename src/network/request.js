import axios from "axios";

export function request(config) {
    // 1.创建axios实例
    const instance = axios.create({
        // baseURL: 'http://123.207.32.32:8000',
        baseURL: "http://152.136.185.210:7878/api/m5",
        timeout: 5000
    })

    // 2、axios的拦截器
    instance.interceptors.request.use(config => {
            // 2.1、请求拦截的作用
            // 1、config的某些信息不符合服务器的要求
            // 2、每次发送网络请求时，都希望在界面中显示一个请求的图标
            // 3、某些网络请求（比说登录(token)），必须携带一些特殊的信息
            // console.log(config)
            return config; // 要将获取的config返回
        }, err => {
            console.log(err)
        })
        // 2.2、响应拦截
    instance.interceptors.response.use(res => {
        // console.log(res)
        return res.data
    }, err => {
        console.log(err)
    })

    // 3、发送真正的网络请求
    return instance(config) //instance返回的本身就是一个promise对象，所以不需要进行封装，直接返回promise即可
}
