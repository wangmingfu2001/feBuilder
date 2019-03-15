/**
 * 项目配置文件
 * @authors mm
 * @date    2018-12-03
 * @version $Id$
 */
module.exports = {
    codeFormat: 'GBK', //如果是GBK 则会转码

    htmlConfig: {
        //html页面引用的cdn上的js文件
        injectJs: [
					'//static.xgo-img.com.cn/frame/che.js',
                    '//hm.baidu.com/h.js?25845b529d5d7e763490238117473eb6',
                    '//a.58cdn.com.cn/app58/rms/app/js/app_30805.js'
        		  ], 
        //项目引入的dll通用库文件别�?
        injectCommonJs:[
                        //'vue',
                       // 'MTools'
                        ],
        //html页面引用的cdn上的css文件
        injectCss: [] 
    },
    //别名
    alias: {
       // 'common':'@project/common/js/common.js',
        //'slide': '@project/common/js/slide.js'
    }

}