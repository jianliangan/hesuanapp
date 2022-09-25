<template>
  <aj-hot-table
    ref="ajhottable"
    :MainContentPushRow="PlanDivisionMachinePushRow"
    :MainContentFetchList="PlanDivisionMachineTree"
    MaxFileNums="1"
    MaxFileSize="20"
    TableKey="name"
    :HighlightCurrentRow="true"
    :BtnUpMove="true"
    :BtnDownMove="true"
    :BtnInsert="true"
    :BtnSign="true"
    :BtnNew="false"
    :GetMainPrimeId="getMainPrimeId"
    :GetInitHotTable="getInitHotTable"
    :AddComment="addComment"
    :GetComments="getComments"
    :AfterSelected="afterSelected"
  >
    <template v-slot:tableitem>
      <hot-column width="0" data="id" title="" />
      <hot-column width="120" data="code" title="编码" />
      <hot-column width="120" data="category" title="类别" />
      <hot-column width="120" data="name" title="名称" />
      <hot-column width="120" data="type" title="规格型号" />
      <hot-column width="120" data="unit" title="单位" />
      <hot-column width="120" data="have" title="含量" />
      <hot-column width="120" data="count" type="numeric" title="数量" />
      <hot-column
        width="120"
        data="price"
        type="numeric"
        :numeric-format="formatJP"
        title="市场价"
      />
      <hot-column
        width="120"
        data="combinedPrice"
        type="numeric"
        :numeric-format="formatJP"
        title="合价"
      />
      <hot-column width="120" data="taxRate" type="numeric" title="税率" />
      <hot-column
        width="120"
        data="referenceValue"
        type="numeric"
        title="参考值"
      />
    </template>
  </aj-hot-table>
</template>
<script lang="ts" setup>
import numbro from "numbro";

import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.min.css";

import {
  PlanDivisionMachinePushRow,
  PlanDivisionMachineTree,
} from "@/api/model/plan/division";
import { tools_objToobj } from "@/components/jrTools";
import { ref, nextTick } from "vue";

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
  if (value != null) item.id = value;
  return item.id;
};

const addComment = (cell: Array<baseObject>, i: Number, row: baseObject) => {
  cell.push({
    row: i,
    col: 6,
    comment: { value: "" },
  });
};
const afterSelected = (selected: baseObject) => {
  return;
};
const getComments = () => {
  return [6];
};
const getInitHotTable = () => {
  return {
    cmd: null,
    sortR: 0,
    children: [],
    id: "",
    code: "",
    category: "",
    name: "",
    type: "",
    unit: "",

    have: 0,
    count: 0,
    price: 0,
    combinedPrice: 0,
    taxRate: 0,
    referenceValue: 0,
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