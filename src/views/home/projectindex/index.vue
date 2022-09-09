<template>
  <aj-table
    :LeftTreeFetchList="ProjectFetchList"
    :MainContentPushRow="projectIndexPushRow"
    :MainContentFetchList="projectIndexFetchList"
    :GetTreePrimeId="getTreePrimeId"
    :GetTreePrimeName="getTreePrimeName"
    :GroupsProps="groupsProps"
    :GetFormInstance="getFormInstance"
  >
    <template v-slot:formitem>
      <el-form :model="formInstance" label-width="120px">
        <el-form-item label="项目id">
          <el-input v-model="formInstance.projectId" disabled />
        </el-form-item>
        <el-form-item label="项目名称">
          <el-input v-model="formInstance.projectName" disabled />
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
import { ProjectFetchList } from "@/api/model/project";
import {
  ProjectIndexPushRow,
  ProjectIndexFetchList,
} from "@/api/model/projectindex";
import { tools_objToobj } from "@/components/jrTools";
import { ref } from "vue";
interface baseObject {
  [key: string]: any;
}

const formInstance = ref<baseObject>({});
let projectFetchList = ProjectFetchList;
let projectIndexFetchList = ProjectIndexFetchList;
let projectIndexPushRow = ProjectIndexPushRow;
let getTreePrimeId = (item: baseObject, value: Object) => {
  if (value != null) item.projectId = value;

  return item.projectId;
};
let getTreePrimeName = (item: baseObject, value: Object) => {
  if (value != null) item.projectName = value;
  return item.projectName;
};

let getFormInstance = (cmd: string, field: string, value: any) => {
  if (cmd == "SET") {
    if (field == "primeid") {
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
</script>
