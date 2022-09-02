// import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
// import WorkFlowList from '../views/workflow/WorkFlowList.vue'
// import WorkFlowEdit from '../views/workflow/WorkFlowEdit.vue'
// import FlowIndex from '../views/workflow/FlowIndex.vue'
// import TestMy from '../views/workflow/TestMy.vue'
// import HomeView from '../views/HomeView.vue'
import LoginIndex from '../views/login/LoginIndex.vue'
import UserRegister from '../views/login/UserRegister.vue'
import ResetPassword from '../views/login/ResetPassword.vue'
import Layout from '@/layout/index.vue'
// import tool from '@/utils/tool'
// import userRoutes from '@/config/route';
const routes = [
	{
		path: '/reset_password',
		//name: 'WorkFlowEdit',
		//component: WorkFlowEdit
		name: 'ResetPassword',
		component: ResetPassword
	},
	{
		path: '/user_register',
		//name: 'WorkFlowEdit',
		//component: WorkFlowEdit
		name: 'UserRegister',
		component: UserRegister
	},
	{
		path: '/',
		//name: 'WorkFlowEdit',
		//component: WorkFlowEdit
		redirect: '/project',
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
