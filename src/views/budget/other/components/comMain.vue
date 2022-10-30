<template>
  <aj-hot-table ref="ajhottable" :MainContentPushRow="BudgetOtherPushRow" :MainContentFetchList="BudgetOtherList"
    MaxFileNums="1" MaxFileSize="20" TableKey="name" :HighlightCurrentRow="true" :BtnUpMove="true" :BtnDownMove="true"
    :BtnInsert="true" :BtnSign="true" :BtnDel="true" :BtnNew="false" :GetMainPrimeId="getMainPrimeId"
    :GetInitHotTable="getInitHotTable" :AddComment="addComment" :GetComments="getComments"
    :AfterSelected="afterSelected">
    <template v-slot:tableitem>
      <hot-column width="0" data="otherId" title="" />
      <hot-column width="310" data="name" title="名称" />
      <hot-column width="90" data="cost" type="numeric" numeric-format="formatJP" title="费用" />
    </template>
  </aj-hot-table>
</template>
<script lang="ts" setup>
import numbro from "numbro";

import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.min.css";

import { BudgetOtherPushRow, BudgetOtherList } from "@/api/model/budget/other";
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
  if (value != null) item.otherId = value;
  return item.otherId;
};
const afterSelected = (selected: baseObject, row, column, row2, column2) => {
  if (props.AfterSelected) props.AfterSelected(selected);
};
const addComment = (cell: Array<baseObject>, i: Number, row: baseObject) => {
  cell.push({
    row: i,
    col: 1,
    comment: { value: row.name },
  });
};
const getComments = () => {
  return [1];
};
const getInitHotTable = () => {
  return {
    cmd: null,
    sortR: 0,
    projectName: "",
    otherId: "",
    name: "",
    cost: 0,
    sort: 0,
    ownId: "",
    parentId: "",
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