<template>
  <inventory-search ref="inventorysearch" :OnSubmit="onSubmit" AddLabel="确定" Title="其他条件"></inventory-search>
  <aj-hot-table ref="ajhottable" :MainContentFetchList="ReportSubpackageTree" MaxFileNums="1" MaxFileSize="20"
    TableKey="name" :HighlightCurrentRow="true" :BtnUpMove="false" :BtnDownMove="false" :BtnInsert="false"
    :BtnSign="false" :BtnDel="false" :BtnInsertChildren="false" :BtnNew="false" :GetMainPrimeId="getMainPrimeId"
    :GetInitHotTable="getInitHotTable" :AddComment="addComment" :GetComments="getComments"
    :AfterSelected="afterSelected" :NestedHeaders="nestedHeaders" :SuplyReadOnly="true" :GetExtendData="getExtendData"
    :AllReadOnly="true">
    <template v-slot:tableitem>
      <hot-column width="0" data="divisionId" title="" />
      <hot-column width="310" data="projectName" title="项目相关" />
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
      <hot-column width="90" data="workAmount2" type="numeric" title="招标工程量" />
      <hot-column width="90" data="costUnitprice2" type="numeric" numeric-format="formatJP" title="综合单价" />
      <hot-column width="90" data="costSumprice2" type="numeric" numeric-format="formatJP" title="综合合价" />
      <hot-column width="90" data="manageUnitprice" type="numeric" numeric-format="formatJP" title="管理费单价" />
      <hot-column width="90" data="profitUnitprice" type="numeric" numeric-format="formatJP" title="利润单价" />
      <hot-column width="90" data="manageSumprice" type="numeric" numeric-format="formatJP" title="管理费合价" />
      <hot-column width="90" data="profitSumprice" type="numeric" numeric-format="formatJP" title="利润合价" />
    </template>
    <template v-slot:expendcondition>
      <aj-select-input ref="projectSelect" :SelectFirst="true" :MainContentFetchList="ProjectFetchList"
        :GetMainPrimeId="getProjectSelectMainPrimeId" Placeholder="请选择项目" :GetMainName="getProjectSelectMainName"
        :ItemSelect="itemSelectedPro">
      </aj-select-input>
      <aj-select-input ref="subpackageSelect" :SelectFirst="true" Placeholder="请选择分包商"
        :MainContentFetchList="SubPackageList" :GetMainPrimeId="getTreePrimeId" :GetMainName="getTreePrimeName"
        :ItemSelect="itemSelectedSub"></aj-select-input>


      <el-button @click="onSearchAdvanced">
        其他条件
      </el-button>

      <el-button ref="refSearch" @click="onSearch">搜索</el-button>
    </template>
  </aj-hot-table>
</template>
<script lang="ts" setup>
import numbro from "numbro";

import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.min.css";
import { ProjectFetchList, ProjectPushRow } from "@/api/model/home/project";
import InventorySearch from "../../../components/inventorysearch/index.vue";
import { SubPackageList } from "@/api/model/dict/subpackage";
import { ReportSubpackageTree } from "@/api/model/report/subpackage";
import { tools_objToobj } from "@/components/jrTools";
import { ref, nextTick, defineProps } from "vue";
import { hottableSettings } from "../../../components/common";
interface baseObject {
  [key: string]: any;
}
let projectSelect = ref<baseObject>({});
let subpackageSelect = ref<baseObject>({});
let inventorysearch = ref<baseObject>({});
const props = defineProps({
  AfterSelected: {
    type: Function,
    default: null,
  },
});
const listUriParams = {} as baseObject;
let limitedNum = 2;
const categoryArray = ref([]);
const subjectArray = ref([]);
const refSearch = ref({});
let getExtendData = (value: any) => {
  let hottable = ajhottable.value.GetSettings();
  let divisionarray = hottableSettings(hottable, value);
  inventorysearch.value.UpdateData(divisionarray[0], divisionarray[1]);
};
let onSubmit = (params: baseObject) => {
  tools_objToobj(params, listUriParams);
  //ajhottable.value.PageLoaded(listUriParams, listUriParams.ownId);
}
/**
 * left tree
 */
const onSearch = (value: any) => {
  let project = projectSelect.value.GetValue();
  let subpackage = subpackageSelect.value.GetValue();
  listUriParams.projectId = project;
  listUriParams.subPackageId = subpackage;

  ajhottable.value.PageLoaded(listUriParams, 0);
};
let onSearchAdvanced = () => {
  inventorysearch.value.PageLoaded(null, null);
}
const itemSelectedPro = (selected: baseObject) => {
  limitedNum--;
  if (limitedNum == 0) {
    refSearch.value.$el.click();
  }
};
const itemSelectedSub = (selected: baseObject) => {
  limitedNum--;
  if (limitedNum == 0) {
    refSearch.value.$el.click();
  }
};
const getTreePrimeId = (item: baseObject, value: Object) => {
  if (value) item.subPackageId = value;

  return item.subPackageId;
};
const getTreePrimeName = (item: baseObject, value: Object) => {
  if (value) item.subPackageName = value;
  return item.subPackageName;
};
const getProjectSelectMainPrimeId = (item: baseObject) => {
  return item.projectId;
};
const getProjectSelectMainName = (item: baseObject) => {
  return item.projectName;
};
/**
 * right main
 */
const nestedHeaders = [
  [
    { label: "基本信息", colspan: 9 },
    { label: "实际", colspan: 3 },
    { label: "计划", colspan: 3 },
    { label: "其他信息", colspan: 4 },
  ],
  [
    "",
    "项目相关",
    "名称",
    "成本科目",
    "编码",
    "类别",
    "项目特征",
    "单位",
    "含量",
    "招标工程量",
    "综合单价",
    "综合合价",
    "招标工程量",
    "综合单价",
    "综合合价",
    "管理费单价",
    "利润单价",
    "管理费合价",
    "利润合价",
  ],
];
const HotCommentIndex = [4];
registerAllModules();

const ajhottable = ref<baseObject>({});

const tableData2 = ref(new Array<baseObject>());

let getMainPrimeId = (item: baseObject, value: Object) => {
  if (value) item.divisionId = value;
  return item.divisionId;
};
const afterSelected = (selected: baseObject, row, column, row2, column2) => {
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
    workAmount2: 0,
    costUnitprice2: 0,
    costSumprice2: 0,
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
  tools_objToobj(uri, listUriParams);
  projectSelect.value.PageLoaded(uri);
  subpackageSelect.value.PageLoaded(uri);
  // ;
}

// nextTick(() => {
//   PageLoaded({ rootId: "0" });
// });

defineExpose({ PageLoaded });
</script>
<style>

</style>