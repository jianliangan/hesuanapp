<template>
    <el-dialog v-model="ui_dialog_visible" title="路径信息" width="50%">

        <el-space direction="vertical">
            <el-space alignment="top">
                <div>
                    <el-space direction="vertical" class="myspace">
                        <el-tag v-for="(item, index) in selected_tags" closable :key="index"
                            :type="color_config_array[index % 5]" @close="selected_tags_close(index)">
                            {{ item.node_name }}
                        </el-tag>
                    </el-space>
                </div>
                <el-divider direction="vertical" style="height: 100%;" />
                <el-table :data="filterTableData" style="width: 100%" height="300">

                    <el-table-column width="180">
                        <template #header>
                            <el-space><span>已有节点({{ node_number }})</span>
                            </el-space>
                        </template>
                        <template #default="scope">
                            {{ scope.row.node_name }}
                        </template>
                    </el-table-column>
                    <el-table-column width="150">
                        <template #header>
                            <el-input v-model="search" size="small" placeholder="搜索" />

                        </template>

                        <template #default="scope">
                            <el-button size="small" round @click="handleSelect(scope.row)">选择</el-button>


                        </template>
                    </el-table-column>
                </el-table>
            </el-space>
            <el-button type="primary" class="my-smallbutton" @click="handleSave">
                确认
            </el-button>
        </el-space>
    </el-dialog>
</template>

<script lang="ts" setup>

import { computed, ref, defineExpose, defineEmits } from 'vue'
import { nodeinfo_str } from './node'
import { nodepathinfo_str } from './path'


let selected_tags = ref(new Array<nodeinfo_str>())
let instan_nodes_map_table = ref(new Array<nodeinfo_str>())
const search = ref('')

const node_number = ref(0)


const color_config_array = ["", "success", "info", "warning", "danger"]
const ui_dialog_visible = ref(false)

const allemits = defineEmits(['patheditok'])
const filterTableData = computed(() =>
    instan_nodes_map_table.value.filter(
        (data) =>
            !search.value ||
            data.node_name.toLowerCase().includes(search.value.toLowerCase())
    )
)
const handleSave = () => {
    allemits('patheditok', selected_tags.value)
    ui_dialog_visible.value = false
}


const handleSelect = (row: nodeinfo_str) => {

    selected_tags.value.push(row)

}


const selected_tags_close = (index: number) => {
    selected_tags.value.splice(index, 1)
}


const PathEdit_Init = (nodes_map: Map<string, nodeinfo_str>, selectednodes: Array<nodepathinfo_str> | undefined) => {
    selected_tags.value.splice(0)
    if (selectednodes !== undefined) {
        for (var i = 0; i < selectednodes.length; i++) {
            let nodeid = selectednodes[i].node_id
            let node = nodes_map.get(nodeid)
            if (node !== undefined) {
                selected_tags.value.push(node)
            }
        }
    }
    instan_nodes_map_table.value.splice(0)
    for (let item of nodes_map.values()) {
        instan_nodes_map_table.value.push(item)
    }
    ui_dialog_visible.value = true
    node_number.value = instan_nodes_map_table.value.length
}
defineExpose({
    PathEdit_Init

})




</script>
<style scoped>
.myspace {
    margin-right: 40px
}

.el-table>>>.header-row th {
    background-color: #81D3F8 !important;
    color: #333333;
    font-size: 10px;
    font-weight: normal;
    line-height: 10px;
    padding-top: 3px;
    padding-bottom: 3px;
}

.el-table>>>td {
    font-size: 10px;
    font-weight: normal;
    line-height: 10px;
    padding-top: 3px;
    padding-bottom: 3px;
}

.el-table>>>td span {
    font-size: 10px;
    font-weight: normal;
    line-height: 10px;
    padding: 3px;

}

.el-table>>>td .cell {
    font-size: 10px;
    font-weight: normal;
    line-height: 10px;
    padding: 3px;
    margin: 3px;
}

.el-table>>>td button {
    font-size: 10px;
    font-weight: normal;
    line-height: 10px;
    padding: 0px;
    margin: 0px;
    height: 16px;
}

.el-dialog .my-smallbutton {
    font-size: 10px;
    padding-top: 3px;
    padding-bottom: 3px;
    font-weight: normal;
    line-height: 10px
}
</style>