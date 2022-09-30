
import LoginIndex from '../views/login/LoginIndex.vue'

import Layout from '@/layout/index.vue'
// import tool from '@/utils/tool'
// import userRoutes from '@/config/route';
const routes = [

	{
		path: '/',
		//name: 'WorkFlowEdit',
		//component: WorkFlowEdit
		redirect: '/home/project',
		name: 'layout',
		component: Layout,
		children: []
	},
	{
		path: '/login',
		name: 'LoginIndex',
		component: LoginIndex
	},

	// {
	// 	path: '/flowlist',
	// 	name: 'WorkFlowList',
	// 	component: WorkFlowList
	// },
	// {
	// 	path: '/flowedit',
	// 	name: 'WorkFlowEdit',
	// 	component: WorkFlowEdit		
	// },

]

// const router = createRouter({
//   history: createWebHashHistory(process.env.BASE_URL),//createWebHashHistory  createWebHistory
//   routes: routes
// })

export default routes
