<template>

  <el-dialog v-model="dialogAddVisible" :title="myTitle" :width="props.myWidth" v-if="props.UseWithDialog==true">
    <slot name="formitem"></slot>
    <div style="text-align:right">
      <el-button type="primary" :loading="SubMitLoading" @click="OnSubmit"><span
          v-if="dialogIsAdd == true">保存增加</span><span v-else>保存修改</span>
      </el-button>
      <el-button @click="onCancel">取消</el-button>
    </div>
  </el-dialog>

  <el-container>
    <el-header v-if="props.HasHeader == true">
      <el-space>

        <template v-if="props.BtnField == true">
          <el-popover placement="bottom-start" title="" :width="70" trigger="click">
            <template #reference>
              <el-button style="border: #ebebeb 0.5px solid;">显示</el-button>
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
        <template v-if="props.UseWithDialog == true && props.SaveBtn == true">
          <el-button type="primary" @click="ClkAddData" style="border: #ebebeb 0.5px solid;">
            新增</el-button>
        </template>
        <template v-else-if="props.SaveBtn == true">

          <el-space>
            <slot name="formitem"></slot>
            <el-button type="primary" :loading="SubMitLoading" @click="OnSubmit">
              修改</el-button>
            <el-button type="primary" :loading="SubMitLoading" @click="OnSubmitAdd">增加
            </el-button>
          </el-space>

        </template>
        <slot name="expendBtns"></slot>

      </el-space>
      <slot name="expendcondition"></slot>
    </el-header>

    <el-main>
      <div v-bind:style="props.Style">
        <el-table ref="myeltable" el-table-aj v-loading="loading" height="100%" :data="tableData.list"
          :row-key="props.TableKey" border stripe @selection-change="SelectionChange"
          :highlight-current-row="props.HighlightCurrentRow" @current-change="currentChange"
          :cell-class-name="props.CellClass" :row-style="props.RowStyle">
          <slot name="tableitem"></slot>
          <template v-for="(item, index) in userColumn" :key="index">
            <el-table-column v-if="item.isshow" :column-key="item.prop" :label="item.label" :prop="item.prop"
              :width="item.width" :fixed="item.fixed" :show-overflow-tooltip="item.showOverflowTooltip"
              default-expand-all>
              <template #default="scope">
                <slot :name="item.prop" v-bind="scope">
                  {{ scope.row[item.prop] }}
                </slot>
              </template>
            </el-table-column>
          </template>
          <el-table-column label="操作" fixed="right" :width="props.OptionsWidth" v-if="props.hasOptions == true">
            <template #default="scope" v-if="props.OptionType == 'expand'">

              <el-popover placement="top-start" title="" :width="70" trigger="click">
                <template #reference>
                  <el-button type="text">更多</el-button>
                </template>
                <template #default>
                  <template v-if="!(props.CmdFirst == true && scope.$index == 0)">
                    <el-space direction="vertical">
                      <el-popconfirm title="确定删除吗" @confirm="DeleteRow(scope.row)" v-if="props.DefaultBtn == true">
                        <template #reference>
                          <el-button link type="primary"> 删除 </el-button>
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
            <template #default="scope" v-else>




              <template v-if="!(props.CmdFirst == true && scope.$index == 0)">
                <el-space>
                  <el-popconfirm title="确定删除吗" @confirm="DeleteRow(scope.row)" v-if="props.DefaultBtn == true">
                    <template #reference>
                      <el-button link type="primary" size="small"> 删除 </el-button>
                    </template>
                  </el-popconfirm>
                  <span v-if="props.DefaultBtn == true">
                    <el-button text type="primary" size="small" @click.stop="ClkEditData(scope.row)">编辑</el-button>
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
          </el-table-column>
        </el-table>
      </div>
    </el-main>
    <el-footer v-if="HasPage == true">

      <el-pagination layout="prev, pager, next,total" :total="itemTotal" :page-size="pageSize" small background
        @current-change="HandleCurrentChange" @size-change="handleSizeChange" />
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
const itemTotal = ref(0);
const pageSize = ref(0);
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
  UseWithDialog: {
    type: Boolean,
    default: true,
  },
  Style: {
    type: String,
    default: "height:100%",
  },
  OptionType: {
    type: String,
    default: "expand"
  },
  OptionsWidth: {
    type: String,
    default: "70"
  },
  SaveBtn: {
    type: Boolean,
    default: true
  },
  myWidth: {
    type: String,
    default: "50%"
  },
  AfterSelected: {
    type: Function,
    default: null,
  },
  RowStyle: {
    type: Function,
    default: null,
  }
});
//
const addlabel = "新增";
const editlabel = "修改";


let myTitle = computed(() => {
  let tt = dialogIsAdd.value == true ? addlabel : editlabel;

  return tt;
})
// computed({
//   myTitle() {
//     let tt = dialogIsAdd.value == true ? addlabel : editlabel;
//     return tt;
//   }
// get() {
//   let tt = dialogIsAdd.value == true ? addlabel : editlabel;

//   return tt;
// },
// set() { },
// });
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
const GetTitle = () => {
  if (dialogIsAdd.value == true) {
    return "新增";
  } else {
    return "修改"
  }
}
const selectUserColumn = (val: baseObject) => {

}
const handleSizeChange = (val: number) => { }
const HandleCurrentChange = (val: number) => {
  listUriParams.page = val;
  LoadData(listUriParams);
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



const currentChange = (newRow: baseObject, oldRow: baseObject) => {
  currentRow = newRow;
  if (props.AfterSelected)
    props.AfterSelected(currentRow);
};
const ClkAddData = () => {
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
const OnSubmitAdd = () => {
  dialogIsAdd.value = true;
  OnSubmit();
}
const OnSubmit = async () => {
  if (props.PreSubmit) {
    if ((await props.PreSubmit()) == false) {
      return;
    }
  }

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
      LoadData(listUriParams);
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
 * n ed to change
 * a i call
 */
const LoadData = async (row: any) => {
  loading.value = true;

  if (props.MainContentFetchList)
    props
      .MainContentFetchList(row)
      .then((resdata: any) => {
        // pageInfo.value.current = listUriParams.page;
        itemTotal.value = resdata["itemTotal"];
        pageSize.value = resdata["pageSize"];

        tableData.value.list = resdata["list"];
        if (props.GetExtendData) {
          props.GetExtendData(resdata);
        }
        tableData.value.map = new Map<any, baseObject>();
        for (let i = 0; i < tableData.value.list.length; i++) {
          tableData.value.map.set(
            props.GetMainPrimeId(tableData.value.list[i]),
            i
          );
        }

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
  LoadData(uri);
  //
}

defineExpose({ PageLoaded, ExportDataList, ClkEditData, DeleteRow, SetColumns });
</script>

<style scoped>
.el-table {
  --el-table-header-bg-color: #409eff;
  --el-table-header-text-color: #ffffff;
}

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
<style>
.el-table[el-table-aj] td {
  padding: 0px;

}

.el-table[el-table-aj] th,
.el-table[el-table-aj] th .cell {
  padding: 2px 4px;
  color: #fff;
  font-weight: normal;
}

.el-table[el-table-aj] tr {
  padding: 2px 4px;
  color: #fff;
}

.el-table[el-table-aj] td .cell {
  padding: 2px 4px;
  color: #373737;
}

.el-table[el-table-aj] button {
  padding: 0px 5px;
  height: auto
}

.el-table[el-table-aj] .current-row td {
  padding: 0px;
  background-color: #90c6fd !important;
}
</style>
  
    