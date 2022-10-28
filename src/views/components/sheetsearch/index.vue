<template>

    <el-form :model="formInstance" :inline="true">

        <el-select v-model="formInstance.subject" placeholder="科目" filterable>
            <el-option v-for="item in subjectOptions" :key="item" :label="item" :value="item" />
        </el-select>

        <el-input v-model="formInstance.code" placeholder="编码" />

        <el-select v-model="formInstance.category" placeholder="分类" filterable>
            <el-option v-for="item in categoryOptions" :key="item" :label="item" :value="item" />
        </el-select>

        <el-input v-model="formInstance.name" placeholder="名称" />

        <el-input v-model="formInstance.distinction" class="distinction" placeholder="项目特征"></el-input>

        <el-button type="primary" @click="OnSubmit">查询
        </el-button>

    </el-form>
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
});
let OnSubmit = () => {
    props.OnSubmit(formInstance.value);

}
let onCancel = () => {

}
function PageLoaded(uri: baseObject, selected: Array<String>) {

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

.inputclass {
    width: 80px;
    margin: 10px;
}

.el-form-item {
    margin: 10px;
}

.el-button {
    margin: 10px;
    width: 60px;
}

.el-input {
    margin: 10px;
    width: 100px;
}

.distinction {
    width: 150px;
}

.el-select {
    margin: 10px;
    width: 100px;
}
</style>