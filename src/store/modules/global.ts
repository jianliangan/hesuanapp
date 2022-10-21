import config from "@/config";
interface key_index_obj {
	[key: string]: any
}
export default {
	state: {
		//移动端布局
		ismobile: false,
		//布局
		layout: config.LAYOUT,
		//菜单是否折叠 toggle
		menuIsCollapse: config.MENU_IS_COLLAPSE,
		//多标签栏
		layoutTags: config.LAYOUT_TAGS,
		//主题
		theme: (config as key_index_obj).THEME,
	},
	mutations: {
		SET_ismobile(state: any, key: any) {
			state.ismobile = key
		},
		SET_layout(state: any, key: any) {
			state.layout = key
		},
		SET_theme(state: any, key: any) {
			state.theme = key
		},
		TOGGLE_menuIsCollapse(state: any) {
			setTimeout(() => {
				var ev = new Event("pagecontentCollapse", { "bubbles": true, "cancelable": true });
				document.dispatchEvent(ev);
			}, 300);
			state.menuIsCollapse = !state.menuIsCollapse
		},
		TOGGLE_layoutTags(state: any) {
			state.layoutTags = !state.layoutTags
		}
	}
}
