<template>
  <inventory-search ref="inventorysearch" :OnSubmit="onSubmit"></inventory-search>
  <materials-search ref="selectDiv" :AfterSelected="materialsSelected"></materials-search>
  <aj-hot-table ref="ajhottable" :MainContentPushRow="PlanDivisionPushRow" :MainContentFetchList="PlanDivisionTree"
    ImportUri="http://localhost:8001/plan/import/" MaxFileNums="1" MaxFileSize="20" TableKey="name"
    :HighlightCurrentRow="true" :BtnUpMove="true" :BtnDownMove="true" :BtnInsert="true" :BtnSign="true" :BtnDel="true"
    :BtnInsertChildren="true" :BtnNew="false" :GetMainPrimeId="getMainPrimeId" :GetInitHotTable="getInitHotTable"
    :AddComment="addComment" :GetComments="getComments" :AfterSelected="afterSelected" :Click="click"
    :AfterDocumentKeyDown="afterDocumentKeyDown">
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
      <hot-column width="120" data="workAmount" type="numeric" title="招标工程量" />
      <hot-column width="120" data="budgetWorkAmount" type="numeric" title="预算工程量" />
      <hot-column width="120" data="costUnitprice" type="numeric" :numeric-format="formatJP" title="成本单价" />
      <hot-column width="120" data="costSumprice" type="numeric" :numeric-format="formatJP" title="成本合价" />
      <hot-column width="120" data="costManprice" type="numeric" :numeric-format="formatJP" title="成本人工费" />
      <hot-column width="120" data="costMaterialsprice" type="numeric" :numeric-format="formatJP" title="成本材料费" />
      <hot-column width="120" data="costMechanicsprice" type="numeric" :numeric-format="formatJP" title="成本机械费" />
      <hot-column width="120" data="costDeviceprice" type="numeric" :numeric-format="formatJP" title="成本设备费" />
      <hot-column width="120" data="costSubpackageprice" type="numeric" :numeric-format="formatJP" title="专业分包费" />
    </template><template v-slot:expendcondition>
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
import { ProjectFetchTree } from "@/api/model/home/project";
import {
  PlanDivisionPushRow,
  PlanDivisionTree,
} from "@/api/model/plan/division";
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
let selectDiv = ref<baseObject>({});
const HotCommentIndex = [4];
registerAllModules();
var languages = require("numbro/dist/languages.min.js");
numbro.registerLanguage(languages["zh-CN"]);
document.addEventListener('scroll', function (e) { selectDiv.value.SetVisible(false) }, true);
const formatJP = {
  pattern: "0,0.00 $",
  culture: "ja-JP",
};
const ajhottable = ref<baseObject>({});
const listUriParams = {} as baseObject;
let inventorysearch = ref<baseObject>({});
const tableData2 = ref(new Array<baseObject>());
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
  if (value != null) item.divisionId = value;
  return item.divisionId;
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
    selectDiv.value.SetVisible(false);
  }
}
const afterDocumentKeyDown = (event: any) => {
  let element = event.target;

  var current = element.parentNode
  let rect = element.getBoundingClientRect();


  selectDiv.value.PageLoaded("", null);
  selectDiv.value.SetPosition(700, 300, rect.x, rect.y + rect.height);
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
    workAmount: 0,
    budgetWorkAmount: 0,

    costUnitprice: 0,
    costSumprice: 0,
    costManprice: 0,
    costMaterialsprice: 0,
    costMechanicsprice: 0,
    costDeviceprice: 0,
    costSubpackageprice: 0,
    sort: 0,
    ownId: "",
    parentId: "",
  };
};
/**
 * this api
 */
function PageLoaded(uri: baseObject) {
  tools_objToobj(uri, listUriParams);
  ajhottable.value.PageLoaded(uri);
}

// nextTick(() => {
//   PageLoaded({ rootId: "0" });
// });

defineExpose({ PageLoaded });
</script>