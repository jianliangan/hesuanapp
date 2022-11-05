<template>
  <aj-hot-table ref="ajhottable" :MainContentFetchList="ReportSubpackageTree" MaxFileNums="1" MaxFileSize="20"
    TableKey="name" :HighlightCurrentRow="true" :BtnUpMove="false" :BtnDownMove="false" :BtnInsert="false"
    :BtnSign="false" :BtnDel="false" :BtnInsertChildren="false" :BtnNew="false" :GetMainPrimeId="getMainPrimeId"
    :GetInitHotTable="getInitHotTable" :AddComment="addComment" :GetComments="getComments"
    :AfterSelected="afterSelected" :NestedHeaders="nestedHeaders" :SuplyReadOnly="true" :AllReadOnly="true">
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
      <aj-select-input ref="projectSelect" :MainContentFetchList="ProjectFetchList"
        :GetMainPrimeId="getProjectSelectMainPrimeId" :GetMainName="getProjectSelectMainName"
        :ItemSelect="projectItemSelect"></aj-select-input>
    </template>
  </aj-hot-table>
</template>
<script lang="ts" setup>
import numbro from "numbro";

import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.min.css";
import { ProjectFetchList, ProjectPushRow } from "@/api/model/home/project";

import { ReportSubpackageTree } from "@/api/model/report/subpackage";
import { tools_objToobj } from "@/components/jrTools";
import { ref, nextTick, defineProps } from "vue";

interface baseObject {
  [key: string]: any;
}
let projectSelect = ref<baseObject>({});
const props = defineProps({
  AfterSelected: {
    type: Function,
    default: null,
  },
});
const listUriParams = {} as baseObject;
/**
 * left tree
 */
const projectItemSelect = (value: String) => {
  listUriParams.projectId = value;
  ajhottable.value.PageLoaded(listUriParams, value);
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
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    { label: "实际", colspan: 3 },
    { label: "计划", colspan: 3 },
    "",
    "",
    "",
    "",
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
  if (value != null) item.divisionId = value;
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
  // ;
}

// nextTick(() => {
//   PageLoaded({ rootId: "0" });
// });

defineExpose({ PageLoaded });
</script>
<style>

</style>