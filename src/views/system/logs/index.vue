<template>
  <aj-table
    ref="ajtable"
    :MainContentPushRow="RolePushRow"
    :MainContentFetchList="LogsFetchList"
    :GetTreePrimeId="getTreePrimeId"
    :GetTreePrimeName="getTreePrimeName"
    :GetFormInstance="getFormInstance"
    :OnOpenDialog="onOpenDialog"
    :OnCancelDialog="onCancelDialog"
    :HasPage="true"
    :PreSubmit="preSubmit"
    :BtnNew="true"
  >
    <template v-slot:formitem> </template>
    <template v-slot:tableitem>
      <el-table-column prop="datetime" label="时间" />
      <el-table-column prop="userName" label="用户名称" />
      <el-table-column prop="ip" label="登录地址" />
      <el-table-column prop="dist" label="登录地点" />
      <el-table-column prop="browser" label="浏览器" />
      <el-table-column prop="os" label="操作系统" />
      <el-table-column prop="status" label="登录状态" />
      <el-table-column prop="action" label="操作信息" />
    </template>
  </aj-table>
</template>
    
    <script lang="ts" setup>
import { LogsFetchList } from "@/api/model/system/logs.ts";

import { tools_objToobj } from "@/components/jrTools";
import { ref, nextTick } from "vue";
interface baseObject {
  [key: string]: any;
}
const groupsProps = {
  value: "code",
  label: "name",
};
const ajtable = ref<baseObject>({});
const formInstance = ref<baseObject>({});

let planAreas = new Map<string, baseObject>();
function getAllAreas(
  areas: Array<baseObject>,
  result: Map<string, baseObject>
) {
  if (areas == undefined) return;
  for (let i = 0; i < areas.length; i++) {
    getAllAreas(areas[i].children, result);
    result.set(areas[i].code, { code: areas[i].code, name: areas[i].name });
  }
}

let cityOnChange = () => {
  formInstance.value.province = formInstance.value.groupcity[0];
  formInstance.value.city = formInstance.value.groupcity[1];
  formInstance.value.region = formInstance.value.groupcity[2];
};
const preSubmit = () => {
  return true;
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
const onOpenDialog = (type: String) => {
  if (type == "add") formInstance.value.parentId = formInstance.value.ownId;
};
const onCancelDialog = () => {
  return;
};
function PageLoaded(uri: baseObject, ownId: Object) {
  ajtable.value.PageLoaded(uri, ownId);
}

nextTick(() => {
  PageLoaded({ ownId: "0" }, 0);
});
</script>
    
<style >
body .el-table .truncate .cell {
  width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 20px;
}
</style>