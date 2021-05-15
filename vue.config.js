// 在这里配置别名
module.exports = {
        configureWebpack: {
            resolve: {
                alias: {
                    'assets': '@/assets',
                    'common': '@/common',
                    'components': '@/components',
                    'network': '@/network',
                    'views': '@/views'
                }
            }
        }
    }
    // lintOnSave: process.env.NODE_ENV === ‘development’,
lintOnSave: false