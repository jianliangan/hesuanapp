<template>
  <el-dialog v-model="ui_dialog_visible" :title="props.Title" width="50%">
    <aj-table ref="ajtable" :MainContentPushRow="SupplyUnitPushRow" :MainContentFetchList="SupplyUnitList"
      :GetFormInstance="getFormInstance" :GetExtendData="getExtendData" :OnOpenDialog="onOpenDialog"
      :OnCancelDialog="onCancelDialog" :HasPage="true" :PreSubmit="preSubmit" :BtnNew="true"
      Style="width:1010px;height:100%" :SaveBtn="false" :AfterSelected="afterSelected" :UseWithDialog="false"
      OptionType="no" OptionsWidth="100">

      <template v-slot:tableitem>

        <el-table-column width="310px" prop="supplyUnitName" label="供应商名称" />
        <el-table-column width="120px" prop="supplierType" type="dropdown" label="供应商类型" />
        <el-table-column width="120px" prop="contact" label="联系人" />
        <el-table-column width="120px" prop="phone" label="电话" />
        <el-table-column width="120px" prop="managerName" label="录入人" />
        <el-table-column width="120px" prop="datetime" label="录入时间" />
      </template>

      <template v-slot:expendBtns>
        <el-input v-model="searchObject.supplyUnitName" placeholder="分包名称" />
        <el-input v-model="searchObject.phone" placeholder="电话" />
        <el-button type="primary" @click="onSearch">
          查询</el-button>
      </template>
    </aj-table>
  </el-dialog>
</template>
<script lang="ts" setup>
import numbro from "numbro";


import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.min.css";

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
  Title: {
    type: String,
    default: "",
  }
});
const searchObject: baseObject = ref({});
const ui_dialog_visible = ref(false);
const ajtable = ref<baseObject>({});
const formInstance = ref<baseObject>({});
const extendData = ref<baseObject>({});

let supplyunitsearch = ref<baseObject>({});
const listUriParams = {} as baseObject;
const supplierTypeList = ref([]);

let onSearch = () => {
  tools_objToobj(searchObject.value, listUriParams);
  ajtable.value.PageLoaded(listUriParams, 0);
}
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
  ui_dialog_visible.value = false;
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
  supplierTypeList.value = value["extend"].suppliertype;
};

/**
 * this api
 */
function PageLoaded(uri: baseObject, ownId: Object) {
  ui_dialog_visible.value = true;
  nextTick(() => {
    tools_objToobj(uri, listUriParams);
    ajtable.value.PageLoaded(uri, ownId);
  })
}

// nextTick(() => {
//   PageLoaded({ rootId: "0" });
// });

defineExpose({ PageLoaded });
</script>
<style>

</style>