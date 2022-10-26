<template>
  <el-dialog v-model="dialogAddVisible" title="新增" width="50%">
    <slot name="formitem"></slot>
    <el-form-item>
      <el-button type="primary" :loading="SubMitLoading" @click="OnSubmit"><span
          v-if="dialogIsAdd == true">保存增加</span><span v-else>保存修改</span>
      </el-button>
      <el-button @click="onCancel">取消</el-button>
    </el-form-item>
  </el-dialog>

  <el-container>
    <el-header v-if="props.HasHeader == true">
      <el-space>

        <template v-if="props.BtnField == true">
          <el-popover placement="bottom-start" title="" :width="70" trigger="click">
            <template #reference>
              <el-button>显示</el-button>
            </template>

            <template #default>
              <div style="height:300px;overflow-y:auto;overflow-x: hidden;">
                <template v-for="(item, index) in userColumn" :key="index">
                  <el-checkbox v-model="item.isshow" :label="item.label" @change="selectUserColumn(item)" />
                </template>
              </div>
            </template>

          </el-popover>
        </template>

        <el-button type="primary" @click="ClkAddData" v-if="props.BtnNew == true">新增</el-button>
        <el-button type="primary" @click="ClkUpMove" v-if="props.BtnUpMove == true">上移</el-button>
        <el-button type="primary" @click="ClkDownMove" v-if="props.BtnDownMove == true">下移</el-button>
        <el-button type="primary" @click="ClkInsert" v-if="props.BtnInsert == true">插入</el-button>
        <el-button type="primary" @click="ClkSign" v-if="props.BtnSign == true">标记</el-button>
        <template v-if="props?.ImportUri != undefined && props?.ImportUri != ''">
          <el-upload :accept="props.FilesExts" :maxSize="props.MaxFileSize" :limit="1" :data="listUriParams"
            :show-file-list="false" :action="props?.ImportUri" :on-error="handleError" :on-success="handleSuccess"
            :on-change="handleChange" auto-upload>
            <el-button type="primary">导入</el-button>
          </el-upload>
        </template>
      </el-space>
    </el-header>

    <el-main>
      <el-table ref="myeltable" v-loading="loading" :data="tableData.list" :row-key="props.TableKey" border
        default-expand-all stripe height="100%" @selection-change="SelectionChange"
        :highlight-current-row="props.HighlightCurrentRow" @current-change="currentChange"
        :cell-class-name="props.CellClass">
        <slot name="tableitem"></slot>
        <template v-for="(item, index) in userColumn" :key="index">
          <el-table-column v-if="item.isshow" :column-key="item.prop" :label="item.label" :prop="item.prop"
            :width="item.width" :fixed="item.fixed" :show-overflow-tooltip="item.showOverflowTooltip">
            <template #default="scope">
              <slot :name="item.prop" v-bind="scope">
                {{ scope.row[item.prop] }}
              </slot>
            </template>
          </el-table-column>
        </template>
        <el-table-column label="操作" fixed="right" width="70" v-if="props.hasOptions == true">
          <template #default="scope">

            <el-popover placement="top-start" title="" :width="70" trigger="click">
              <template #reference>
                <el-button type="text">更多</el-button>
              </template>
              <template #default>
                <template v-if="!(props.CmdFirst == true && scope.$index == 0)">
                  <el-space direction="vertical">
                    <el-popconfirm title="确定删除吗" @confirm="DeleteRow(scope.row)" v-if="props.DefaultBtn == true">
                      <template #reference>
                        <el-button link type="primary" size="small"> 删除 </el-button>
                      </template>
                    </el-popconfirm>
                    <span v-if="props.DefaultBtn == true">
                      <el-button text type="primary" @click.stop="ClkEditData(scope.row)">编辑</el-button>
                    </span>

                    <span v-for="(item, index) in props.ExtendButtons" v-bind:key="index">
                      <el-button v-if="item.confirm == false" text type="primary" @click.stop="item.call(scope.row)">
                        {{ item.name }}
                      </el-button>
                      <el-popconfirm v-else :title="'确定' + item.name + '吗'" @confirm="item.call(scope.row)">
                        <template #reference>
                          <el-button link type="primary" size="small"> {{ item.name }} </el-button>
                        </template>
                      </el-popconfirm>
                    </span>
                  </el-space>
                </template>
              </template>
            </el-popover>

          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer v-if="HasPage == true">
      <el-pagination layout="prev, pager, next" :total="pageInfo.itemTotal" :page-size="pageInfo.pageSize" small
        background @current-change="HandleCurrentChange" />
    </el-footer>
  </el-container>
</template>
    
<script lang="ts" setup>
import { computed, nextTick, ref, watch, defineProps, defineExpose } from "vue";
import {
  tools_objToobj,
  tools_sort_map_loop,
} from "@/components/jrTools/index";

import {
  collapseContextKey,
  ElMessage,
  UploadFile,
  UploadFiles,
  UploadProps,
  UploadRawFile,
} from "element-plus";

