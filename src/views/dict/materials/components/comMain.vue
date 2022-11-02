<template>
  <mater-search ref="matersearch" :OnSubmit="onSubmit"></mater-search>
  <aj-table ref="ajtable" :MainContentPushRow="MaterialsPushRow" :MainContentFetchList="MaterialsList"
    :GetFormInstance="getFormInstance" :GetExtendData="getExtendData" :OnOpenDialog="onOpenDialog"
    :OnCancelDialog="onCancelDialog" :HasPage="true" :PreSubmit="preSubmit" :BtnNew="true" :BtnField="true"
    myWidth="600px">
    <template v-slot:formitem>
      <el-form :model="formInstance" id="myelform" ref="formEl" :rules="rules">
        <div class="elrowbox">
          <el-row>
            <el-col span="12">
              <el-form-item label="材料名称" prop="materialsName">
                <el-input v-model="formInstance.materialsName" />
              </el-form-item>
            </el-col>
            <el-col span="12">
              <el-form-item label="编码" prop="code">
                <el-input v-model="formInstance.code" />

              </el-form-item>
            </el-col>
          </el-row>


          <el-row>
            <el-col span="12">
              <el-form-item label="科目">
                <el-select v-model="formInstance.subject" placeholder="选择">
                  <el-option v-for="item in subjectList" :key="item.dictName" :label="item.dictName"
                    :value="item.dictName" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col span="12">
              <el-form-item label="分类">
                <el-select v-model="formInstance.category" placeholder="选择">
                  <el-option v-for="item in categoryList" :key="item.dictName" :label="item.dictName"
                    :value="item.dictName" />
                </el-select>
              </el-form-item>

            </el-col>
          </el-row>

          <el-row>
            <el-col span="12">
              <el-form-item label="单位">
                <el-input v-model="formInstance.unit"></el-input>
              </el-form-item>
            </el-col>
            <el-col span="12">

              <el-form-item label="状态">
                <el-select v-model="formInstance.status" placeholder="选择">
                  <el-option v-for="item in statusList" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>

            </el-col>
          </el-row>
          <el-row>
            <el-col span="24" distinction>
              <el-form-item label="特征" prop="username">
                <el-input type="textarea" v-model="formInstance.distinction"></el-input>
              </el-form-item>
            </el-col>

          </el-row>
        </div>

      </el-form>
    </template>
    <template v-slot:tableitem>
    </template>
    <template v-slot:expendBtns>
      <el-button type="primary" @click="onSearch">
        查询</el-button>
    </template>
  </aj-table>
</template>

<script lang="ts" setup>
import { MaterialsPushRow, MaterialsList } from "@/api/model/dict/materials";
import MaterSearch from "../../../components/matersearch/index.vue";
import { tools_objToobj } from "@/components/jrTools";
import { ref, nextTick, reactive } from "vue";
import { useRouter } from 'vue-router'
import type { FormRules } from 'element-plus'

interface baseObject {
  [key: string]: any;
}
////////////////

////////////////

const ajtable = ref<baseObject>({});
const router = useRouter();
const formInstance = ref<baseObject>({});
let matersearch = ref<baseObject>({});
const formEl = ref<baseObject>({});
const listUriParams = {} as baseObject;


const rules = reactive<FormRules>({
  materialsName: [
    { required: true, message: '必填项', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '必填项', trigger: 'blur' },
  ],


})
let onSubmit = (params: baseObject) => {
  tools_objToobj(params, listUriParams);
  ajtable.value.PageLoaded(listUriParams, listUriParams.ownId);
}
let onSearch = () => {
  matersearch.value.PageLoaded(null, null);
}
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

let statusList = ref([]);
let subjectList = ref([]);
let categoryList = ref([]);
let getExtendData = (value: any) => {
  let list = value["list"];
  subjectList.value = value["extend"].subject;
  categoryList.value = value["extend"].category;
  statusList.value = value["extend"].statusl;

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
let userColumn = [
  {
    label: "材料名称",
    prop: "materialsName",
    width: "310",
    showOverflowTooltip: true,
    fixed: true,
    isshow: true,
  },
  {
    label: "编码",
    prop: "code",
    width: "150",
    showOverflowTooltip: true,
    fixed: false,
    isshow: true,
  },
  {
    label: "科目",
    prop: "subject",
    width: "90",
    showOverflowTooltip: true,
    fixed: false,
    isshow: true,
  },
  {
    label: "特征",
    prop: "distinction",
    width: "120",
    showOverflowTooltip: true,
    fixed: false,
    isshow: true,
  },
  {
    label: "分类",
    prop: "category",
    width: "70",
    showOverflowTooltip: true,
    fixed: false,
    isshow: true,
  },
  {
    label: "单位",
    prop: "unit",
    width: "150",
    showOverflowTooltip: true,
    fixed: false,
    isshow: true,
  },
  {
    label: "状态",
    prop: "status",
    width: "90",
    showOverflowTooltip: true,
    fixed: false,
    isshow: true,
  },
  {
    label: "操作者",
    prop: "createByName",
    width: "150",
    showOverflowTooltip: true,
    fixed: false,
    isshow: true,
  },
  {
    label: "创建时间",
    prop: "createTime",
    width: "100",
    showOverflowTooltip: true,
    fixed: false,
    isshow: true,
  },
  {
    label: "更新时间",
    prop: "updateTime",
    width: "100",
    showOverflowTooltip: true,
    fixed: false,
    isshow: true,
  },


];

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
  ajtable.value.SetColumns(userColumn);
  PageLoaded({ ownId: "0" });
});
</script>
<style scoped>
.elrowbox {
  width: 560px;
  text-align: right;
}

.el-col {
  padding-left: 15px;
  width: 280px
}

.el-col[distinction] {
  width: 100%;
}
</style>