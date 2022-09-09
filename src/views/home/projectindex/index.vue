<template>
  <el-dialog v-model="dialogAddVisible" title="新增" width="50%">
    <el-form :model="formInstance" label-width="120px">
      <el-form-item label="项目id">
        <el-input v-model="formInstance.projectId" disabled />
      </el-form-item>
      <el-form-item label="项目名称">
        <el-input v-model="formInstance.projectName" disabled />
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="formInstance.nodeName" />
      </el-form-item>
      <el-form-item label="序号">
        <el-input v-model="formInstance.sort" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="formInstance.comment" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :loading="SubMitLoading" @click="OnSubmit"
          ><span v-if="dialogIsAdd == true">保存增加</span
          ><span v-else>保存修改</span>
        </el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-container>
    <el-aside width="200px" v-loading="showasideing">
      <el-container>
        <el-header>
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText"
            clearable
          ></el-input>
        </el-header>
        <el-main class="nopadding">
          <el-tree
            ref="mytree"
            node-key="projectId"
            :highlight-current="true"
            :data="organizedata"
            :props="groupsProps"
            @node-click="leftRowClick"
          ></el-tree>
        </el-main>
      </el-container>
    </el-aside>
    <el-container>
      <el-main class="nopadding">
        <el-button type="primary" @click="ClkAddData">新增</el-button>

        <div ref="mainframe" :style="{ height: '100%', overflow: 'hidden' }">
          <div
            class="scTable-table"
            :style="{ height: tableData.tablePackageHeight }"
          >
            <el-table
              v-loading="loading"
              :data="tableData.list"
              row-key="nodeName"
              border
              default-expand-all
              stripe
              :height="tableData.tableHeight"
              @selection-change="SelectionChange"
            >
              <el-table-column prop="nodeName" label="名称" />
              <el-table-column prop="sort" label="序号" />
              <el-table-column prop="comment" label="备注" />

              <el-table-column label="操作" fixed="right" width="150">
                <template #default="scope">
                  <el-popconfirm
                    title="确定删除吗"
                    @confirm="DeleteRow(scope.row)"
                  >
                    <template #reference>
                      <el-button link type="primary" size="small">
                        删除
                      </el-button>
                    </template>
                  </el-popconfirm>
                  <span>
                    <el-button
                      text
                      type="primary"
                      @click.stop="ClkEditData(scope.row)"
                      >编辑</el-button
                    >
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
  
  <script lang="ts" setup>
import { computed, nextTick, ref, watch } from "vue";
import {
  tools_objToobj,
  tools_sort_map_loop,
} from "@/components/jrTools/index";
/**
 * need to change
 * api call
 */
//import chinaAreas from '@/components/chinaareas/index'
/**
 * need to change
 * api call
 */
import {
  ProjectIndexFetchList,
  ProjectIndexPushRow,
} from "@/api/model/projectindex";
import { ElMessage } from "element-plus";
import { ProjectFetchList } from "@/api/model/project";
interface baseObject {
  [key: string]: any;
}
const groupsProps = {
  value: "projectId",
  label: "projectName",
  emitPath: false,
  checkStrictly: true,
};
let planAreas = ref(new Map<string, baseObject>());
const organizedata = ref(new Array<baseObject>());
let organizedata2 = new Array<any>();
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
/**
 * need to change
 * api call
 */
//getAllAreas(chinaAreas, planAreas.value)

// do not use same name with ref
const mytree = ref<baseObject>("");
const filterText = ref("");
const showasideing = ref(false);
const mainframe = ref<baseObject>({});
const dialogAddVisible = ref(false);
const dialogIsAdd = ref(true);
const loading = ref(false);
const pageInfo = ref<baseObject>({});
const SubMitLoading = ref(false);
const formInstance = ref<baseObject>({});
const listUriParams = {} as baseObject;
const tableData = ref<baseObject>({});
const selectData = ref(new Array<baseObject>());
//
tableData.value.tableHeight = computed({
  get() {
    let tt = tableData.value.tablePackageHeight;

    return tt;
  },
  set() {},
});
tableData.value.tablePackageHeight = computed({
  get() {
    return mainframe.value.offsetHeight - 50 - 32 + "px";
  },
  set() {},
});
watch(filterText, (newValue, oldValue) => {
  organizedata.value = organizedata2.filter((data) => {
    if (newValue) {
      return data.projectName.toLowerCase().includes(newValue);
    } else {
      return true;
    }
  });
  // var allNode = { id: "", projectName: "所有项目" };
  // organizedata.value.unshift(allNode);
});
const FetchProjectDataList = async (row: any) => {
  showasideing.value = true;

  console.log("aaaaaaaaaa");

  ProjectFetchList(row)
    .then((response: any) => {
      organizedata.value = organizedata2 = response["list"];

      // var allNode = { projectId: "", projectName: "所有项目" };

      // organizedata.value.unshift(allNode);
      nextTick(() => {
        mytree.value!.setCurrentKey(organizedata.value[0].projectId);
        listUriParams.projectId = organizedata.value[0].projectId;

        FetchDataList(listUriParams);
      });
      showasideing.value = false;
    })
    .catch((err: any) => {
      showasideing.value = false;
    });
};

