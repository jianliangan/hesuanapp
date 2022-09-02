interface func_property {
	commit: (p0: string, p1: string) => void
}
export default {
	state: {
		keepLiveRoute: [],
		routeKey: null,
		routeShow: true
	},
	mutations: {
		pushKeepLive(state: any, component: any) {
			if (!state.keepLiveRoute.includes(component)) {
				state.keepLiveRoute.push(component)
			}
		},
		removeKeepLive(state: any, component: any) {
			var index = state.keepLiveRoute.indexOf(component);
			if (index !== -1) {
				state.keepLiveRoute.splice(index, 1);
			}
		},
		clearKeepLive(state: any) {
			state.keepLiveRoute = []
		},
		setRouteKey(state: any, key: any) {
			state.routeKey = key
		},
		setRouteShow(state: any, key: any) {
			state.routeShow = key
		}
	},
	actions: {
		setRouteKey(p0: func_property, key: any) {
			p0.commit('setRouteKey', key);
		}
	}
}
