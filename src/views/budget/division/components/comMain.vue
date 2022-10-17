<template>
  <inventory-search ref="inventorysearch" :OnSubmit="onSubmit"></inventory-search>
  <div style="height: 300px">
    <materials-search ref="materialsSearch" :AfterSelected="materialsSelected"></materials-search>

    <aj-hot-table ref="ajhottable" :MainContentPushRow="BudgetDivisionPushRow"
      :MainContentFetchList="BudgetDivisionTree"
      :ImportUri="appContext.config.globalProperties.$CONFIG.API_URL+'/budget/import/'" MaxFileNums="1" MaxFileSize="20"
      TableKey="name" :HighlightCurrentRow="true" :BtnUpMove="true" :BtnDownMove="true" :BtnInsert="true"
      :BtnSign="true" :BtnDel="true" :BtnInsertChildren="true" :BtnNew="false" :GetMainPrimeId="getMainPrimeId"
      :GetInitHotTable="getInitHotTable" :AddComment="addComment" :GetComments="getComments"
      :AfterSelected="afterSelected" :Click="click" :AfterDocumentKeyDown="afterDocumentKeyDown"
      :AfterBeginEditing="afterBeginEditing">
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
  </div>
</template>
<script lang="ts" setup>
import numbro from "numbro";


import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.min.css";
import { MaterialsPushRow, MaterialsList } from "@/api/model/dict/materials";
import InventorySearch from "../../../components/inventorysearch/index.vue";

import MaterialsSearch from "../../../components/materialssearch/index.vue";
import {
  BudgetDivisionPushRow,
  BudgetDivisionTree,
} from "@/api/model/budget/division";
import { tools_objToobj } from "@/components/jrTools";
import { ref, nextTick, defineProps, getCurrentInstance } from "vue";
const { appContext } = getCurrentInstance();
let materialsSearch = ref<baseObject>({});
let inventorysearch = ref<baseObject>({});
const listUriParams = {} as baseObject;
let currentColumn = -1;
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
document.addEventListener('scroll', function (e) { materialsSearch.value?.SetVisible(false) }, true);
const HotCommentIndex = [4];
registerAllModules();
var languages = require("numbro/dist/languages.min.js");
numbro.registerLanguage(languages["zh-CN"]);
const ui_dialog_visible = ref(false);

const formatJP = {
  pattern: "0,0.00 $",
  culture: "ja-JP",
};
const ajhottable = ref<baseObject>({});

const tableData2 = ref(new Array<baseObject>());

// const manufacturerData = [
//   { name: "BMW", country: "Germany", owner: "Bayerische Motoren Werke AG" },
//   { name: "Chrysler", country: "USA", owner: "Chrysler Group LLC" },
//   { name: "Nissan", country: "Japan", owner: "Nissan Motor Company Ltd" },
//   { name: "Suzuki", country: "Japan", owner: "Suzuki Motor Corporation" },
//   { name: "Toyota", country: "Japan", owner: "Toyota Motor Corporation" },
//   { name: "Volvo", country: "Sweden", owner: "Zhejiang Geely Holding Group" },
// ];

// const columSetting = {
//   title: "编码",
//   type: "handsontable",
//   handsontable: {
//     colHeaders: ["Marque", "Country", "Parent company"],
//     autoColumnSize: true,
//     data: manufacturerData,
//     getValue() {
//       const selection = this.getSelectedLast();
//       // Get the manufacturer name of the clicked row and ignore header
//       // coordinates (negative values)
//       return this.getSourceDataAtRow(Math.max(selection[0], 0)).name;
//     },
//   },
// };
let onSubmit = (params: baseObject) => {
  tools_objToobj(params, listUriParams);
  ajhottable.value.PageLoaded(listUriParams, listUriParams.ownId);
}
let onSearch = () => {
  inventorysearch.value.PageLoaded(null, null);
}

const getMainNameMaterials = (item: baseObject) => {
  return item.materialsName;
};
const click = (cell: any, event: any) => {
  if (event.target.nodeName == "TD") {
    materialsSearch.value.SetVisible(false);
  }
}
const afterBeginEditing = (row, column) => {
  if (currentColumn == 4 || currentColumn == 2)
    materialsSearch.value.SetVisible(false);
}
const afterDocumentKeyDown = (event: any) => {
  let element = event.target;

  var current = element.parentNode
  let rect = element.getBoundingClientRect();

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
const materialsSelected = (row: baseObject) => {
  // subPackageName
  // rows: Array<>

  let map = new Map<String, Object>();

  map.set("name", row.materialsName);
  map.set("code", row.code);
  map.set("category", row.category);
  map.set("distinction", row.distinction);
  map.set("unit", row.unit);


  ajhottable.value.PageUpdateRows(map, row.materialsName);
};
let getMainPrimeId = (item: baseObject, value: Object) => {
  if (value != null) item.divisionId = value;
  return item.divisionId;
};
const afterSelected = (selected: baseObject, row, column, row2, column2) => {
  currentColumn = column;
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
window.onscroll = function () {

}
defineExpose({ PageLoaded });
</script>