<template>
  <el-container>

    <aj-table ref="ajtable" :MainContentPushRow="ProjectPushRow" :MainContentFetchList="ProjectFetchTree"
      :GetFormInstance="getFormInstance" :OnOpenDialog="onOpenDialog" :OnCancelDialog="onCancelDialog"
      :PreSubmit="preSubmit" :TableKey="tableKey" :BtnNew="true" :PreInstanData="preInstanData" :DefaultBtn="false"
      :ExtendButtons="[{ call: extendDelBtn, name: '删除', confirm: true }, { call: extendEditBtn, name: '编1辑', confirm: false }]"
      :CmdFirst="true" :CellClass="cellClass">
      <template v-slot:formitem>
        <el-form :model="formInstance" ref="formEl" label-width="120px" :rules="rules">
          <el-form-item label="项目id" style="display:none" prop="ownId">
            <el-input v-model="formInstance.ownId" />
          </el-form-item>
          <el-form-item label="上级名称" prop="parentId">
            <el-cascader v-model="formInstance.parentId" :options="tableData2" :props="groupsProps2" clearable
              trigger="onclick" />
          </el-form-item>
          <el-form-item label="名称" prop="projectName">
            <el-input v-model="formInstance.projectName" prop="projectName" />
          </el-form-item>
          <el-form-item label="序号">
            <el-input v-model="formInstance.sort" />
          </el-form-item>
        </el-form>
      </template>
      <template v-slot:tableitem>
        <el-table-column prop="projectName" label="名称" />
        <el-table-column prop="sort" label="序号" />
      </template>
    </aj-table>
  </el-container>
</template>

<script lang="ts" setup>
import {

  ProjectPushRow,
  ProjectFetchTree,
} from "@/api/model/home/project";

import { tools_objToobj } from "@/components/jrTools";
import { ElMessage } from "element-plus";
import { ref, nextTick, reactive } from "vue";
import { useRouter } from 'vue-router'
import type { FormRules } from 'element-plus'
interface baseObject {
  [key: string]: any;
}
let listUriParams: baseObject = {};
const router = useRouter();
let routerParams = router.currentRoute.value.query
/**
 * tree
 */

/**
 * main
 */
const formEl = ref<baseObject>({});
const ajtable = ref<baseObject>({});
const formInstance = ref<baseObject>({});
const tableKey = "projectName";
const tableData2 = ref(new Array<baseObject>());
const groupsProps2 = {
  value: "projectId",
  label: "projectName",
  emitPath: false,
  checkStrictly: true,
};
const onOpenDialog = (type: String) => {
  tableData2.value = ajtable.value.ExportDataList();
};
const cellClass = (row: baseObject) => {

  if (row.rowIndex == 0) {
    return "golalFirstLine";
  }
}
const rules = reactive<FormRules>({
  ownId: [
    { required: true, message: '必填项', trigger: 'blur' },
  ],
  projectName: [
    { required: true, message: '必填项', trigger: 'blur' },
  ],
  parentId: [
    { required: true, message: '必填项', trigger: 'blur' },
  ],

})
const preInstanData = () => {
  formInstance.value.ownId = listUriParams.ownId;

  return true;
};
const extendDelBtn = (row: baseObject) => {
  ajtable.value.DeleteRow(row);
}
const extendEditBtn = (row: baseObject) => {
  ajtable.value.ClkEditData(row);
}
const preSubmit = async () => {

  if (!formEl.value) return false;
  return await formEl.value.validate((valid: any, fields: any) => {

    if (valid) {
      if (
        formInstance.value.parentId &&
        formInstance.value.parentId == formInstance.value.projectId
      ) {
        ElMessage.error("上级节点不能等于自己");
        return false;
      }
      if (!formInstance.value.parentId) {
        formInstance.value.parentId = formInstance.value.ownId;
      }
      return true;
    } else {
      alert("有必填项没填");
      return false;
    }
  })




};
const onCancelDialog = () => {
  return;
};

let getFormInstance = (cmd: string, field: string, value: any) => {
  if (cmd == "SET") {
    if (field == "new") {
      formInstance.value = {};
    } else if (field == "*") {
      tools_objToobj(value, formInstance.value);
    } else if (field == "cmd") {
      formInstance.value.cmd = value;
    } else if (field == "children") {
      formInstance.value.children = value;
    }
    return null;
  } else {
    return formInstance.value;
  }
};

function PageLoaded(uri: baseObject) {
  tools_objToobj(uri, listUriParams);
  ajtable.value.PageLoaded({
    ownId: listUriParams.ownId,
    rootId: listUriParams.rootId,
    cmd: listUriParams.cmd
  });

}

nextTick(() => {
  PageLoaded({ ownId: routerParams.ownId, rootId: routerParams.rootId, cmd: routerParams.cmd });
});
</script>
<style>
.golalFirstLine {
  font-weight: bold;
}
</style>