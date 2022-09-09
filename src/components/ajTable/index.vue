<template>
  <el-dialog v-model="dialogAddVisible" title="新增" width="50%">
    <slot name="formitem"></slot>
    <el-form-item>
      <el-button type="primary" :loading="SubMitLoading" @click="OnSubmit"
        ><span v-if="dialogIsAdd == true">保存增加</span
        ><span v-else>保存修改</span>
      </el-button>
      <el-button @click="onCancel">取消</el-button>
    </el-form-item>
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
            :props="props.GroupsProps"
            @node-click="leftRowClick"
          ></el-tree>
        </el-main>
      </el-container>
      <slot></slot>
    </el-aside>
    <el-container>
      <el-main class="nopadding">
        <el-space>
          <el-button type="primary" @click="ClkAddData">新增</el-button>
          <template
            v-if="props.ImportUri != undefined && props.ImportUri != ''"
          >
            <el-upload
              :action="props.ImportUri"
              multiple
              :on-exceed="handleExceed"
              :on-error="handleError"
              :on-success="handleSuccess"
              :on-change="handleChange"
            >
              <el-button type="primary">导入</el-button>
            </el-upload>
          </template>
        </el-space>
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
              <slot name="tableitem"></slot>

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
import { computed, nextTick, ref, watch, defineProps, defineExpose } from "vue";
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
  ElMessage,
  UploadFile,
  UploadFiles,
  UploadProps,
  UploadRawFile,
} from "element-plus";

interface baseObject {
  [key: string]: any;
}
const SubMitLoading = ref(false);
const dialogIsAdd = ref(true);
let planAreas = ref(new Map<string, baseObject>());
const organizedata = ref(new Array<baseObject>());
let organizedata2 = new Array<any>();
let getDialogAddVisible = (value: any) => {
  if (value != null) dialogAddVisible.value = value;
  return dialogAddVisible.value;
};
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
let dialogAddVisible = ref(false);
const loading = ref(false);
const pageInfo = ref<baseObject>({});

const listUriParams = {} as baseObject;
const tableData = ref<baseObject>({});
const selectData = ref(new Array<baseObject>());
const props = defineProps({
  MainContentFetchList: {
    type: Function,
    default: null,
  },
  LeftTreeFetchList: {
    type: Function,
    default: null,
  },
  MainContentPushRow: {
    type: Function,
    default: null,
  },
  GetTreePrimeId: {
    type: Function,
    default: null,
  },
  GetTreePrimeName: {
    type: Function,
    default: null,
  },
  GroupsProps: {
    type: Object,
    required: true,
  },
  GetDialogAddVisible: {
    type: Function,
    default: null,
  },
  GetFormInstance: {
    type: Function,
    default: null,
  },
  OnOpenDialog: {
    type: Function,
    default: null,
  },
  OnCancelDialog: {
    type: Function,
    default: null,
  },
  ImportUri: {
    type: String,
    default: "",
  },
  MaxFileNums: {
    type: Number,
    default: 0,
  },
  MaxFileSize: {
    type: Number,
    default: 0,
  },
  FilesExts: {
    type: Array,
    default: undefined,
  },
});
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
      return props
        .GetTreePrimeName(data, null)
        .toLowerCase()
        .includes(newValue);
    } else {
      return true;
    }
  });
});
const handleExceed: UploadProps["onExceed"] = (files, uploadFiles) => {
  ElMessage.error(
    "文件超过限制：文件不能超过 " +
      props.MaxFileNums +
      ",单文件大小不能超过 " +
      props.MaxFileSize +
      "M"
  );
};

