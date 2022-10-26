<template>
  <aj-hot-table ref="ajhottable" :MainContentPushRow="SupplyUnitPushRow" :MainContentFetchList="SupplyUnitList"
    MaxFileNums="1" MaxFileSize="20" TableKey="name" :HighlightCurrentRow="true" :BtnUpMove="true" :BtnDownMove="true"
    :BtnInsert="true" :BtnSign="true" :BtnDel="true" :BtnInsertChildren="false" :BtnNew="false"
    :GetMainPrimeId="getMainPrimeId" :GetInitHotTable="getInitHotTable" :AddComment="addComment"
    :GetComments="getComments" :AfterSelected="afterSelected">
    <template v-slot:tableitem>
      <hot-column width="0" data="supplyUnitId" title="" />
      <hot-column width="120" data="supplyUnitName" title="供应商名称" />
      <hot-column width="120" data="contact" title="联系人" />
      <hot-column width="120" data="phone" title="电话" />
    </template>
  </aj-hot-table>
</template>
<script lang="ts" setup>
import numbro from "numbro";

import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.min.css";

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
/**
 * left tree
 */

/**
 * right main
 */

const HotCommentIndex = [4];
registerAllModules();

const ajhottable = ref<baseObject>({});

const tableData2 = ref(new Array<baseObject>());

let getMainPrimeId = (item: baseObject, value: Object) => {
  if (value != null) item.supplyUnitId = value;
  return item.supplyUnitId;
};
const afterSelected = (selected: baseObject, row, column, row2, column2) => {
  if (props.AfterSelected) props.AfterSelected(selected);
};
const addComment = (cell: Array<baseObject>, i: Number, row: baseObject) => {
  cell.push({
    row: i,
    col: 6,
    comment: { value: row.distinction },
  });
};
const getComments = () => {
  return [6];
};
const getInitHotTable = () => {
  return {
    cmd: "",
    sortR: 0,
    supplyUnitId: "",
    supplyUnitName: "",
    contact: "",
    phone: "",
    source: "",
    children: [],
  };
};
/**
 * this api
 */
function PageLoaded(uri: baseObject, ownId: Object) {
  ajhottable.value.PageLoaded(uri, ownId);
}

// nextTick(() => {
//   PageLoaded({ rootId: "0" });
// });

defineExpose({ PageLoaded });
</script>