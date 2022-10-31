<template>
	<div class="adminui-topbar">
		<div class="left-panel">
			<div class="adminui-side-bottom" @click="$store.commit('TOGGLE_menuIsCollapse')">
				<el-icon class="el-icon--left">
					<el-icon-expand v-if="menuIsCollapse" />
					<el-icon-fold v-else />

				</el-icon>
			</div>
			<el-breadcrumb separator-icon="el-icon-arrow-right" class="hidden-sm-and-down">
				<transition-group name="breadcrumb" mode="out-in">
					<template v-for="item in breadList" :key="item.title">
						<el-breadcrumb-item v-if="item.path != '/' && !item.meta.hiddenBreadcrumb"
							:key="item.meta.title">
							<template v-if="item.click">
								<a v-bind:href="item.path">
									<el-icon class="icon" v-if="item.meta.icon">
										<component :is="item.meta.icon" />
									</el-icon>{{ item.meta.title }}
								</a></template>
							<template v-else>
								<el-icon class="icon" v-if="item.meta.icon">
									<component :is="item.meta.icon" />
								</el-icon>{{ item.meta.title }}
							</template>
						</el-breadcrumb-item>
					</template>
				</transition-group>
			</el-breadcrumb>
		</div>
		<div class="center-panel"></div>
		<div class="right-panel">
			<slot></slot>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			breadList: []
		}
	},
	created() {
		this.getBreadcrumb();
	},
	watch: {
		$route() {
			this.getBreadcrumb();
		}
	},
	methods: {
		getBreadcrumb() {
			let matched = this.$route.meta.breadcrumb;
			this.breadList = matched;

		}
	},
	computed: {
		menuIsCollapse() {
			return this.$store.state.global.menuIsCollapse;
		},
	},
}
</script>

<style scoped>
.el-breadcrumb {
	margin-left: 15px;
}

.el-breadcrumb .el-breadcrumb__inner .icon {
	font-size: 14px;
	margin-right: 5px;
	float: left;
}

.breadcrumb-enter-active,
.breadcrumb-leave-active {
	transition: all 0.3s;
}

.breadcrumb-enter-from,
.breadcrumb-leave-active {
	opacity: 0;
	transform: translateX(20px);
}

.breadcrumb-leave-active {
	position: absolute;
}
</style>
