<template>
    <el-dialog v-model="dialogAddVisible" title="查询" width="50%">
        <el-form :model="formInstance" label-width="120px">
            <el-form-item label="科目">
                <el-input v-model="formInstance.subject" />
            </el-form-item>
            <el-form-item label="编码">
                <el-input v-model="formInstance.code" />
            </el-form-item>
            <el-form-item label="分类">
                <el-input v-model="formInstance.category" />
            </el-form-item>
            <el-form-item label="名称">
                <el-input v-model="formInstance.name" />
            </el-form-item>
            <el-form-item label="项目特征">
                <el-input v-model="formInstance.distinction"></el-input>
            </el-form-item>

        </el-form>
        <el-form-item>
            <el-button id="anniu" type="primary" @click="OnSubmit">查询
            </el-button>
            <el-button @click="onCancel">取消</el-button>
        </el-form-item>
    </el-dialog>
</template>
  
<script lang="ts" setup>
import { ref, defineExpose } from "vue";
import {
    tools_objToobj,
    tools_sort_map_loop,
} from "@/components/jrTools/index";
interface baseObject {
    [key: string]: any;
}

const listUriParams = {} as baseObject;
let formInstance = ref<baseObject>({});
let dialogAddVisible = ref(false);

const props = defineProps({
    OnSubmit: {
        type: Function,
        default: null,
    },
});
let OnSubmit = () => {
    props.OnSubmit(formInstance.value);
    dialogAddVisible.value = false;
}
let onCancel = () => {
    dialogAddVisible.value = false;
}
function PageLoaded(uri: baseObject, selected: Array<String>) {
    dialogAddVisible.value = true;
    // tools_objToobj(uri, listUriParams);
}
defineExpose({ PageLoaded });
</script>
<style scoped>
#anniu {
margin-left: 44%;
}
</style>