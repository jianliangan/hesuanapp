<template>
  <aj-table
    ref="ajtable"
    :HasTree="true"
    :LeftTreeFetchList="ProjectFetchTree"
    :MainContentPushRow="BudgetDivisionPushRow"
    :MainContentFetchList="BudgetDivisionList"
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
      <el-table-column prop="sortR" label="序号" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="subject" label="成本科目" />
      <el-table-column prop="code" label="编码" />
      <el-table-column prop="category" label="类别" />

      <el-table-column prop="distinction" label="项目特征" />
      <el-table-column prop="unit" label="单位" />
      <el-table-column prop="have" label="含量" />
      <el-table-column prop="workAmount" label="招标工程量" />
      <el-table-column prop="synthesisUnitprice" label="综合单价" />
      <el-table-column prop="synthesisSumprice" label="综合合价" />
      <el-table-column prop="manageUnitprice" label="管理费单价" />
      <el-table-column prop="profitUnitprice" label="利润单价" />
      <el-table-column prop="manageSumprice" label="管理费合价" />
      <el-table-column prop="profitSumprice" label="利润合价" />
    </template>
  </aj-table>
</template>

<script lang="ts" setup>
import { ProjectFetchTree } from "@/api/model/project";
import {
  BudgetDivisionPushRow,
  BudgetDivisionList,
} from "@/api/model/budget/division";
import { tools_objToobj } from "@/components/jrTools";
import { ref } from "vue";
interface baseObject {
  [key: string]: any;
}
const groupsProps2 = {
  value: "indexId",
  label: "nodeName",
  emitPath: false,
  checkStrictly: true,
};
const ajtable = ref<baseObject>({});
const formInstance = ref<baseObject>({});
const tableData2 = ref(new Array<baseObject>());
let getMainPrimeId = (item: baseObject) => {
  return item.divisionId;
};
let getTreePrimeId = (item: baseObject, value: Object) => {
  if (value != null) item.projectId = value;

  return item.projectId;
};
const preFirstGetData = (requestlist: baseObject) => {
  requestlist.rootId = 0;
};
let treeSelectNode = (requestvar: baseObject, treenode: baseObject) => {
  requestvar.rootId = "";
  requestvar.projectId = treenode.projectId;
};

let getTreePrimeName = (item: baseObject, value: Object) => {
  if (value != null) item.projectName = value;
  return item.projectName;
};
const preSubmit = () => {
  return true;
};
let getFormInstance = (cmd: string, field: string, value: any) => {
  if (cmd == "SET") {
    if (field == "new") {
      formInstance.value = {};
    } else if (field == "primeid") {
      formInstance.value.projectId = value;
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
  console.log("ddddddddddd", tableData2.value);
};
const onCancelDialog = () => {
  return;
};
</script>
