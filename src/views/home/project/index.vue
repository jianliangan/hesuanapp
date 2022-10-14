<template>

  <aj-table ref="ajtable" :MainContentPushRow="ProjectPushRow" :MainContentFetchList="ProjectFetchList"
    :GetFormInstance="getFormInstance" :OnOpenDialog="onOpenDialog" :OnCancelDialog="onCancelDialog" :HasPage="true"
    :PreSubmit="preSubmit" :BtnNew="true" :ExtendButtons="[{call:boRedirect,name:'单位工程',confirm:false}]">
    <template v-slot:formitem>



      <el-form :model="formInstance" ref="formEl" label-width="120px" :rules="rules">
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="formInstance.projectName" />
        </el-form-item>
        <el-form-item label="地区" prop="groupcity">

          <el-cascader v-model="formInstance.groupcity" :options="chinaAreas" :props="groupsProps"
            @change="cityOnChange" />
        </el-form-item>

        <el-form-item label="开工日期" prop="startTime">
          <el-date-picker v-model="formInstance.startTime" format="YYYY/MM/DD" value-format="YYYY-MM-DD" type="date"
            placeholder="" size="default" />

        </el-form-item>
        <el-form-item label="竣工日期" prop="completeTime">
          <el-date-picker v-model="formInstance.completeTime" format="YYYY/MM/DD" value-format="YYYY-MM-DD" type="date"
            placeholder="" size="default" />

        </el-form-item>
        <el-form-item label="业主姓名" prop="username">
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
        <el-form-item label="结算时间" prop="finalTime">
          <el-date-picker v-model="formInstance.finalTime" format="YYYY/MM/DD" value-format="YYYY-MM-DD" type="date"
            placeholder="" size="default" />

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
import { ProjectFetchList, ProjectPushRow } from "@/api/model/home/project";
import chinaAreas from "@/components/chinaareas/index";
import { tools_objToobj } from "@/components/jrTools";
import { ref, nextTick, reactive } from "vue";
import { useRouter } from 'vue-router'
import type { FormRules } from 'element-plus'

interface baseObject {
  [key: string]: any;
}
////////////////

////////////////
const groupsProps = {
  value: "code",
  label: "name",
};
const ajtable = ref<baseObject>({});
const router = useRouter();
const formInstance = ref<baseObject>({});

const formEl = ref<baseObject>({});
let projectFetchList = ProjectFetchList;
let planAreas = new Map<string, baseObject>();

const rules = reactive<FormRules>({
  projectName: [
    { required: true, message: '必填项', trigger: 'blur' },
  ],
  groupcity: [
    { required: true, message: '必填项', trigger: 'blur' },
  ],
  username: [
    { required: true, message: '必填项', trigger: 'blur' },
  ],
  startTime: [
    {
      type: 'date',
      required: true,
      message: '必填项',
      trigger: 'change',
    },
  ],
  completeTime: [
    {
      type: 'date',
      required: true,
      message: '必填项',
      trigger: 'change',
    },
  ],
  finalTime: [
    {
      type: 'date',
      required: true,
      message: '必填项',
      trigger: 'change',
    },
  ],

  // type: [
  //   {
  //     type: 'array',
  //     required: true,
  //     message: 'Please select at least one activity type',
  //     trigger: 'change',
  //   },
  // ],

})
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
const preSubmit = async () => {

  if (!formEl.value) return false;
  return await formEl.value.validate((valid: any, fields: any) => {
    if (valid) {
      return true;
    } else {
      return false;
    }
  })
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
const boRedirect = (row: baseObject) => {
  router.replace({
    path: '/home/projectindex',
    // name: 'index',
    query: {
      ownId: row.projectId,
      rootId: row.projectId,
      cmd: "self"
    }
  });
};

const onOpenDialog = (type: String) => {
  if (type == "add") formInstance.value.parentId = formInstance.value.ownId;
};
const onCancelDialog = () => {
  return;
};
function PageLoaded(uri: baseObject, ownId: Object) {
  ajtable.value.PageLoaded(uri, ownId);
}

nextTick(() => {
  PageLoaded({ ownId: "0" });
});
</script>
