<template>
  <aj-table ref="ajtable" :MainContentPushRow="DictBillmodePushRow" :MainContentFetchList="DictBillmodeList"
    :GetFormInstance="getFormInstance" :GetExtendData="getExtendData" :OnOpenDialog="onOpenDialog"
    :OnCancelDialog="onCancelDialog" :HasPage="true" :PreSubmit="preSubmit" :BtnNew="true">
    <template v-slot:formitem>
      <el-form :model="formInstance" label-width="120px">
        <el-form-item label="计费名称">
          <el-input v-model="formInstance.dictName" />
        </el-form-item>

        <el-form-item label="顺序">
          <el-input v-model="formInstance.sort" />
        </el-form-item>

      </el-form>
    </template>
    <template v-slot:tableitem>
      <el-table-column prop="dictName" label="计费名称" />
      <el-table-column prop="sort" label="顺序" />
    </template>
  </aj-table>
</template>
  
<script lang="ts" setup>
import { DictBillmodeList, DictBillmodePushRow } from "@/api/model/dict/dict";

import { tools_objToobj, tools_objToStrMap } from "@/components/jrTools";
import { ref, nextTick } from "vue";
interface baseObject {
  [key: string]: any;
}

const ajtable = ref<baseObject>({});
const formInstance = ref<baseObject>({});
const extendData = ref<baseObject>({});

const preSubmit = () => {
  return true;
};
let getExtendData = (value: any) => {

  extendData.value = value["extend"];
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
  