<template>
    <el-dialog v-model="ui_dialog_visible" title="按钮触发接口" width="800px">
        <el-space direction="vertical">
            <div style="width:700px">
                <el-input v-model="textarea" :rows="10" type="textarea" placeholder="请输入" />
            </div>

            <el-button type="primary" class="my-smallbutton" @click="handleSave">
                确认
            </el-button>
        </el-space>
    </el-dialog>
</template>

<script lang="ts" setup>

import { ref, defineExpose, defineEmits } from 'vue'


const textarea = ref('')
const ui_dialog_visible = ref(false)

const allemits = defineEmits(['btnacteditok'])

const handleSave = () => {
    if (textarea.value.trim() == "")
        return
    allemits('btnacteditok', textarea.value)
    ui_dialog_visible.value = false
}

const BtnActEdit_Init = () => {
    ui_dialog_visible.value = true
}
defineExpose({
    BtnActEdit_Init
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