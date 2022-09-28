<template>
  <aj-hot-table
    ref="ajhottable"
    :MainContentPushRow="BudgetMeasurePushRow"
    :MainContentFetchList="BudgetMeasureTree"
    ImportUri="http://localhost:8001/budget/import/"
    MaxFileNums="1"
    MaxFileSize="20"
    TableKey="name"
    :HighlightCurrentRow="true"
    :BtnUpMove="true"
    :BtnDownMove="true"
    :BtnInsert="true"
    :BtnSign="true"
    :BtnDel="true"
    :BtnInsertChildren="true"
    :BtnNew="false"
    :GetMainPrimeId="getMainPrimeId"
    :GetInitHotTable="getInitHotTable"
    :AddComment="addComment"
    :GetComments="getComments"
    :AfterSelected="afterSelected"
  >
    <template v-slot:tableitem>
      <hot-column width="0" data="measureId" title="" />
      <hot-column width="120" data="projectName" title="项目相关" />
      <hot-column width="120" data="name" title="名称" />
      <hot-column width="120" data="subject" title="成本科目" />
      <hot-column width="120" data="code" title="编码" />
      <hot-column width="120" data="category" title="类别" />

      <hot-column width="120" data="distinction" title="项目特征" />
      <hot-column width="120" data="unit" title="单位" />
      <hot-column width="120" data="have" type="numeric" title="含量" />
      <hot-column
        width="120"
        data="workAmount"
        type="numeric"
        title="招标工程量"
      />
      <hot-column
        width="120"
        data="costUnitprice"
        type="numeric"
        :numeric-format="formatJP"
        title="综合单价"
      />
      <hot-column
        width="120"
        data="costSumprice"
        type="numeric"
        :numeric-format="formatJP"
        title="综合合价"
      />
      <hot-column
        width="120"
        data="manageUnitprice"
        type="numeric"
        :numeric-format="formatJP"
        title="管理费单价"
      />
      <hot-column
        width="120"
        data="profitUnitprice"
        type="numeric"
        :numeric-format="formatJP"
        title="利润单价"
      />
      <hot-column
        width="120"
        data="manageSumprice"
        type="numeric"
        :numeric-format="formatJP"
        title="管理费合价"
      />
      <hot-column
        width="120"
        data="profitSumprice"
        type="numeric"
        :numeric-format="formatJP"
        title="利润合价"
      />
    </template>
  </aj-hot-table>
</template>
<script lang="ts" setup>
import numbro from "numbro";

import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.min.css";

import {
  BudgetMeasurePushRow,
  BudgetMeasureTree,
} from "@/api/model/budget/measure";
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
var languages = require("numbro/dist/languages.min.js");
numbro.registerLanguage(languages["zh-CN"]);

const formatJP = {
  pattern: "0,0.00 $",
  culture: "ja-JP",
};
const ajhottable = ref<baseObject>({});

const tableData2 = ref(new Array<baseObject>());

let getMainPrimeId = (item: baseObject, value: Object) => {
  if (value != null) item.measureId = value;
  return item.measureId;
};
const afterSelected = (selected: baseObject) => {
  props.AfterSelected(selected);
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
    cmd: null,
    sortR: 0,
    projectName: "",
    children: [],
    measureId: "",
    subject: "",
    code: null,
    category: "",
    name: "",
    distinction: "",
    unit: "",
    have: 0,
    workAmount: 0,
    costUnitprice: 0,
    costSumprice: 0,
    manageUnitprice: 0,
    profitUnitprice: 0,
    manageSumprice: 0,
    profitSumprice: 0,
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