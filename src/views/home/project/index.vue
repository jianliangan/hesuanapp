<template>
  <aj-table
    ref="ajtable"
    :MainContentPushRow="ProjectPushRow"
    :MainContentFetchList="ProjectFetchList"
    :GetTreePrimeId="getTreePrimeId"
    :GetTreePrimeName="getTreePrimeName"
    :GetFormInstance="getFormInstance"
    :OnOpenDialog="onOpenDialog"
    :OnCancelDialog="onCancelDialog"
    :HasPage="true"
    :PreSubmit="preSubmit"
    :BtnNew="true"
  >
    <template v-slot:formitem>
      <el-form :model="formInstance" label-width="120px">
        <el-form-item label="项目名称">
          <el-input v-model="formInstance.projectName" />
        </el-form-item>
        <el-form-item label="地区">
          <el-cascader
            v-model="formInstance.groupcity"
            :options="chinaAreas"
            :props="groupsProps"
            @change="cityOnChange"
          />
        </el-form-item>
        <el-form-item label="开工日期">
          <el-input v-model="formInstance.startTime" />
        </el-form-item>
        <el-form-item label="竣工日期">
          <el-input v-model="formInstance.completeTime" />
        </el-form-item>
        <el-form-item label="业主姓名">
          <el-input v-model="formInstance.username"></el-input>
        </el-form-item>
        <el-form-item label="业主性质">
          <el-input v-model="formInstance.nature"></el-input>
        </el-form-item>
        <el-form-item label="工程类别">
          <el-input v-model="formInstance.category"></el-input>
        </el-form-item>
        <el-form-item label="工程类别细项">
          <el-input v-model="formInstance.categoryDetail"></el-input>
        </el-form-item>
        <el-form-item label="项目状态">
          <el-input v-model="formInstance.status"></el-input>
        </el-form-item>
        <el-form-item label="合同额">
          <el-input v-model="formInstance.contractPrice"></el-input>
        </el-form-item>
        <el-form-item label="结算时间">
          <el-input v-model="formInstance.finalTime"></el-input>
        </el-form-item>
        <el-form-item label="预计总收入">
          <el-input v-model="formInstance.estimateIncome"></el-input>
        </el-form-item>
        <el-form-item label="预计总成本">
          <el-input v-model="formInstance.estimateCost"></el-input>
        </el-form-item>
        <el-form-item label="计税方式">
          <el-input v-model="formInstance.taxWay"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template v-slot:tableitem>
      <el-table-column prop="projectName" label="项目名称" fixed />
      <el-table-column label="省/市区">
        <template #default="scope">
          {{
            planAreas.get(scope.row.province)?.name +
            "/" +
            planAreas.get(scope.row.city)?.name +
            "/" +
            planAreas.get(scope.row.region)?.name
          }}
        </template>
      </el-table-column>

      <el-table-column prop="startTime" label="开工日期" />

      <el-table-column prop="completeTime" label="竣工日期" />
      <el-table-column prop="username" label="业主姓名" />
      <el-table-column prop="nature" label="业务性质" />
      <el-table-column prop="category" label="工程类别" />
      <el-table-column prop="categoryDetail" label="工程类别细项" />

      <el-table-column prop="status" label="项目状态" />
      <el-table-column prop="contractPrice" label="合同额" />
      <el-table-column prop="finalTime" label="结算时间" />
      <el-table-column prop="estimateIncome" label="预计总收入" />
      <el-table-column prop="estimateCost" label="预计总成本" />
      <el-table-column prop="taxWay" label="计税方式" />
    </template>
  </aj-table>
</template>

<script lang="ts" setup>
import { ProjectFetchList, ProjectPushRow } from "@/api/model/project";
import chinaAreas from "@/components/chinaareas/index";
import { tools_objToobj } from "@/components/jrTools";
import { ref, nextTick } from "vue";
interface baseObject {
  [key: string]: any;
}
const groupsProps = {
  value: "code",
  label: "name",
};
const ajtable = ref<baseObject>({});
const formInstance = ref<baseObject>({});
let projectFetchList = ProjectFetchList;
let planAreas = new Map<string, baseObject>();
function getAllAreas(
  areas: Array<baseObject>,
  result: Map<string, baseObject>
) {
  if (areas == undefined) return;
  for (let i = 0; i < areas.length; i++) {
    getAllAreas(areas[i].children, result);
    result.set(areas[i].code, { code: areas[i].code, name: areas[i].name });
  }
}
getAllAreas(chinaAreas, planAreas);
let cityOnChange = () => {
  formInstance.value.province = formInstance.value.groupcity[0];
  formInstance.value.city = formInstance.value.groupcity[1];
  formInstance.value.region = formInstance.value.groupcity[2];
};
const preSubmit = () => {
  return true;
};

let getFormInstance = (cmd: string, field: string, value: any) => {
  if (cmd == "SET") {
    if (field == "new") {
      formInstance.value = {};
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
const onOpenDialog = (type: String) => {
  if (type == "add") formInstance.value.parentId = formInstance.value.ownId;
};
const onCancelDialog = () => {
  return;
};
function PageLoaded(uri: baseObject) {
  ajtable.value.PageLoaded(uri);
}

nextTick(() => {
  PageLoaded({ ownId: "0" });
});
</script>
