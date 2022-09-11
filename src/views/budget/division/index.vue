<template>
  <aj-table
    ref="ajtable"
    :HasTree="true"
    :LeftTreeFetchList="ProjectFetchTree"
    :MainContentPushRow="projectIndexPushRow"
    :MainContentFetchList="projectIndexFetchList"
    :GetTreePrimeId="getTreePrimeId"
    :GetTreePrimeName="getTreePrimeName"
    :GroupsProps="groupsProps"
    :GetFormInstance="getFormInstance"
    :OnOpenDialog="onOpenDialog"
    :OnCancelDialog="onCancelDialog"
    ImportUri="http://localhost:8001/budget/import/"
    MaxFileNums="1"
    MaxFileSize="20"
    :PreSubmit="preSubmit"
    :TreeSelectNode="treeSelectNode"
    :FirstGetTree="firstGetTree"
  >
    <template v-slot:formitem>
      <el-form :model="formInstance" label-width="120px">
        <el-form-item label="项目id">
          <el-input v-model="formInstance.projectId" disabled />
        </el-form-item>
        <el-form-item label="项目名称">
          <el-input v-model="formInstance.projectName" disabled />
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
          <el-input v-model="formInstance.nodeName" />
        </el-form-item>
        <el-form-item label="序号">
          <el-input v-model="formInstance.sort" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formInstance.comment" />
        </el-form-item>
      </el-form>
    </template>
    <template v-slot:tableitem>
      <el-table-column prop="nodeName" label="名称" />
      <el-table-column prop="sort" label="序号" />
      <el-table-column prop="comment" label="备注" />
    </template>
  </aj-table>
</template>

<script lang="ts" setup>
import { ProjectFetchTree } from "@/api/model/project";
import {
  ProjectIndexPushRow,
  ProjectIndexFetchList,
} from "@/api/model/projectindex";
import { tools_objToobj } from "@/components/jrTools";
import { ref } from "vue";
interface baseObject {
  [key: string]: any;
}
const groupsProps2 = {
  value: "indexId",
  label: "nodeName",
  emitPath: false,
  checkStrictly: true,
};
const ajtable = ref<baseObject>({});
const formInstance = ref<baseObject>({});
const tableData2 = ref(new Array<baseObject>());

let projectIndexFetchList = ProjectIndexFetchList;
let projectIndexPushRow = ProjectIndexPushRow;
let getTreePrimeId = (item: baseObject, value: Object) => {
  if (value != null) item.projectId = value;

  return item.projectId;
};
const firstGetTree = (requestlist: baseObject) => {
  requestlist.rootid = 0;
};
let treeSelectNode = (requestvar: baseObject, treenode: baseObject) => {
  requestvar.projectId = treenode.projectId;
};

let getTreePrimeName = (item: baseObject, value: Object) => {
  if (value != null) item.projectName = value;
  return item.projectName;
};
const preSubmit = () => {
  return true;
};
let getFormInstance = (cmd: string, field: string, value: any) => {
  if (cmd == "SET") {
    if (field == "new") {
      formInstance.value = {};
    } else if (field == "primeid") {
      formInstance.value.projectId = value;
    } else if (field == "name") {
      formInstance.value.projectName = value;
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
const onOpenDialog = (type: String) => {
  if (!formInstance.value.parentId)
    formInstance.value.parentId = formInstance.value.ownId;
  tableData2.value = ajtable.value.ExportDataList();
  console.log("ddddddddddd", tableData2.value);
};
const onCancelDialog = () => {
  return;
};
</script>
