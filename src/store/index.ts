/**
 * @description 自动import导入所有 vuex 模块
 */

import { createStore } from 'vuex';

const files = require.context('./modules', false, /\.ts$/);
interface key_index_obj {
	[key: string]: any
}
const modules: key_index_obj = {}
files.keys().forEach((key) => {
	modules[key.replace(/(\.\/|\.ts)/g, '') as keyof typeof modules] = files(key).default
})

export default createStore({
	modules
});
