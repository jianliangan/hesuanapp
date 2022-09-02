<template>
    <PathEdit ref="view_path_edit"></PathEdit>
    <el-button type="primary" plain class="my-smallbutton" @click="clk_add_path">
        新增路径
    </el-button>
</template>
 
<script lang="ts" setup>
import { nodeinfo_str } from '@/components/flowdraw/node';
import { ref } from 'vue';
var instan_nodes_map: Map<number, nodeinfo_str> = new Map<number, nodeinfo_str>()
const view_path_edit = ref()
//import FlowDraw from '../../components/FlowDraw.vue';
var clk_add_path = () => {
    view_path_edit.value.PathEdit_Init(instan_nodes_map)
}
</script>


