<template>
  <aj-hot-table ref="ajhottable" :MainContentPushRow="ActualDivisionPushRow" :MainContentFetchList="ActualDivisionTree"
    MaxFileNums="1" MaxFileSize="20" TableKey="name" :HighlightCurrentRow="true" :BtnUpMove="true" :BtnDownMove="true"
    :BtnInsert="true" :BtnSign="true" :BtnDel="true" :BtnInsertChildren="true" :BtnNew="false"
    :GetMainPrimeId="getMainPrimeId" :GetInitHotTable="getInitHotTable" :AddComment="addComment"
    :GetComments="getComments" :AfterSelected="afterSelected">
    <template v-slot:tableitem>
      <hot-column width="0" data="divisionId" title="" />
      <hot-column width="120" data="projectName" title="项目相关" />
      <hot-column width="120" data="name" title="名称" />
      <hot-column width="120" data="subject" title="成本科目" />
      <hot-column width="120" data="code" title="编码" />
      <hot-column width="120" data="category" title="类别" />

      <hot-column width="120" data="distinction" title="项目特征" />
      <hot-column width="120" data="unit" title="单位" />
      <hot-column width="120" data="have" type="numeric" title="含量" />
      <hot-column width="120" data="actualWorkAmount" type="numeric" title="招标工程量" />
      <hot-column width="120" data="budgetWorkAmount" type="numeric" title="预算工程量" />
      <hot-column width="120" data="actualCostUnitprice" type="numeric" :numeric-format="formatJP" title="成本单价" />
      <hot-column width="120" data="actualCostSumprice" type="numeric" :numeric-format="formatJP" title="成本合价" />
      <hot-column width="120" data="actualCostManprice" type="numeric" :numeric-format="formatJP" title="成本人工费" />
      <hot-column width="120" data="actualCostMaterialsprice" type="numeric" :numeric-format="formatJP" title="成本材料费" />
      <hot-column width="120" data="actualCostMechanicsprice" type="numeric" :numeric-format="formatJP" title="成本机械费" />
      <hot-column width="120" data="actualCostDeviceprice" type="numeric" :numeric-format="formatJP" title="成本设备费" />
      <hot-column width="120" data="actualCostSubpackageprice" type="numeric" :numeric-format="formatJP"
        title="专业分包费" />
      <hot-column width="120" data="schedule" type="numeric" :numeric-format="formatJP" title="进度" />
    </template>
  </aj-hot-table>
</template>
<script lang="ts" setup>
import numbro from "numbro";

import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.min.css";

import { ProjectFetchTree } from "@/api/model/home/project";
import {
  ActualDivisionPushRow,
  ActualDivisionTree,
} from "@/api/model/actual/division";
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
  if (value != null) item.divisionId = value;
  return item.divisionId;
};
const afterSelected = (selected: baseObject) => {
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
    cmd: null,
    sortR: 0,
    projectName: "",
    children: [],
    divisionId: "",
    name: "",
    subject: "",
    code: null,
    category: "",

    distinction: "",
    unit: "",
    have: 0,
    actualWorkAmount: 0,
    budgetWorkAmount: 0,

    actualCostUnitprice: 0,
    actualCostSumprice: 0,
    actualCostManprice: 0,
    actualCostMaterialsprice: 0,
    actualCostMechanicsprice: 0,
    actualCostDeviceprice: 0,
    actualCostSubpackageprice: 0,
    schedule: "",
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