<template>

  <aj-table ref="ajtable" :MainContentPushRow="SubPackagePushRow" :MainContentFetchList="SubPackageList"
    :GetFormInstance="getFormInstance" :GetExtendData="getExtendData" :OnOpenDialog="onOpenDialog"
    :OnCancelDialog="onCancelDialog" :HasPage="true" :PreSubmit="preSubmit" :BtnNew="true"
    Style="width:890px;height:100%" :AfterSelected="afterSelected" :UseWithDialog="false" OptionType="no"
    OptionsWidth="100">
    <template v-slot:formitem>
      <div style="width:200px">
        <el-input v-model="formInstance.subPackageName" placeholder="分包名称" />
      </div>
      <div style="width:120px">
        <el-input v-model="formInstance.contact" placeholder="联系人" />
      </div>
      <div style="width:120px">
        <el-input v-model="formInstance.phone" placeholder="电话" />
      </div>

    </template>
    <template v-slot:tableitem>
      <el-table-column width="310px" prop="subPackageName" label="分包名称" />
      <el-table-column width="120px" prop="contact" label="联系人" />
      <el-table-column width="120px" prop="phone" label="电话" />
      <el-table-column width="120px" prop="managerName" label="录入人" />
      <el-table-column width="120px" prop="datetime" label="录入时间" />

    </template>
  </aj-table>
</template>
<script lang="ts" setup>
import numbro from "numbro";

import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.min.css";

import { ProjectFetchTree } from "@/api/model/home/project";
import { SubPackagePushRow, SubPackageList } from "@/api/model/dict/subpackage";
import { tools_objToobj, tools_objToStrMap } from "@/components/jrTools";
import { ref, nextTick, defineProps } from "vue";

interface baseObject {
  [key: string]: any;
}
const props = defineProps({
  AfterSelected: {
    type: Function,
    default: null,
  },
});
/**
 * left tree
 */

/**
 * right main
 */
const ajtable = ref<baseObject>({});
const formInstance = ref<baseObject>({});
const extendData = ref<baseObject>({});
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
const afterSelected = (selected: baseObject) => {
  if (props.AfterSelected) props.AfterSelected(selected);
};
const onOpenDialog = (type: String) => {

};
const onCancelDialog = () => {
  return;
};
const preSubmit = () => {
  return true;
};
registerAllModules();

/**
 * this api
 */
function PageLoaded(uri: baseObject, ownId: Object) {
  ajtable.value.PageLoaded(uri, ownId);
}

// nextTick(() => {
//   PageLoaded({ rootId: "0" });
// });

defineExpose({ PageLoaded });
</script>