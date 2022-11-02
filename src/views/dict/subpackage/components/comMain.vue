<template>
  <subpackage-search ref="subpackagesearch" :OnSubmit="onSubmit"></subpackage-search>
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
    <template v-slot:expendcondition>
      <aj-select-input ref="projectSelect" :MainContentFetchList="ProjectFetchList"
        :GetMainPrimeId="getProjectSelectMainPrimeId" :GetMainName="getProjectSelectMainName"
        :ItemSelect="projectItemSelect" Placeholder="选择项目" :SelectFirst="true"></aj-select-input>
    </template>
    <template v-slot:expendBtns>
      <el-button type="primary" @click="onSearch">
        查询</el-button>
    </template>
  </aj-table>
</template>
<script lang="ts" setup>
import numbro from "numbro";

import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.min.css";
import SubpackageSearch from "../../../components/subpackagesearch/index.vue";
import { ProjectFetchList, ProjectPushRow } from "@/api/model/home/project";
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
let projectSelect = ref<baseObject>({});
let subpackagesearch = ref<baseObject>({});
const listUriParams = {} as baseObject;
let onSubmit = (params: baseObject) => {
  tools_objToobj(params, listUriParams);
  ajtable.value.PageLoaded(listUriParams, listUriParams.ownId);
}
let onSearch = () => {
  subpackagesearch.value.PageLoaded(null, null);
}
let getExtendData = (value: any) => {

  extendData.value = value["extend"];;
  extendData.value.rolesMap = tools_objToStrMap(extendData.value.roles);


};
const getProjectSelectMainPrimeId = (item: baseObject) => {
  return item.projectId;
};
const getProjectSelectMainName = (item: baseObject) => {
  return item.projectName;
};
const projectItemSelect = (value: String) => {
  listUriParams.projectId = value;
  // ajhottable.value.PageLoaded(listUriParams, value);
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
  selected.projectId = listUriParams.projectId;
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

  tools_objToobj(uri, listUriParams);
  ajtable.value.PageLoaded(uri, ownId);

  projectSelect.value.PageLoaded();
}

// nextTick(() => {
//   PageLoaded({ rootId: "0" });
// });

defineExpose({ PageLoaded });
</script>