<template>

  <aj-hot-table ref="ajhottable" :MainContentFetchList="ReportSearchList" MaxFileNums="1" MaxFileSize="20"
    TableKey="name" :HighlightCurrentRow="true" :BtnUpMove="false" :BtnDownMove="false" :BtnInsert="false"
    :BtnSign="false" :BtnDel="false" :BtnInsertChildren="false" :BtnNew="false" :GetMainPrimeId="getMainPrimeId"
    :GetInitHotTable="getInitHotTable" :AddComment="addComment" :GetComments="getComments"
    :AfterSelected="afterSelected" :CellDblClick="cellDblClick" :GetExtendData="getExtendData" :AllReadOnly="true">
    <template v-slot:tableitem>
      <hot-column width="0" data="id" title="" />
      <hot-column width="130" data="name" title="名称" />
      <hot-column width="150" data="subject" title="成本科目" />
      <hot-column width="120" data="code" title="编码" />
      <hot-column width="120" data="category" title="类别" />

      <hot-column width="120" data="distinction" title="项目特征" />
      <hot-column width="120" data="unit" title="单位" />
      <hot-column width="90" data="have" type="numeric" title="含量" />
      <hot-column width="90" data="workAmount" type="numeric" title="招标工程量" />
      <hot-column width="90" data="costUnitprice" type="numeric" numeric-format="formatJP" title="综合单价" />
      <hot-column width="90" data="costSumprice" type="numeric" numeric-format="formatJP" title="综合合价" />
      <hot-column width="90" data="manageUnitprice" type="numeric" numeric-format="formatJP" title="管理费单价" />
      <hot-column width="90" data="profitUnitprice" type="numeric" numeric-format="formatJP" title="利润单价" />
      <hot-column width="90" data="manageSumprice" type="numeric" numeric-format="formatJP" title="管理费合价" />
      <hot-column width="90" data="profitSumprice" type="numeric" numeric-format="formatJP" title="利润合价" />
    </template>
    <template v-slot:expendcondition>

      <el-select v-model="searchsubject" filterable placeholder="成本科目">
        <el-option v-for="item in subjectOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-input v-model="searchcode" placeholder="编码" />

      <el-select v-model="searchcategory" filterable placeholder="类别">
        <el-option v-for="item in categoryOptions" :key="item" :label="item" :value="item" />
      </el-select>

      <el-input v-model="searchdistinction" placeholder="项目特征" />
      <el-button @click="ClkSign">搜索</el-button>
    </template>
  </aj-hot-table>
</template>
<script lang="ts" setup>
import numbro from "numbro";

import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.min.css";
import { MaterialsPushRow, MaterialsList } from "@/api/model/dict/materials";
import { ReportSearchList } from "@/api/model/report/search";
import { hottableSettings } from "../../../components/common";

import { tools_objToobj } from "@/components/jrTools";
import { ref, nextTick, defineProps } from "vue";


let searchsubject = ref("");
let searchcode = ref("");
let searchcategory = ref("");
let searchdistinction = ref("");
let categoryOptions = ref([]);
let subjectOptions = ref([]);
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
const getMainNameMaterials = (item: baseObject) => {
  return item.materialsName;
};
const ClkSign = () => {

  // let searchsubject = ref("");
  // let searchcode = ref("");
  // let searchcategory = ref("");
  // let searchdistinction = ref("");
  let uri: baseObject = {};
  uri.subject = searchsubject.value;
  uri.code = searchcode.value;
  uri.category = searchcategory.value;
  uri.distinction = searchdistinction.value;
  ajhottable.value.PageLoaded(uri, 0);
}
const cellDblClick = (cell: any, event: any) => {
}
const clkOk1 = (rows: Array<baseObject>) => {
  // subPackageName
  // rows: Array<>
  let row = rows[0];
  let map = new Map<String, Object>();
  map.set("materialsId", row.materialsId);
  map.set("materialsName", row.materialsName);

  ajhottable.value.PageUpdateRows(map, row.materialsName);
};
let getMainPrimeId = (item: baseObject, value: Object) => {
  if (value != null) item.id = value;
  return item.id;
};
let getExtendData = (value: any) => {
  let hottable = ajhottable.value.GetSettings();

  let divisionarray = hottableSettings(hottable, value);
  UpdateData(divisionarray[0], divisionarray[1]);
};
function UpdateData(subjectSource: any, categorySource: any) {
  categoryOptions.value.splice(0);
  subjectOptions.value.splice(0);

  for (let i = 0; i < subjectSource.length; i++) {
    subjectOptions.value.push(subjectSource[i]);
  }
  for (let i = 0; i < categorySource.length; i++) {
    categoryOptions.value.push(categorySource[i]);
  }
}
const afterSelected = (selected: baseObject, row, column, row2, column2) => {
  if (props.AfterSelected) props.AfterSelected(selected);
};
const addComment = (cell: Array<baseObject>, i: Number, row: baseObject) => {
  cell.push({
    row: i,
    col: 1,
    comment: { value: row.projectName },
  }, {
    row: i,
    col: 2,
    comment: { value: row.name },
  }, {
    row: i,
    col: 6,
    comment: { value: row.distinction },
  });
};
const getComments = () => {
  return [1, 2, 6];
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
function PageLoaded(uri: baseObject) {
  ajhottable.value.PageLoaded(uri, 0);
}

// nextTick(() => {
//   PageLoaded({ rootId: "0" }, 0);
// });

defineExpose({ PageLoaded });
</script>