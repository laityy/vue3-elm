module.exports = {
    lintOnSave: false,
    configureWebpack: {
        resolve: {
            //配置别名
            alias: {
                //配置路径别名，配置后重启生效
                assets: '@/assets',
                components: '@/components',
                config: '@/config',
                hooks: '@/hooks',
                mixins: '@/mixins',
                network: '@/network',
                pages: '@/pages',
                plugins: '@/plugins',
                router: '@/router',
                store: '@/store',
                style: '@/style',
                utils: '@/utils',
            },
        },
    },
    devServer: {
        proxy: 'https://elm.cangdu.org',
    },
}
