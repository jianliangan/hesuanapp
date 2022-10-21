<template>
  <inventory-search ref="inventorysearch" :OnSubmit="onSubmit"></inventory-search>
  <materials-search ref="materialsSearch" :AfterSelected="materialsSelected"></materials-search>
  <aj-hot-table ref="ajhottable" :MainContentPushRow="BudgetMeasurePushRow" :MainContentFetchList="BudgetMeasureTree"
    MaxFileNums="1" MaxFileSize="20" TableKey="name" :HighlightCurrentRow="true" :BtnUpMove="true" :BtnDownMove="true"
    :BtnInsert="true" :BtnSign="true" :BtnDel="true" :BtnInsertChildren="true" :BtnNew="false"
    :GetMainPrimeId="getMainPrimeId" :GetInitHotTable="getInitHotTable" :AddComment="addComment"
    :GetComments="getComments" :AfterSelected="afterSelected" :Click="click"
    :AfterDocumentKeyDown="afterDocumentKeyDown" :AfterBeginEditing="afterBeginEditing">
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
      <hot-column width="120" data="workAmount" type="numeric" title="招标工程量" />
      <hot-column width="120" data="costUnitprice" type="numeric" :numeric-format="formatJP" title="综合单价" />
      <hot-column width="120" data="costSumprice" type="numeric" :numeric-format="formatJP" title="综合合价" />
      <hot-column width="120" data="manageUnitprice" type="numeric" :numeric-format="formatJP" title="管理费单价" />
      <hot-column width="120" data="profitUnitprice" type="numeric" :numeric-format="formatJP" title="利润单价" />
      <hot-column width="120" data="manageSumprice" type="numeric" :numeric-format="formatJP" title="管理费合价" />
      <hot-column width="120" data="profitSumprice" type="numeric" :numeric-format="formatJP" title="利润合价" />
    </template>
    <template v-slot:expendcondition>
      <el-button @click="onSearch">查询</el-button>
    </template>
  </aj-hot-table>
</template>
<script lang="ts" setup>
import numbro from "numbro";

import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.min.css";
import InventorySearch from "../../../components/inventorysearch/index.vue";
import MaterialsSearch from "../../../components/materialssearch/index.vue";
import {
  BudgetMeasurePushRow,
  BudgetMeasureTree,
} from "@/api/model/budget/measure";
import { tools_objToobj } from "@/components/jrTools";
import { ref, nextTick, defineProps, onBeforeUnmount } from "vue";

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
function scrollHancle() {
  materialsSearch.value?.SetVisible(false)
}
document.addEventListener('scroll', scrollHancle, true);
onBeforeUnmount(() => {
  document.removeEventListener(
    'scroll', scrollHancle, true
  );
})
const HotCommentIndex = [4];
registerAllModules();
var languages = require("numbro/dist/languages.min.js");
numbro.registerLanguage(languages["zh-CN"]);

const formatJP = {
  pattern: "0,0.00 $",
  culture: "ja-JP",
};
let materialsSearch = ref<baseObject>({});
let isEditting = false;
let currentColumn = -1;
const ajhottable = ref<baseObject>({});
let inventorysearch = ref<baseObject>({});
const tableData2 = ref(new Array<baseObject>());
const listUriParams = {} as baseObject;
const materialsSelected = (row: baseObject) => {
  // subPackageName
  // rows: Array<>

  let map = new Map<String, Object>();

  map.set("name", row.materialsName);
  map.set("code", row.code);
  map.set("category", row.category);
  map.set("distinction", row.distinction);
  map.set("unit", row.unit);

  console.log("iiiiiiiii", row);
  ajhottable.value.PageUpdateRows(map, row.materialsName);
};
let getMainPrimeId = (item: baseObject, value: Object) => {
  if (value != null) item.measureId = value;
  return item.measureId;
};
const afterSelected = (selected: baseObject, row, column, row2, column2) => {
  currentColumn = column;
  if (props.AfterSelected) props.AfterSelected(selected);
  isEditting = false;
  console.log("afterSelected");
  materialsSearch.value.SetVisible(false);
};
let onSubmit = (params: baseObject) => {
  tools_objToobj(params, listUriParams);
  ajhottable.value.PageLoaded(listUriParams, listUriParams.ownId);
}
let onSearch = () => {
  inventorysearch.value.PageLoaded(null, null);
}
const click = (cell: any, event: any) => {
  if (event.target.nodeName == "TD") {
    materialsSearch.value.SetVisible(false);
  }
}
const afterBeginEditing = (row, column) => {
  if (currentColumn == 4 || currentColumn == 2)
    isEditting = true;
}
const afterDocumentKeyDown = (event: any) => {
  let element = event.target;

  var current = element.parentNode
  let rect = element.getBoundingClientRect();
  console.log("afterDocumentKeyDown");
  if (isEditting) {
    materialsSearch.value.SetVisible(true);
  } else {
    return;
  }
  if (currentColumn == 4 || currentColumn == 2) {
    let tmp: baseObject = {};
    if (currentColumn == 4) {
      tmp.code = element.value;
    } else {
      tmp.materialsName = element.value;
    }
    materialsSearch.value.PageLoaded(tmp, null);
    materialsSearch.value.SetPosition(700, 300, rect.x, rect.y + rect.height);
  }
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
  tools_objToobj(uri, listUriParams);
  ajhottable.value.PageLoaded(uri, ownId);
}

// nextTick(() => {
//   PageLoaded({ rootId: "0" });
// });

defineExpose({ PageLoaded });
</script>