<template>
  <aj-hot-table
    ref="ajtable"
    :HasTree="true"
    :LeftTreeFetchList="ProjectFetchTree"
    :MainContentPushRow="BudgetDivisionPushRow"
    :MainContentFetchList="BudgetDivisionTree"
    :GetTreePrimeId="getTreePrimeId"
    :GetTreePrimeName="getTreePrimeName"
    :GroupsProps="groupsProps"
    :GetFormInstance="getFormInstance"
    :OnOpenDialog="onOpenDialog"
    :OnCancelDialog="onCancelDialog"
    ImportUri="http://localhost:8001/budget/import/"
    MaxFileNums="1"
    MaxFileSize="20"
    :PreSubmit="preSubmit"
    :TreeSelectNode="treeSelectNode"
    :PreFirstGetData="preFirstGetData"
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
  >
    <template v-slot:formitem>
      <el-form :model="formInstance" label-width="120px">
        <el-form-item label="成本科目">
          <el-input v-model="formInstance.subject" />
        </el-form-item>
        <el-form-item label="编码">
          <el-input v-model="formInstance.code" />
        </el-form-item>

        <el-form-item label="类别">
          <el-input v-model="formInstance.category" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="formInstance.name" />
        </el-form-item>
        <el-form-item label="项目特征">
          <el-input v-model="formInstance.distinction" />
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="formInstance.unit" />
        </el-form-item>
        <el-form-item label="含量">
          <el-input v-model="formInstance.have" />
        </el-form-item>
        <el-form-item label="招标工程量">
          <el-input v-model="formInstance.workAmount" />
        </el-form-item>
        <el-form-item label="综合单价">
          <el-input v-model="formInstance.synthesisUnitprice" />
        </el-form-item>
        <el-form-item label="综合合价">
          <el-input v-model="formInstance.synthesisSumprice" />
        </el-form-item>
        <el-form-item label="管理费单价">
          <el-input v-model="formInstance.manageUnitprice" />
        </el-form-item>
        <el-form-item label="利润单价">
          <el-input v-model="formInstance.profitUnitprice" />
        </el-form-item>
        <el-form-item label="管理费合价">
          <el-input v-model="formInstance.manageSumprice" />
        </el-form-item>
        <el-form-item label="利润合价">
          <el-input v-model="formInstance.profitSumprice" />
        </el-form-item>
      </el-form>
    </template>

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
      <hot-column
        width="120"
        data="workAmount"
        type="numeric"
        title="招标工程量"
      />
      <hot-column
        width="120"
        data="synthesisUnitprice"
        type="numeric"
        :numeric-format="formatJP"
        title="综合单价"
      />
      <hot-column
        width="120"
        data="synthesisSumprice"
        type="numeric"
        :numeric-format="formatJP"
        title="综合合价"
      />
      <hot-column
        width="120"
        data="manageUnitprice"
        type="numeric"
        :numeric-format="formatJP"
        title="管理费单价"
      />
      <hot-column
        width="120"
        data="profitUnitprice"
        type="numeric"
        :numeric-format="formatJP"
        title="利润单价"
      />
      <hot-column
        width="120"
        data="manageSumprice"
        type="numeric"
        :numeric-format="formatJP"
        title="管理费合价"
      />
      <hot-column
        width="120"
        data="profitSumprice"
        type="numeric"
        :numeric-format="formatJP"
        title="利润合价"
      />
    </template>
  </aj-hot-table>
</template>

<script lang="ts" setup>
import numbro from "numbro";

import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.min.css";

import { ProjectFetchTree } from "@/api/model/project";
import {
  BudgetDivisionPushRow,
  BudgetDivisionTree,
} from "@/api/model/budget/division";
import { tools_objToobj } from "@/components/jrTools";
import { ref } from "vue";
const HotCommentIndex = [4];
registerAllModules();
var languages = require("numbro/dist/languages.min.js");
numbro.registerLanguage(languages["zh-CN"]);

interface baseObject {
  [key: string]: any;
}

const groupsProps2 = {
  value: "indexId",
  label: "nodeName",
  emitPath: false,
  checkStrictly: true,
};
const formatJP = {
  pattern: "0,0.00 $",
  culture: "ja-JP",
};
const ajtable = ref<baseObject>({});
const formInstance = ref<baseObject>({});
const tableData2 = ref(new Array<baseObject>());
let getMainPrimeId = (item: baseObject, value: Object) => {
  if (value != null) item.divisionId = value;
  return item.divisionId;
};
let getTreePrimeId = (item: baseObject, value: Object) => {
  if (value != null) item.projectId = value;

  return item.projectId;
};
const preFirstGetData = (requestlist: baseObject) => {
  requestlist.rootId = "0";
};
let treeSelectNode = (requestvar: baseObject, treenode: baseObject) => {
  delete requestvar.rootId;
  requestvar.ownId = treenode.ownId;
  requestvar.selectId = treenode.projectId;
};

let getTreePrimeName = (item: baseObject, value: Object) => {
  if (value != null) item.projectName = value;
  return item.projectName;
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
    synthesisUnitprice: 0,
    synthesisSumprice: 0,
    manageUnitprice: 0,
    profitUnitprice: 0,
    manageSumprice: 0,
    profitSumprice: 0,
    sort: 0,
    ownId: "",
    parentId: "",
  };
};
const preSubmit = () => {
  return true;
};
let getFormInstance = (cmd: string, field: string, value: any) => {
  if (cmd == "SET") {
    if (field == "new") {
      formInstance.value = {};
    } else if (field == "primeid") {
      formInstance.value.divisionId = value;
    } else if (field == "name") {
      formInstance.value.projectName = value;
    } else if (field == "*") {
      tools_objToobj(value, formInstance.value);
    } else if (field == "cmd") {
      formInstance.value.cmd = value;
    } else if (field == "children") {
      formInstance.value.children = value;
    }
    return null;
  } else {
    return formInstance.value;
  }
};
const groupsProps = {
  value: "projectId",
  label: "projectName",
  emitPath: false,
  checkStrictly: true,
};
const onOpenDialog = (type: String) => {
  if (!formInstance.value.parentId)
    formInstance.value.parentId = formInstance.value.ownId;
  tableData2.value = ajtable.value.ExportDataList();
};
const onCancelDialog = () => {
  return;
};
</script>
