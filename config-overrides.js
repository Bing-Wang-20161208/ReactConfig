/*
 * @file config-overrides.js
 * @author Wang Bing  (13348823507@163.com)
 * 基于customize和react-app-rewired的定制化配置文件
 */

 //从customize中引入的一些方法
const {
    override,
    addLessLoader
} = require('customize-cra');

module.exports = override(
    addLessLoader({
        javascriptEnabled : true
    })
);