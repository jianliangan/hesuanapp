
<template>
  <el-container>
    <el-aside ref="menu" class="ajtree">
      <aj-Tree ref="ajtree" :LeftTreeFetchList="ProjectFetchList" :GroupsProps="groupsProps"
        :GetTreePrimeName="getTreePrimeName" :AfterSelected="afterSelected" :GetTreePrimeId="getTreePrimeId"
        class="adminui">
      </aj-Tree>
      <div class="adminui-side-bottom left-right" @click="a">
        <el-icon class="">
          <!-- <el-icon-expand v-if="menuIsCollapse" />
            <el-icon-fold v-else /> -->
          <CaretLeft class="jianto2" />
          <!-- <CaretRight /> -->
        </el-icon>
      </div>

    </el-aside>


    <aj-table ref="ajtable" :MainContentPushRow="ProjectPushRow" :MainContentFetchList="ProjectFetchTree"
      :GetFormInstance="getFormInstance" :OnOpenDialog="onOpenDialog" :OnCancelDialog="onCancelDialog"
      :PreSubmit="preSubmit" :TableKey="tableKey" :BtnNew="true" :PreInstanData="preInstanData">
      <template v-slot:formitem>
        <el-form :model="formInstance" label-width="120px">
          <el-form-item label="项目id">
            <el-input v-model="formInstance.ownId" disabled />
          </el-form-item>
          <el-form-item label="项目名称">
            <el-input v-model="formInstance.ownName" disabled />
          </el-form-item>
          <el-form-item label="上级名称">
            <el-cascader v-model="formInstance.parentId" :options="tableData2" :props="groupsProps2" clearable />
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="formInstance.projectName" />
          </el-form-item>
          <el-form-item label="序号">
            <el-input v-model="formInstance.sort" />
          </el-form-item>
        </el-form>
      </template>
      <template v-slot:tableitem>
        <el-table-column prop="projectName" label="名称" />
        <el-table-column prop="sort" label="序号" />
      </template>
    </aj-table>
  </el-container>
</template>


<script lang="ts" setup >
import {
  ProjectFetchList,
  ProjectPushRow,
  ProjectFetchTree,
} from "@/api/model/home/project";
import { CaretLeft, CaretRight } from "@element-plus/icons-vue";
import { tools_objToobj } from "@/components/jrTools";
import { ElMessage } from "element-plus";
import { ref, nextTick } from "vue";

interface baseObject {
  [key: string]: any;
}


/**
 * tree
 */
const ajtree = ref<baseObject>({});
const groupsProps = {
  value: "projectId",
  label: "projectName",
  emitPath: false,
  checkStrictly: true,
};
function a() {
  setTimeout(() => {
    var ev = new Event("pagecontentCollapse", { "bubbles": true, "cancelable": true });
    document.dispatchEvent(ev);
  }, 300);
  const className = document.getElementsByClassName('el-aside ajtree')[0];
  const inputa = document.getElementsByClassName('el-input__wrapper')[0];
  const jianto = document.getElementsByClassName('jianto2')[0];
  if (className.offsetWidth == 200) {
    className.style.width = "20px";
    inputa.style.display = "none";
    jianto.style.transform = "rotate(180deg)";
  } else {
    className.style.width = "200px";
    inputa.style.display = "";
    jianto.style.transform = "";
  }
}

let getTreePrimeId = (item: baseObject, value: Object) => {
  if (value != null) item.projectId = value;

  return item.projectId;
};
let getTreePrimeName = (item: baseObject, value: Object) => {
  if (value != null) item.projectName = value;
  return item.projectName;
};

const afterSelected = (selected: baseObject) => {
  //链接右侧
  ajtable.value.PageLoaded({
    ownId: selected.projectId,
    rootId: selected.projectId,
  });
};
/**
 * main
 */

const ajtable = ref<baseObject>({});
const formInstance = ref<baseObject>({});

const tableKey = "projectName";
const tableData2 = ref(new Array<baseObject>());
const groupsProps2 = {
  value: "projectId",
  label: "projectName",
  emitPath: false,
  checkStrictly: true,
};
const onOpenDialog = (type: String) => {
  tableData2.value = ajtable.value.ExportDataList();
};

const preInstanData = () => {
  let treenode = ajtree.value.GetCurrentNode();
  if (!treenode) return false;
  formInstance.value.ownId = treenode.projectId;
  formInstance.value.ownName = treenode.projectName;
  return true;
};
const preSubmit = () => {
  console.log("ccccccccc", formInstance.value);
  if (
    formInstance.value.parentId &&
    formInstance.value.parentId == formInstance.value.projectId
  ) {
    ElMessage.error("上级节点不能等于自己");
    return false;
  }
  if (!formInstance.value.parentId) {
    formInstance.value.parentId = formInstance.value.ownId;
  }
  return true;
};
const onCancelDialog = () => {
  return;
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

function PageLoaded(uri: baseObject) {
  ajtree.value.PageLoaded(uri);
}

nextTick(() => {
  PageLoaded({ ownId: "0" });
});
</script>

<style>
element.style {
  --el-aside-width: 0px;
}

.adminui {
  height: 92.6%;
}

.ajtree {
  width: 200px;
}

/* .nopadding{
  display: none;
} */
/* .left-right svg{
  transform: rotate(90deg);
} */
</style>
