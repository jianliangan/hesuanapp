<template>
	<div v-if="navMenus.length <= 0" style="padding:20px;">
		<el-alert title="无子集菜单" center type="info" :closable="false"></el-alert>
	</div>
	<template v-for="navMenu in navMenus" v-bind:key="navMenu">
		<el-menu-item v-if="!hasChildren(navMenu)" :index="navMenu.path">
			<a v-if="navMenu.meta && navMenu.meta.type == 'link'" :href="navMenu.path" target="_blank"
				@click.stop='() => { }'></a>
			<el-icon v-if="navMenu.meta && navMenu.meta.icon">
				<component :is="navMenu.meta.icon || 'el-icon-menu'" style="color:#C7DBE7;" />
			</el-icon>
			<!-- <el-icon v-if="navMenu.meta&&navMenu.meta.icon"><img class="iconimg" src="../../icons/svg/language.svg" /></el-icon> -->

			<template #title>
				<span style="color:#C7DBE7;font-size: 12px;">{{ navMenu.meta.title }}</span>
				<span v-if="navMenu.meta.tag" class="menu-tag">{{ navMenu.meta.tag }}</span>
			</template>
		</el-menu-item>
		<el-sub-menu v-else :index="navMenu.path">
			<template #title>
				<div style="width:40px;padding-left: 5px;">

					<div style="height:17px;display:inline;">
						<el-icon v-if="navMenu.meta && navMenu.meta.icon">
							<component :is="navMenu.meta.icon || 'el-icon-menu'" style="color:#C7DBE7;" />
						</el-icon>
					</div>
					<div style="display:inline;color:#C7DBE7;font-size: 12px;">{{ navMenu.meta.title }}</div>
				</div>
				<!-- <span>{{ navMenu.meta.title }}</span>
				<span v-if="navMenu.meta.tag" class="menu-tag">{{ navMenu.meta.tag }}</span> -->
			</template>
			<NavMenu :navMenus="navMenu.children"></NavMenu>
		</el-sub-menu>
	</template>
</template>

<script>
export default {
	name: 'NavMenu',
	props: ['navMenus'],
	data() {
		return {}
	},
	methods: {
		hasChildren(item) {
			return item.children && !item.children.every(item => item.meta.hidden)
		}
	}
}
</script>
<style>
.iconimg {
	width: 15px;
}
</style>
<style scoped>
.el-sub-menu>>>.el-sub-menu__title {
	padding: 0px;
}
</style>
