<template>
    <el-dialog v-model="dialogAddVisible" :title="props.Title" width="50%">
        <el-form :model="formInstance" label-width="120px">
            <el-form-item label="科目">
                <el-select v-model="formInstance.subject" filterable>
                    <el-option v-for="item in subjectOptions" :key="item" :label="item" :value="item" />
                </el-select>

            </el-form-item>
            <el-form-item label="编码">
                <el-input v-model="formInstance.code" />
            </el-form-item>
            <el-form-item label="分类">
                <el-select v-model="formInstance.category" filterable>
                    <el-option v-for="item in categoryOptions" :key="item" :label="item" :value="item" />
                </el-select>

            </el-form-item>
            <el-form-item label="名称">
                <el-input v-model="formInstance.name" />
            </el-form-item>
            <el-form-item label="项目特征">
                <el-input v-model="formInstance.distinction"></el-input>
            </el-form-item>

        </el-form>
        <el-form-item>
            <el-button id="anniu" type="primary" @click="OnSubmit">{{ props.AddLabel }}
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
let categoryOptions = ref([]);
let subjectOptions = ref([]);
const props = defineProps({
    OnSubmit: {
        type: Function,
        default: null,
    },
    AddLabel: {
        type: String,
        default: "查询"
    },
    Title: {
        type: String,
        default: "查询"
    }
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
function UpdateData(subjectSource: any, categorySource: any) {
    categoryOptions.value.splice(0);
    subjectOptions.value.splice(0);

    for (let i = 0; i < subjectSource.length; i++) {
        subjectOptions.value.push(subjectSource[i]);
    }
    for (let i = 0; i < categorySource.length; i++) {
        categoryOptions.value.push(categorySource[i]);
    }
}
defineExpose({ PageLoaded, UpdateData });
</script>
<style scoped>
#anniu {
    margin-left: 44%;
}
</style>