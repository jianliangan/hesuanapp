import router from '@/router'

export default {
	state: {
		viewTags: []
	},
	mutations: {
		pushViewTags(state: any, route: any) {
			let backPathIndex = state.viewTags.findIndex((item: any) => item.fullPath == router.options.history.state.back)
			let target = state.viewTags.find((item: any) => item.fullPath === route.fullPath)
			let isName = route.name
			if (!target && isName) {
				if (backPathIndex == -1) {
					state.viewTags.push(route)
				} else {
					state.viewTags.splice(backPathIndex + 1, 0, route)
				}
			}
		},
		removeViewTags(state: any, route: any) {
			state.viewTags.forEach((item: any, index: any) => {
				if (item.fullPath === route.fullPath) {
					state.viewTags.splice(index, 1)
				}
			})
		},
		updateViewTags(state: any, route: any) {
			state.viewTags.forEach((item: any) => {
				if (item.fullPath == route.fullPath) {
					item = Object.assign(item, route)
				}
			})
		},
		updateViewTagsTitle(state: any, title = '') {
			const nowFullPath = location.hash.substring(1)
			state.viewTags.forEach((item: any) => {
				if (item.fullPath == nowFullPath) {
					item.meta.title = title
				}
			})
		},
		clearViewTags(state: any) {
			state.viewTags = []
		}
	}
}
