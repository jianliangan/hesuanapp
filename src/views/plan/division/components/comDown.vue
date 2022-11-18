<template>
  <!-- <aj-select-dialog ref="selectDialog" :MainContentFetchList="SubPackageList" :ClkOk="clkOk1" :GetMainName="getMainName"
    Title="分包商"></aj-select-dialog> -->
  <aj-subpackage-pop ref="selectDialog" Title="分包商列表" :AfterSelected="clkOk1"></aj-subpackage-pop>
  <aj-supplyunit-pop ref="selectDialog2" Title="供应商列表" :AfterSelected="clkOk2"></aj-supplyunit-pop>
  <!-- <aj-select-dialog ref="selectDialog2" :MainContentFetchList="SupplyUnitList" :ClkOk="clkOk2"
    :GetMainName="getMainName2" Title="供应商"></aj-select-dialog> -->
  <aj-hot-table ref="ajhottable" :MainContentPushRow="PlanDivisionMachinePushRow"
    :MainContentFetchList="PlanDivisionMachineTree" MaxFileNums="1" MaxFileSize="20" TableKey="name"
    :HighlightCurrentRow="true" :BtnUpMove="true" :BtnDownMove="true" :BtnInsert="false" :BtnDel="true" :BtnSign="true"
    :BtnNew="false" :GetMainPrimeId="getMainPrimeId" :GetInitHotTable="getInitHotTable" :AddComment="addComment"
    :GetComments="getComments" :AfterSelected="afterSelected" :CellDblClick="cellDblClick" :AutoSelectFirst="false"
    :GetExtendData="getExtendData" :BtnOneInsert="true" :Changed="changed">
    <template v-slot:tableitem>
      <hot-column width="0" data="id" title="" />
      <hot-column width="120" data="code" title="编码" />
      <hot-column width="120" data="category" type="dropdown" title="类别" />
      <hot-column width="310" data="name" title="名称" />

      <hot-column width="120" data="type" title="规格型号" />
      <hot-column width="120" data="unit" type="dropdown" title="单位" />
      <hot-column width="120" data="subPackageName" title="分包商" />
      <hot-column width="120" data="supplyUnitName" title="供应商" />
      <hot-column width="90" data="have" title="含量" />
      <hot-column width="90" data="count" type="numeric" title="数量" />
      <hot-column width="90" data="price" type="numeric" numeric-format="formatJP" title="市场价" />
      <hot-column width="90" data="combinedPrice" type="numeric" numeric-format="formatJP" title="合价" />
      <hot-column width="90" data="taxRate" type="numeric" title="税率" />
      <hot-column width="90" data="referenceValue" type="numeric" title="参考值" />
    </template>
  </aj-hot-table>
</template>
<script lang="ts" setup>
import numbro from "numbro";

import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.min.css";
import { hottableSettingsMachine } from "../../../components/common";
import AjSubpackagePop from "../../../components/subpackagePop/index.vue";
import AjSupplyunitPop from "../../../components/supplyunitPop/index.vue";
import { SupplyUnitList } from "@/api/model/dict/supplyunit";
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
let selectDialog = ref<baseObject>({});

let getExtendData = (value: any) => {
  let hottable = ajhottable.value.GetSettings();
  let divisionarray = hottableSettingsMachine(hottable, value);

  selectDialog2.value.UpdateData(divisionarray[1]);
};
let changed = () => {
  //发送事件
  var ev = new Event("MyComdownChange");
  document.dispatchEvent(ev);
}
const clkOk1 = (row: baseObject) => {
  // subPackageName
  // rows: Array<>

  let map = new Map<String, Object>();
  map.set("subPackageId", row.subPackageId);

  ajhottable.value.PageUpdateRows(map, row.subPackageName);
};
let selectDialog2 = ref<baseObject>({});

const clkOk2 = (row: baseObject) => {
  // subPackageName
  // rows: Array<>

  let map = new Map<String, Object>();
  map.set("supplyUnitId", row.supplyUnitId);
  ajhottable.value.PageUpdateRows(map, row.supplyUnitName);
};
const cellDblClick = (cell: any, event: any) => {
  if (cell[1] == 6) selectDialog.value.PageLoaded("", null);
  if (cell[1] == 7) selectDialog2.value.PageLoaded("", null);
};
const HotCommentIndex = [4];
registerAllModules();

const ajhottable = ref<baseObject>({});

const tableData2 = ref(new Array<baseObject>());
let getMainPrimeId = (item: baseObject, value: Object) => {
  if (value) item.id = value;
  return item.id;
};

const addComment = (cell: Array<baseObject>, i: Number, row: baseObject) => {
  cell.push({
    row: i,
    col: 6,
    comment: { value: "" },
  });
};
const afterSelected = (selected: baseObject, row, column, row2, column2) => {
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
    subPackageId: "",
    subPackageName: "",
    supplyUnitId: "",
    supplyUnitName: "",
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