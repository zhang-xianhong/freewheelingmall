// 对于refresh非常频繁的问题，进行防抖操作
export function debounce(fn, delay) {
    let timer = null;
    return function(...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
};
// export function formatDate(date, fmt) {
//     if (/(y+)/.test(fmt)) {
//         fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
//     }
//     let o = {
//         'M+': date.getMonth() + 1,
//         'd+': date.getDate(),
//         'h+': date.getHours(),
//         'm+': date.getMinutes(),
//         's+': date.getSeconds()
//     };
//     for (let k in o) {
//         if (new RegExp(`(${k})`).test(fmt)) {
//             let str = o[k] + '';
//             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
//         }
//     }
//     return fmt;
// }


export function formatDate(now) {
    var year = now.getFullYear(); //取得4位数的年份
    var month = now.getMonth() + 1; //取得日期中的月份，其中0表示1月，11表示12月
    var date = now.getDate(); //返回日期月份中的天数（1到31）
    var hour = now.getHours(); //返回日期中的小时数（0到23）
    var minute = now.getMinutes(); //返回日期中的分钟数（0到59）
    var second = now.getSeconds(); //返回日期中的秒数（0到59）
    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}
