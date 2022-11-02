<template>
    <el-dialog v-model="dialogAddVisible" :title="props.Title">


        <el-input v-model="formInstance.subPackageName" placeholder="分包商名称" />

        <el-input v-model="formInstance.phone" placeholder="手机号" />


        <el-button type="primary" @click="OnSubmit">查询
        </el-button>
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
    Title: {
        type: String,
        default: "查询"
    }
});
let OnSubmit = () => {
    props.OnSubmit(formInstance.value);

}
let onCancel = () => {

}
function PageLoaded(uri: baseObject, selected: Array<String>) {
    dialogAddVisible.value = true;
    // tools_objToobj(uri, listUriParams);
}
function UpdateData(subjectSource: any, categorySource: any) {

}
defineExpose({ PageLoaded, UpdateData });
</script>
<style scoped>
#anniu {
    margin-left: 44%;
}

.el-dialog {
    width: 300px
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
    width: 150px;
}

.distinction {
    width: 150px;
}

.el-select {
    margin: 10px;
    width: 100px;
}
</style>