const handleChange: UploadProps["onChange"] = (
  uploadFile: UploadFile,
  uploadFiles: UploadFiles
) => {
  const fileSuffix = uploadFile.name.substring(
    uploadFile.name.lastIndexOf(".") + 1
  );
  const whiteList = props.WhiteList;
  const isSuffix = whiteList.indexOf(fileSuffix.toLowerCase()) === -1;
  const isLt10M = uploadFile?.size / 1024 / 1024 > props.MaxFileSize;
  console.log("ggggggggggg:", uploadFile);
  if (isSuffix) {
    ElMessage.error("上传文件只能是 " + whiteList + "格式");
    return;
  }
  if (isLt10M) {
    ElMessage.error("上传文件大小不能超过 " + props.MaxFileSize + "MB");
    return;
  }
};
const handleSuccess: UploadProps["onSuccess"] = (
  error: Error,
  uploadFile: UploadFile,
  uploadFiles: UploadFiles
) => {
  ElMessage.success("导入成功");
};
const handleError: UploadProps["onError"] = (
  error: Error,
  uploadFile: UploadFile,
  uploadFiles: UploadFiles
) => {
  ElMessage.error("发生错误：" + error);
};
const FetchLeftTreeDataList = async (row: any) => {
  showasideing.value = true;

  props
    .LeftTreeFetchList(row)
    .then((response: any) => {
      organizedata.value = organizedata2 = response["list"];

      nextTick(() => {
        mytree.value!.setCurrentKey(
          props.GetTreePrimeId(organizedata.value[0], null)
        );
        props.GetTreePrimeId(
          listUriParams,
          props.GetTreePrimeId(organizedata.value[0], null)
        );

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
    props.GetTreePrimeId(data) == 0 ||
    props.GetTreePrimeId(data) == undefined ||
    props.GetTreePrimeId(data) == ""
  )
    return;
  props.GetTreePrimeId(listUriParams, props.GetTreePrimeId(data, null));
  FetchDataList(listUriParams);
};
const ClkAddData = () => {
  let curNode = mytree.value!.getCurrentNode();
  props.GetFormInstance("SET", "new", null);
  if (curNode != null) {
    props.GetFormInstance(
      "SET",
      "primeid",
      props.GetTreePrimeId(curNode, null)
    );

    props.GetFormInstance("SET", "name", props.GetTreePrimeName(curNode, null));

    if (
      props.GetTreePrimeId(curNode, null) == 0 ||
      props.GetTreePrimeId(curNode, null) == "" ||
      props.GetTreePrimeId(curNode, null) == undefined
    )
      return;
  } else {
    return;
  }
  dialogIsAdd.value = true;
  getDialogAddVisible(true);

  SubMitLoading.value = false;
  props.OnOpenDialog();
};
const onCancel = () => {
  props.GetDialogAddVisible(false);
  props.OnCancelDialog();
};
function ClkEditData(row: baseObject) {
  props.GetFormInstance("SET", "*", row);
  //tools_objToobj(row, props.FormInstance.value);
  let curNode = mytree.value!.getCurrentNode();
  if (curNode != null) {
    props.GetFormInstance(
      "SET",
      "primeid",
      props.GetTreePrimeId(curNode, null)
    );
    // props.GetTreePrimeId(
    //   props.FormInstance.value,
    //   props.GetTreePrimeId(curNode, null)
    // );
    props.GetFormInstance("SET", "name", props.GetTreePrimeName(curNode, null));
    // props.GetTreePrimeName(
    //   props.FormInstance.value,
    //   props.GetTreePrimeName(curNode, null)
    // );
    if (
      props.GetTreePrimeId(curNode, null) == 0 ||
      props.GetTreePrimeId(curNode, null) == "" ||
      props.GetTreePrimeId(curNode, null) == undefined
    )
      return;
  } else {
    return;
  }
  dialogIsAdd.value = false;
  SubMitLoading.value = false;
  getDialogAddVisible(true);
  props.OnOpenDialog();
}

/**
 * need to change
 * api call
 */

const OnSubmit = () => {
  SubMitLoading.value = true;
  if (dialogIsAdd.value == true) {
    props.GetFormInstance("SET", "cmd", "add");
    //props.FormInstance.value?.cmd = "add";
  } else {
    props.GetFormInstance("SET", "cmd", "edit");
    //props.FormInstance.value?.cmd = "edit";
  }
  props.GetFormInstance("SET", "children", []);
  // props.FormInstance.value.children = [];

  PushDataRow([props.GetFormInstance("SELECT", "", "")]);
};
function SelectionChange(selection: Array<baseObject>) {
  selectData.value = selection;
}
function DeleteRow(row: any) {
  row.cmd = "delete";
  row.children = [];
  PushDataRow([row]);
}

const PushDataRow = async (body: any) => {
  loading.value = true;
  props
    .MainContentPushRow(body)
    .then((response: any) => {
      FetchDataList(listUriParams);
      loading.value = false;
      getDialogAddVisible(false);
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
  if (props != undefined && props.MainContentFetchList != undefined) {
    props
      .MainContentFetchList(row)
      .then((resdata: any) => {
        pageInfo.value.itemTotal = parseInt(resdata["itemTotal"]);
        pageInfo.value.pageSize = parseInt(resdata["pageSize"]);
        tableData.value.list = resdata["list"];
        loading.value = false;
      })
      .catch((err: any) => {
        loading.value = false;
      });
  }
};
const ExportDataList = () => {
  return tableData.value.list;
};
function PageLoaded() {
  FetchLeftTreeDataList(listUriParams);
  //
}
PageLoaded();
defineExpose({ ExportDataList });
type functree = (query: any) => any;
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
  
    