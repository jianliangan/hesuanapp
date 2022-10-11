<template>
  <aj-table
    ref="ajtable"
    :MainContentFetchList="proxyMainContentFetchList"
    :GetTreePrimeId="getTreePrimeId"
    :GetTreePrimeName="getTreePrimeName"
    :GetFormInstance="getFormInstance"
    :GetExtendData="getExtendData"
    :OnOpenDialog="onOpenDialog"
    :OnCancelDialog="onCancelDialog"
    :HasPage="true"
    :PreSubmit="preSubmit"
    :BtnNew="false"
    TableKey="name"
    :hasOptions="false"
  >
    <template v-slot:formitem> </template>
    <template v-slot:tableitem>
      <el-table-column prop="meta.title" label="菜单名称" />
      <el-table-column label="">
        <template #header>
          <el-space
            ><span>权限</span>
            <el-checkbox
              label="可读"
              name="type"
              checked
              v-if="
                extendData.authormap &&
                extendData.authormap.get('all') &&
                extendData.authormap.get('all')['read'] == '1'
              "
              @change="(value) => readChange(value, { path: 'all' })"
            />
            <el-checkbox
              v-else
              label="可读"
              name="type"
              @change="(value) => readChange(value, { path: 'all' })"
            />
            <el-checkbox
              v-if="
                extendData.authormap &&
                extendData.authormap.get('all') &&
                extendData.authormap.get('all')['write'] == '1'
              "
              checked
              label="可写"
              @change="(value) => readChange2(value, { path: 'all' })"
              name="type"
            />
            <el-checkbox
              v-else
              label="可写"
              @change="(value) => readChange2(value, { path: 'all' })"
              name="type"
            />
          </el-space>
        </template>
        <template #default="scope">
          <template v-if="scope.row.component">
            <el-checkbox
              checked
              label="可读"
              @change="(value) => readChange(value, scope.row)"
              name="type"
              v-if="
                extendData.authormap &&
                extendData.authormap.get(scope.row.path) &&
                extendData.authormap.get(scope.row.path)['read'] == '1'
              "
            />
            <el-checkbox
              label="可读"
              name="type"
              @change="(value) => readChange(value, scope.row)"
              v-else
            />
            <el-checkbox
              checked
              label="可写"
              @change="(value) => readChange2(value, scope.row)"
              name="type"
              v-if="
                extendData.authormap &&
                extendData.authormap.get(scope.row.path) &&
                extendData.authormap.get(scope.row.path)['write'] == '1'
              "
            />
            <el-checkbox
              label="可写"
              @change="(value) => readChange2(value, scope.row)"
              name="type"
              v-else
            />
          </template>
        </template>
      </el-table-column>
    </template>
  </aj-table>
</template>
    
    <script lang="ts" setup>
import { SettingMenuFetchList } from "@/api/model/system/author";

import { RolePushRowAuthor } from "@/api/model/system/role";
//

import { tools_objToobj, tools_objToStrMap } from "@/components/jrTools";
import { ref, nextTick } from "vue";
interface baseObject {
  [key: string]: any;
}

const groupsProps = {
  value: "name",
  label: "name",
};
const extendData = ref<baseObject>({});
const listUriParams = {} as baseObject;
let listUriParamsOwnId = "";
const ajtable = ref<baseObject>({});
const formInstance = ref<baseObject>({});
const extendRole = ref(new Map<String, String>());
let getExtendData = (value: any) => {
  console.log("ddddddddd", value);
  extendData.value = value;
  extendData.value.authormap = tools_objToStrMap(extendData.value.author);

  console.log("dddd3333ddddd", extendData.value.authormap);
};
let readChange = (value, p: baseObject) => {
  let tmp = [];
  tmp[0] = p.path;
  if (value == true) {
    tmp[1] = "1";
  } else {
    tmp[1] = "0";
  }
  tmp[2] = "-1";
  RolePushRowAuthor(tmp, "?roleId=" + listUriParamsOwnId)
    .then((resdata: any) => {
      if (tmp[0] == "all")
        for (let [key, value] of extendData.value.authormap) {
          value["read"] = tmp[1];
        }
    })
    .catch((err: any) => {});
};
let readChange2 = (value, p: baseObject) => {
  let tmp = [];
  tmp[0] = p.path;
  tmp[1] = "-1";
  if (value == true) {
    tmp[2] = "1";
  } else {
    tmp[2] = "0";
  }
  // let tmp:Array<String>;
  // tmp.set(p.path, {});
  // if (value == true) {
  //   tmp[p.path].write = 1;
  // } else {
  //   tmp[p.path].write = 0;
  // }
  RolePushRowAuthor(tmp, "?roleId=" + listUriParamsOwnId)
    .then((resdata: any) => {
      if (tmp[0] == "all")
        for (let [key, value] of extendData.value.authormap) {
          value["write"] = tmp[2];
        }
    })
    .catch((err: any) => {});
};
let cityOnChange = () => {
  formInstance.value.province = formInstance.value.groupcity[0];
  formInstance.value.city = formInstance.value.groupcity[1];
  formInstance.value.region = formInstance.value.groupcity[2];
};
const preSubmit = () => {
  return true;
};
const proxyMainContentFetchList = (row: baseObject) => {
  return SettingMenuFetchList(row)
    .then((resdata: any) => {
      extendRole.value = resdata["extend"];
      return resdata;
    })
    .catch((err: any) => {});
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
  tools_objToobj(uri, listUriParams);
  console.log("gggggggggggggg", ownId);
  listUriParamsOwnId = ownId;
  ajtable.value.PageLoaded(uri, ownId);
}

defineExpose({ PageLoaded });
</script>
    