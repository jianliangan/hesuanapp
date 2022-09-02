<template>
    <el-dialog v-model="ui_dialog_visible" title="字段生效条件" width="800px">
        <el-space direction="vertical">
            <el-space alignment="top">
                <div>
                    <el-table :data="selected_tags" style="width: 100%" height="450">
                        <el-table-column width="150">
                            <template #default="scope">
                                <el-space direction="vertical" class="myspace">
                                    <el-tag closable :type="color_config_array[scope.$index % 5]"
                                        @close="selected_tags_close(scope.$index)">
                                        {{ native_fields_map.get(scope.row.field_id)?.field_name }}
                                    </el-tag>
                                </el-space>
                            </template>
                        </el-table-column>
                        <el-table-column width="150">
                            <template #default="scope">
                                <el-select class="m-2" v-model="scope.row.type" placeholder="比较" size="small">
                                    <el-option v-for="item in compare_tags" :key="item" :label="item" :value="item" />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column width="150">
                            <template #default="scope">
                                <el-input placeholder="值" v-model="scope.row.value" />
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <el-divider direction="vertical" style="height: 100%;" />
                <el-table :data="filterTableData" style="width: 100%;" height="300">

                    <el-table-column label="节点名称" prop="field_name" width="180" />
                    <el-table-column width="100">
                        <template #header>
                            <el-input v-model="search" size="small" placeholder="Type to search" />
                        </template>

                        <template #default="scope">
                            <el-button size="small" round @click="handleSelect(scope.$index)">选择</el-button>
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

import { buttoninfo_str, fieldinfo_str, btncheckinfo_str, btnactinfo_str } from './common'
let selected_tags = ref(new Array<btncheckinfo_str>())
let native_fields_map = ref(new Map<number, fieldinfo_str>())
let compare_tags = ref(new Array<string>())
const compare_value = ref('')
let instan_fields_map_table: Array<fieldinfo_str> = (new Array<fieldinfo_str>())
const search = ref('')
const color_config_array = ["", "success", "info", "warning", "danger"]
const ui_dialog_visible = ref(false)

const allemits = defineEmits(['btnokeditok'])
const filterTableData = computed(() =>
    instan_fields_map_table.filter(
        (data) =>
            !search.value ||
            data.field_name.toLowerCase().includes(search.value.toLowerCase())
    )
)
const handleSave = () => {
    allemits('btnokeditok', selected_tags.value)
    ui_dialog_visible.value = false
}
const handleSelect = (index: number) => {
    let value = new btncheckinfo_str()
    value.field_id = instan_fields_map_table[index].field_id
    selected_tags.value.push(value)

}
const handleDelete = (index: number, row: fieldinfo_str) => {

}
const selected_tags_close = (index: number) => {

    selected_tags.value.splice(index, 1)
}


const BtnOkEdit_Init = (fields_map: Map<number, fieldinfo_str>, compare_infos: Array<string>,
    selectedfields: Array<btncheckinfo_str> | undefined) => {
    native_fields_map.value = fields_map
    selected_tags.value.splice(0)

    if (selectedfields !== undefined) {
        for (var i = 0; i < selectedfields.length; i++) {
            selected_tags.value.push(selectedfields[i])
        }
    }


    compare_tags.value = compare_infos

    for (let item of fields_map.values()) {
        instan_fields_map_table.push(item)
    }

    ui_dialog_visible.value = true
}
defineExpose({
    BtnOkEdit_Init
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