interface baseObject {
  [key: string]: any;
}
const myeltable = ref<baseObject>({});
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

const filterText = ref("");
const showasideing = ref(false);
const mainframe = ref<baseObject>({});
let dialogAddVisible = ref(false);
const loading = ref(false);
const pageInfo = ref<baseObject>({});
let currentRow: baseObject;

const listUriParams = {} as baseObject;
const tableData = ref<baseObject>({});
const selectData = ref(new Array<baseObject>());
const userColumn = ref(new Array<baseObject>());
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
    type: String,
    default: ".xls, .xlsx",
  },
  HasTree: {
    type: Boolean,
    default: false,
  },
  HasPage: {
    type: Boolean,
    default: false,
  },

  PreSubmit: {
    type: Function,
    default: null,
  },
  PreFirstGetData: {
    type: Function,
    default: null,
  },
  TableKey: {
    type: String,
    default: "",
  },
  HighlightCurrentRow: {
    type: Boolean,
    default: true,
  },
  BtnUpMove: {
    type: Boolean,
    default: false,
  },
  BtnDownMove: {
    type: Boolean,
    default: false,
  },
  BtnInsert: {
    type: Boolean,
    default: false,
  },
  BtnSign: {
    type: Boolean,
    default: false,
  },
  BtnNew: {
    type: Boolean,
    default: false,
  },
  GetMainPrimeId: {
    type: Function,
    default: null,
  },
  PreInstanData: {
    type: Function,
    default: null,
  },
  hasOptions: {
    type: Boolean,
    default: true,
  },
  GetExtendData: {
    type: Function,
    default: null,
  },
  ExtendButtons: {
    type: Array,
    default: null,
  },
  DefaultBtn: {
    type: Boolean,
    default: true,
  },
  CmdFirst: {
    type: Boolean,
    default: false,
  },
  CellClass: {
    type: Function,
    default: null,
  },
  HasHeader: {
    type: Boolean,
    default: true,
  },
  BtnField: {
    type: Boolean,
    default: false,
  },

});
//
tableData.value.tableHeight = computed({
  get() {
    let tt = tableData.value.tablePackageHeight;

    return tt;
  },
  set() { },
});
tableData.value.tablePackageHeight = computed({
  get() {
    return mainframe.value.offsetHeight - 50 - 32 + "px";
  },
  set() { },
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
const selectUserColumn = (val: baseObject) => {
  alert();
  console.log("dddddddddddddddddd", val);
}
const HandleCurrentChange = (val: number) => {
  listUriParams.page = val;
  AfterSelected(listUriParams);
};
const handleExceed: UploadProps["onExceed"] = (files, uploadFiles) => {
  ElMessage.error(
    "文件超过限制：文件不能超过 " +
    props?.MaxFileNums +
    ",单文件大小不能超过 " +
    props?.MaxFileSize +
    "M"
  );
};

const handleChange: UploadProps["onChange"] = (
  uploadFile: UploadFile,
  uploadFiles: UploadFiles
) => {
  // const fileSuffix = uploadFile.name.substring(
  //   uploadFile.name.lastIndexOf(".") + 1
  // );
  // console.log("ggggggggggg:", uploadFile);
  // if (isSuffix) {
  //   ElMessage.error("上传文件只能是 " + whiteList + "格式");
  //   return;
  // }
  // if (isLt10M) {
  //   ElMessage.error("上传文件大小不能超过 " + props?.MaxFileSize + "MB");
  //   return;
  // }
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

const currentChange = (newRow: baseObject, oldRow: baseObject) => {
  currentRow = newRow;
  console.log("change ", newRow, oldRow);
};
const ClkAddData = () => {
  if (props.GetFormInstance) props?.GetFormInstance("SET", "new", null);
  if (props.PreInstanData && props.PreInstanData() == false) return;
  dialogIsAdd.value = true;
  getDialogAddVisible(true);

  SubMitLoading.value = false;
  if (props.OnOpenDialog) props?.OnOpenDialog("add");
};
const upAllMove = (cmd: String) => {
  if (!currentRow) {
    ElMessage.error("没有选中行");
    return;
  }
  let primeId = props.GetMainPrimeId(currentRow);
  let index = tableData.value.map.get(primeId);
  if (cmd == "up" && index == 0) return;
  if (cmd == "down" && index == tableData.value.list.length - 1) return;
  //更新数据
  let fromindex = 0;
  let toindex = 0;
  if (cmd == "up") {
    fromindex = index;
    toindex = index - 1;
  } else {
    fromindex = index;
    toindex = index + 1;
  }
  tableData.value.list[fromindex].old_sort =
    tableData.value.list[fromindex].sort;
  tableData.value.list[fromindex].old_sortR =
    tableData.value.list[fromindex].sortR;

  tableData.value.list[toindex].old_sort = tableData.value.list[toindex].sort;
  tableData.value.list[toindex].old_sortR = tableData.value.list[toindex].sortR;

  tableData.value.list[fromindex].sortR =
    tableData.value.list[toindex].old_sortR;
  tableData.value.list[fromindex].sort = tableData.value.list[toindex].old_sort;

  tableData.value.list[toindex].sortR =
    tableData.value.list[fromindex].old_sortR;

  tableData.value.list[toindex].sort = tableData.value.list[fromindex].old_sort;

  //结束

  tableData.value.list[toindex].cmd = "edit";
  tableData.value.list[fromindex].cmd = "edit";
  loading.value = true;

  props
    .MainContentPushRow([
      tableData.value.list[toindex],
      tableData.value.list[fromindex],
    ])
    .then((response: any) => {
      loading.value = false;
      tableData.value.map.set(
        props.GetMainPrimeId(tableData.value.list[toindex]),
        fromindex
      );
      tableData.value.map.set(
        props.GetMainPrimeId(tableData.value.list[fromindex]),
        toindex
      );
      tools_sort_map_loop<baseObject>(
        tableData.value.list,
        0,
        (a: baseObject): number => {
          return a.sort;
        }
      );
    })
    .catch((err: any) => {
      loading.value = false;
      //恢复状态
      tableData.value.list[fromindex].sortR =
        tableData.value.list[fromindex].old_sortR;
      tableData.value.list[toindex].sortR =
        tableData.value.list[toindex].old_sortR;

      tableData.value.list[fromindex].sort =
        tableData.value.list[fromindex].old_sort;
      tableData.value.list[toindex].sort =
        tableData.value.list[toindex].old_sort;
    });
};
const ClkUpMove = () => {
  upAllMove("up");
};
const ClkDownMove = () => {
  upAllMove("down");
};
const ClkInsert = () => {
  if (!currentRow) {
    ElMessage.error("没有选中行");
    return;
  }
  if (props.GetFormInstance) props?.GetFormInstance("SET", "new", null);
  if (props.PreInstanData && props.PreInstanData() == false) return;
  dialogIsAdd.value = true;
  getDialogAddVisible(true);

  SubMitLoading.value = false;
  if (props.OnOpenDialog) props?.OnOpenDialog("add");
};
const onCancel = () => {
  if (props.GetDialogAddVisible) props?.GetDialogAddVisible(false);
  if (props.OnCancelDialog) props?.OnCancelDialog();
  dialogAddVisible.value = false;
};
function ClkEditData(row: baseObject) {
  if (props.GetFormInstance) props?.GetFormInstance("SET", "*", row);
  if (props.PreInstanData && props.PreInstanData() == false) return;
  dialogIsAdd.value = false;
  SubMitLoading.value = false;
  getDialogAddVisible(true);

  if (props.OnOpenDialog) props?.OnOpenDialog("edit");
}

/**
 * need to change
 * api call
 */

const OnSubmit = async () => {
  if (props.PreSubmit) {
    if ((await props.PreSubmit()) == false) {
      return;
    }
  }
  console.log("55555555555  666");
  SubMitLoading.value = true;

  if (dialogIsAdd.value == true) {
    if (props.GetFormInstance) props?.GetFormInstance("SET", "cmd", "add");
  } else {
    if (props.GetFormInstance) props?.GetFormInstance("SET", "cmd", "edit");
  }
  if (props.GetFormInstance) props?.GetFormInstance("SET", "children", []);

  if (props.GetFormInstance)
    PushDataRow([props?.GetFormInstance("SELECT", "", "")]);
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
      AfterSelected(listUriParams);
      loading.value = false;
      getDialogAddVisible(false);
      SubMitLoading.value = false;
    })
    .catch((err: any) => {
      loading.value = false;
      SubMitLoading.value = false;
    });
};

/**
 * need to change
 * api call
 */
const AfterSelected = async (row: any) => {
  loading.value = true;

  if (props.MainContentFetchList)
    props
      .MainContentFetchList(row)
      .then((resdata: any) => {
        pageInfo.value.itemTotal = parseInt(resdata["itemTotal"]);
        pageInfo.value.pageSize = parseInt(resdata["pageSize"]);
        tableData.value.list = resdata["list"];
        if (props.GetExtendData) {
          props.GetExtendData(resdata["extend"]);
        }
        tableData.value.map = new Map<any, baseObject>();
        for (let i = 0; i < tableData.value.list.length; i++) {
          tableData.value.map.set(
            props.GetMainPrimeId(tableData.value.list[i]),
            i
          );
        }
        console.log("tttttttttt", tableData.value.map);
        loading.value = false;
      })
      .catch((err: any) => {
        loading.value = false;
      });
};
const ExportDataList = () => {
  return tableData.value.list;
};
const SetColumns = (columns: Array) => {
  userColumn.value.splice(0);
  for (let i = 0; i < columns.length; i++) {
    userColumn.value.push(columns[i]);
  }

}
function PageLoaded(uri: baseObject) {
  tools_objToobj(uri, listUriParams);
  AfterSelected(uri);
  //
}

defineExpose({ PageLoaded, ExportDataList, ClkEditData, DeleteRow, SetColumns });
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
  
    