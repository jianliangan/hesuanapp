/**
 * @description 自动import导入所有 api 模块
 */

import { module_in } from './modtype'
const files = require.context('./model', false, /\.ts$/)
const modules: module_in = {}
files.keys().forEach((key: string) => {
    let key2 = key.replace(/(\.\/|\.ts)/g, '')

    modules[key2] = files(key).default
})
export default modules
