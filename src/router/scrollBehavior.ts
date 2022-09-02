import store from '@/store'
import { nextTick } from 'vue'
interface keyable {
	[key: string]: any
}
export function beforeEach(to: any, from: any) {
	var adminMain = document.querySelector('#adminui-main')
	if (!adminMain) { return false }
	store.commit("updateViewTags", {
		fullPath: from.fullPath,
		scrollTop: adminMain.scrollTop
	})
}

export function afterEach(to: any) {
	var adminMain = document.querySelector('#adminui-main')
	if (!adminMain) { return false }
	nextTick(() => {
		var beforeRoute = (store as keyable).state.viewTags.viewTags.filter((v: any) => v.fullPath == to.fullPath)[0]
		if (beforeRoute) {
			(adminMain as keyable).scrollTop = beforeRoute.scrollTop || 0
		}
	})
}