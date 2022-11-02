<template>
  <supplyunit-search ref="supplyunitsearch" :OnSubmit="onSubmit"></supplyunit-search>
  <aj-table ref="ajtable" :MainContentPushRow="SupplyUnitPushRow" :MainContentFetchList="SupplyUnitList"
    :GetFormInstance="getFormInstance" :GetExtendData="getExtendData" :OnOpenDialog="onOpenDialog"
    :OnCancelDialog="onCancelDialog" :HasPage="true" :PreSubmit="preSubmit" :BtnNew="true"
    Style="width:1010px;height:100%" :AfterSelected="afterSelected" :UseWithDialog="false" OptionType="no"
    OptionsWidth="100">
    <template v-slot:formitem>
      <div style="width:200px">
        <el-input v-model="formInstance.supplyUnitName" placeholder="供应商名称" />
      </div>
      <div style="width:80px">
        <el-input v-model="formInstance.contact" placeholder="供应商类型" />
      </div>
      <div style="width:120px">
        <el-input v-model="formInstance.contact" placeholder="联系人" />
      </div>
      <div style="width:120px">
        <el-input v-model="formInstance.phone" placeholder="电话" />
      </div>

    </template>
    <template v-slot:tableitem>

      <el-table-column width="310px" prop="supplyUnitName" label="供应商名称" />
      <el-table-column width="120px" prop="supplierType" type="dropdown" label="供应商类型" />
      <el-table-column width="120px" prop="contact" label="联系人" />
      <el-table-column width="120px" prop="phone" label="电话" />
      <el-table-column width="120px" prop="managerName" label="录入人" />
      <el-table-column width="120px" prop="datetime" label="录入时间" />
    </template>
    <template v-slot:expendcondition>
      <aj-select-input ref="projectSelect" :MainContentFetchList="ProjectFetchList"
        :GetMainPrimeId="getProjectSelectMainPrimeId" :GetMainName="getProjectSelectMainName"
        :ItemSelect="projectItemSelect" Placeholder="选择项目" :SelectFirst="true" :RowStyle="rowStyle"></aj-select-input>
    </template>
    <template v-slot:expendBtns>
      <el-button type="primary" @click="onSearch">
        查询</el-button>
    </template>
  </aj-table>
</template>
<script lang="ts" setup>
import numbro from "numbro";
import SupplyunitSearch from "../../../components/supplyunitsearch/index.vue";
import { ProjectFetchList, ProjectPushRow } from "@/api/model/home/project";

import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.min.css";
import { hottableSettingsSupply } from "../../../components/common";
import { ProjectFetchTree } from "@/api/model/home/project";
import { SupplyUnitPushRow, SupplyUnitList } from "@/api/model/dict/supplyunit";
import { tools_objToobj } from "@/components/jrTools";
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
const ajtable = ref<baseObject>({});
const formInstance = ref<baseObject>({});
const extendData = ref<baseObject>({});
let projectSelect = ref<baseObject>({});
let supplyunitsearch = ref<baseObject>({});
const listUriParams = {} as baseObject;

let onSubmit = (params: baseObject) => {
  tools_objToobj(params, listUriParams);
  ajtable.value.PageLoaded(listUriParams, listUriParams.ownId);
}
let onSearch = () => {
  supplyunitsearch.value.PageLoaded(null, null);
}
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



const HotCommentIndex = [4];
registerAllModules();

const ajhottable = ref<baseObject>({});

const tableData2 = ref(new Array<baseObject>());
let getExtendData = (value: any) => {

};

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