//event handles
const leftRowClick = (data: any) => {
  if (
    data.projectId == 0 ||
    data.projectId == undefined ||
    data.projectId == ""
  )
    return;
  listUriParams.projectId = data.projectId;
  FetchDataList(listUriParams);
};
const ClkAddData = () => {
  let curNode = mytree.value!.getCurrentNode();
  if (curNode != null) {
    formInstance.value.projectId = curNode.projectId;
    formInstance.value.projectName = curNode.projectName;
    if (
      curNode.projectId == 0 ||
      curNode.projectId == "" ||
      curNode.projectId == undefined
    )
      return;
  } else {
    return;
  }
  dialogIsAdd.value = true;
  dialogAddVisible.value = true;
  SubMitLoading.value = false;
};

function ClkEditData(row: baseObject) {
  tools_objToobj(row, formInstance.value);
  let curNode = mytree.value!.getCurrentNode();
  if (curNode != null) {
    formInstance.value.projectId = curNode.projectId;
    formInstance.value.projectName = curNode.projectName;
    if (
      curNode.projectId == 0 ||
      curNode.projectId == "" ||
      curNode.projectId == undefined
    )
      return;
  } else {
    return;
  }
  dialogIsAdd.value = false;
  SubMitLoading.value = false;
  dialogAddVisible.value = true;
  /**
   * need to change
   * api call
   */
  //formInstance.value.groupcity = [formInstance.value.province, formInstance.value.city, formInstance.value.region]
}
const onCancel = () => {
  dialogAddVisible.value = false;
};

/**
 * need to change
 * api call
 */
let cityOnChange = () => {
  formInstance.value.province = formInstance.value.groupcity[0];
  formInstance.value.city = formInstance.value.groupcity[1];
  formInstance.value.region = formInstance.value.groupcity[2];
};
const OnSubmit = () => {
  SubMitLoading.value = true;
  if (dialogIsAdd.value == true) {
    formInstance.value.cmd = "add";
  } else {
    formInstance.value.cmd = "edit";
  }
  formInstance.value.children = [];
  //console.log(",,,,,,,,,,,,,,,,", formInstance.value.province)
  PushDataRow([formInstance.value]);
};
function SelectionChange(selection: Array<baseObject>) {
  console.log(selection);
  selectData.value = selection;
}
function DeleteRow(row: any) {
  row.cmd = "delete";
  row.children = [];
  PushDataRow([row]);
}

const PushDataRow = async (body: any) => {
  loading.value = true;
  ProjectIndexPushRow(body)
    .then((response: any) => {
      FetchDataList(listUriParams);
      loading.value = false;
      dialogAddVisible.value = false;
    })
    .catch((err: any) => {
      loading.value = false;
    });
};
/**
 * need to change
 * api call
 */
const FetchDataList = async (row: any) => {
  loading.value = true;
  ProjectIndexFetchList(row)
    .then((resdata: any) => {
      pageInfo.value.itemTotal = parseInt(resdata["itemTotal"]);
      pageInfo.value.pageSize = parseInt(resdata["pageSize"]);
      tableData.value.list = resdata["list"];
      loading.value = false;
    })
    .catch((err: any) => {
      loading.value = false;
    });
};
function PageLoaded() {
  FetchProjectDataList(listUriParams);
  //
}
PageLoaded();
</script>
  <style scoped>
.scTable-table {
  height: calc(100% - 50px);
}

.scTable-page {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
}
</style>

  