export default {
	state: {
		iframeList: []
	},
	mutations: {
		setIframeList(state: any, route: any) {
			state.iframeList = []
			state.iframeList.push(route)
		},
		pushIframeList(state: any, route: any) {
			let target = state.iframeList.find((item: any) => item.path === route.path)
			if (!target) {
				state.iframeList.push(route)
			}
		},
		removeIframeList(state: any, route: any) {
			state.iframeList.forEach((item: any, index: any) => {
				if (item.path === route.path) {
					state.iframeList.splice(index, 1)
				}
			})
		},
		refreshIframe(state: any, route: any) {
			state.iframeList.forEach((item: any) => {
				if (item.path == route.path) {
					var url = route.meta.url;
					item.meta.url = '';
					setTimeout(function () {
						item.meta.url = url
					}, 200);
				}
			})
		},
		clearIframeList(state: any) {
			state.iframeList = []
		}
	}
}
