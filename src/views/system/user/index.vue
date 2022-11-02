<template>
  <aj-table ref="ajtable" :MainContentPushRow="UsersPushRow" :MainContentFetchList="UsersFetchList"
    :GetFormInstance="getFormInstance" :GetExtendData="getExtendData" :OnOpenDialog="onOpenDialog"
    :OnCancelDialog="onCancelDialog" :HasPage="true" :PreSubmit="preSubmit" :BtnNew="true"
    Style="width:470px;height:100%">
    <template v-slot:formitem>
      <el-form :model="formInstance" label-width="120px">
        <el-form-item label="用户名称">
          <el-input v-model="formInstance.usersName" />
        </el-form-item>
        <el-form-item label="用户密码">
          <el-input v-model="formInstance.passWord" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formInstance.phone" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="formInstance.roleId" class="m-2">
            <el-option v-for="item of extendData.rolesMap.values()" :key="item.roleId" :label="item.roleName"
              :value="item.roleId" />
          </el-select>
        </el-form-item>
      </el-form>
    </template>
    <template v-slot:tableitem>
      <el-table-column width="150px" prop="usersName" label="用户名称" />

      <el-table-column width="100px" label="角色">
        <template #default="scope">
          {{ extendData.rolesMap.get(scope.row.roleId)?.roleName }}
        </template>
      </el-table-column>

      <el-table-column width="150px" prop="phone" label="手机号" />
    </template>
  </aj-table>
</template>
  
<script lang="ts" setup>
import { UsersFetchList, UsersPushRow } from "@/api/model/system/users";

import { tools_objToobj, tools_objToStrMap } from "@/components/jrTools";
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
const extendData = ref<baseObject>({});
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
let getExtendData = (value: any) => {

  extendData.value = value["extend"];;
  extendData.value.rolesMap = tools_objToStrMap(extendData.value.roles);


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
  