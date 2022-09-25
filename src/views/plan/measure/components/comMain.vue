<template>
  <aj-hot-table
    ref="ajhottable"
    :MainContentPushRow="PlanMeasurePushRow"
    :MainContentFetchList="PlanMeasureTree"
    ImportUri="http://localhost:8001/plan/import/"
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
        data="budgetWorkAmount"
        type="numeric"
        title="预算工程量"
      />
      <hot-column
        width="120"
        data="costUnitprice"
        type="numeric"
        :numeric-format="formatJP"
        title="成本单价"
      />
      <hot-column
        width="120"
        data="costSumprice"
        type="numeric"
        :numeric-format="formatJP"
        title="成本合价"
      />
      <hot-column
        width="120"
        data="costManprice"
        type="numeric"
        :numeric-format="formatJP"
        title="成本人工费"
      />
      <hot-column
        width="120"
        data="costMaterialsprice"
        type="numeric"
        :numeric-format="formatJP"
        title="成本材料费"
      />
      <hot-column
        width="120"
        data="costMechanicsprice"
        type="numeric"
        :numeric-format="formatJP"
        title="成本机械费"
      />
      <hot-column
        width="120"
        data="costDeviceprice"
        type="numeric"
        :numeric-format="formatJP"
        title="成本设备费"
      />
      <hot-column
        width="120"
        data="costSubpackageprice"
        type="numeric"
        :numeric-format="formatJP"
        title="专业分包费"
      />
    </template>
  </aj-hot-table>
</template>
<script lang="ts" setup>
import numbro from "numbro";

import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.min.css";

import { PlanMeasurePushRow, PlanMeasureTree } from "@/api/model/plan/measure";
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
    divisionId: "",
    name: "",
    subject: "",
    code: null,
    category: "",

    distinction: "",
    unit: "",
    have: 0,
    planWorkAmount: 0,
    budgetWorkAmount: 0,

    planCostUnitprice: 0,
    planCostSumprice: 0,
    planCostManprice: 0,
    planCostMaterialsprice: 0,
    planCostMechanicsprice: 0,
    planCostDeviceprice: 0,
    planCostSubpackageprice: 0,
    sort: 0,
    ownId: "",
    parentId: "",
  };
};
/**
 * this api
 */
function PageLoaded(uri: baseObject) {
  ajhottable.value.PageLoaded(uri);
}

// nextTick(() => {
//   PageLoaded({ rootId: "0" });
// });

defineExpose({ PageLoaded });
</script>