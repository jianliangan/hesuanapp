<template>
  <aj-table
    ref="ajtable"
    :HasTree="true"
    :LeftTreeFetchList="ProjectFetchList"
    :MainContentPushRow="ProjectPushRow"
    :MainContentFetchList="ProjectFetchTree"
    :GetTreePrimeId="getTreePrimeId"
    :GetTreePrimeName="getTreePrimeName"
    :GroupsProps="groupsProps"
    :GetFormInstance="getFormInstance"
    :TreeSelectNode="treeSelectNode"
    :OnOpenDialog="onOpenDialog"
    :OnCancelDialog="onCancelDialog"
    :PreSubmit="preSubmit"
    :PreFirstGetData="preFirstGetData"
    :TableKey="tableKey"
    :BtnNew="true"
  >
    <template v-slot:formitem>
      <el-form :model="formInstance" label-width="120px">
        <el-form-item label="项目id">
          <el-input v-model="formInstance.ownId" disabled />
        </el-form-item>
        <el-form-item label="项目名称">
          <el-input v-model="formInstance.ownName" disabled />
        </el-form-item>
        <el-form-item label="上级名称">
          <el-cascader
            v-model="formInstance.parentId"
            :options="tableData2"
            :props="groupsProps2"
            clearable
          />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="formInstance.projectName" />
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
</template>

<script lang="ts" setup>
import {
  ProjectFetchList,
  ProjectPushRow,
  ProjectFetchTree,
} from "@/api/model/project";

import { tools_objToobj } from "@/components/jrTools";
import { ElMessage } from "element-plus";
import { ref } from "vue";
interface baseObject {
  [key: string]: any;
}
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
const preFirstGetData = (requestlist: baseObject) => {
  requestlist.ownId = 0;
};
const preSubmit = () => {
  console.log("ccccccccc", formInstance.value);
  if (
    formInstance.value.parentId &&
    formInstance.value.parentId == formInstance.value.projectId
  ) {
    ElMessage.error("上级节点不能等于自己");
    return false;
  }

  return true;
};
const onCancelDialog = () => {
  return;
};
let getTreePrimeId = (item: baseObject, value: Object) => {
  if (value != null) item.projectId = value;

  return item.projectId;
};
let getTreePrimeName = (item: baseObject, value: Object) => {
  if (value != null) item.projectName = value;
  return item.projectName;
};
let treeSelectNode = (requestvar: baseObject, treenode: baseObject) => {
  requestvar.ownId = treenode.projectId;
  requestvar.rootId = treenode.projectId;
};

let getFormInstance = (cmd: string, field: string, value: any) => {
  if (cmd == "SET") {
    if (field == "new") {
      formInstance.value = {};
    } else if (field == "primeid") {
      formInstance.value.ownId = value;
    } else if (field == "name") {
      formInstance.value.ownName = value;
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
const groupsProps = {
  value: "projectId",
  label: "projectName",
  emitPath: false,
  checkStrictly: true,
};
</script>
