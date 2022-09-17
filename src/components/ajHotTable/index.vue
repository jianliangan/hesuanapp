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
    <el-aside
      width="200px"
      v-loading="showasideing"
      v-if="props?.HasTree == true"
    >
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
            :props="props?.GroupsProps"
            @node-click="leftRowClick"
          ></el-tree>
        </el-main>
      </el-container>
      <slot></slot>
    </el-aside>
    <el-container>
      <el-header>
        <el-space>
          <el-button
            type="primary"
            @click="ClkAddData"
            v-if="props.BtnNew == true"
            >新增</el-button
          >
          <el-button
            type="primary"
            @click="ClkUpMove"
            v-if="props.BtnUpMove == true"
            >上移</el-button
          >
          <el-button
            type="primary"
            @click="ClkDownMove"
            v-if="props.BtnDownMove == true"
            >下移</el-button
          >
          <el-button
            type="primary"
            @click="ClkPreInsert"
            v-if="props.BtnInsert == true"
            >前增加</el-button
          >
          <el-button
            type="primary"
            @click="ClkBackInsert"
            v-if="props.BtnInsert == true"
            >后增加</el-button
          >
          <el-button
            type="primary"
            @click="ClkSign"
            v-if="props.BtnSign == true"
            >标记</el-button
          >
          <el-button
            type="primary"
            @click="ClkUnSign"
            v-if="props.BtnSign == true"
            >取消标记</el-button
          >
          <template
            v-if="props?.ImportUri != undefined && props?.ImportUri != ''"
          >
            <el-upload
              :accept="props.FilesExts"
              :maxSize="props.MaxFileSize"
              :limit="1"
              :data="listUriParams"
              :show-file-list="false"
              :action="props?.ImportUri"
              :on-error="handleError"
              :on-success="handleSuccess"
              :on-change="handleChange"
              auto-upload
            >
              <el-button type="primary">导入</el-button>
            </el-upload>
          </template>
        </el-space>
      </el-header>
      <el-main>
        <hot-table :settings="settings" style="height: 100%" ref="myHotTable">
          <slot name="tableitem"></slot>
        </hot-table>
      </el-main>
      <el-footer v-if="HasPage == true">
        <el-pagination
          layout="prev, pager, next"
          :total="pageInfo.itemTotal"
          :page-size="pageInfo.pageSize"
          small
          background
          @current-change="HandleCurrentChange"
        />
      </el-footer>
    </el-container>
  </el-container>
</template>
    
    <script lang="ts" setup>
import numbro from "numbro";

import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.min.css";

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
import Big from "big.js";
import { RowsSpan } from "hyperformula/typings/Span";
registerAllModules();
var languages = require("numbro/dist/languages.min.js");
interface baseObject {
  [key: string]: any;
}

// const hotData = ref<baseObject>({});
// hotData.value = new Array<baseObject>();
// setTimeout(() => {
//   hotData.value.push({
//     productName: "Product A",
//     JP_price: 1.32,
//     TR_price: 100.56,
//   });
// hotData.value.push([
//   {
//     productName: "Product A",
//     JP_price: 1.32,
//     TR_price: 100.56,
//   },
//   {
//     productName: "Product B",
//     JP_price: 2.22,
//     TR_price: 453.5,
//   },
//   {
//     productName: "Product C",
//     JP_price: 3.1,
//     TR_price: 678.1,
//   },
// ]);
// }, 1000);
const myeltable = ref<baseObject>({});
const myHotTable = ref<baseObject>({});
const SubMitLoading = ref(false);
const dialogIsAdd = ref(true);
let planAreas = ref(new Map<string, baseObject>());
const organizedata = ref(new Array<baseObject>());
let organizedata2 = new Array<any>();
let getDialogAddVisible = (value: any) => {
  if (value != null) dialogAddVisible.value = value;
  return dialogAddVisible.value;
};

numbro.registerLanguage(languages["zh-CN"]);

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
const mytree = ref<baseObject>({});
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
  TreeSelectNode: {
    type: Function,
    default: null,
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
  GetInitHotTable: {
    type: Function,
    default: null,
  },
  AddComment: {
    type: Function,
    default: null,
  },
  GetComments: {
    type: Function,
    default: null,
  },
});
const myRender = () => {
  let hot = myHotTable.value.hotInstance;
  let rows = hot.countRows();
  let cols = hot.countCols();
  let primeId = 0;
  for (let j = 0; j < rows; j++) {
    primeId = hot.getCopyableText(j, 0, j, 0);
    let maprow = tableData.value.map.get(primeId);
    let istag = false;
    if (maprow && maprow.tag == 1) {
      for (let i = 0; i < cols; i++) {
        hot.setCellMeta(j, i, "className", "mytagrow");
      }
      istag = true;
    } else {
      for (let i = 0; i < cols; i++) {
        hot.setCellMeta(j, i, "className", "");
      }
    }
    for (let i = 0; i < cols; i++) {
      if (props.GetComments().indexOf(i) != -1) {
        let className = "truncate";
        if (istag) {
          className += " mytagrow";
        }

        hot.setCellMeta(j, i, "className", className);
      }
    }
  }
  console.log("1111111111111111111111");
  hot.render();
};
let settings = ref({
  outsideClickDeselects: false,
  manualRowMove: true,
  nestedRows: true,
  rowHeaders: true,
  colHeaders: true,
  contextMenu: true,
  comments: true,
  height: "auto",
  licenseKey: "d50be-b4e43-2af78-46c17-f1be1",
  data: [props.GetInitHotTable()],
  cell: [],
  // cells: function (row, col, prop) {
  //   console.log(row, col, prop);
  //   var cp = {};
  //   if (props.GetComments().indexOf(col) != -1) {
  //     cp.className += "truncate";
  //   }
  //   //mytagrow
  //   //let primeId;
  //   //if (col == 0) primeId = this.instance.getCopyableText(row, 0, row, 0);
  //   // let maprow = tableData.value.map.get(primeId);
  //   // if (maprow && maprow.tag == 1) {
  //   //   console.log("dddddddddddddaaaaaaaaaaaaaaa", row, col);
  //   //     cp.className += " mytagrow";
  //   // }
  //   return cp;
  // },

  //afterLoadData: function (sourceData, initialLoad, source) {
  //beforeRender: function () {
  //beforeViewRender: function () {
  afterUpdateSettings: function () {
    myRender();
  },
  afterChange: (changes: []) => {
    if (changes == null) return;
    let hot = myHotTable.value.hotInstance;

    changes.forEach(([row, prop, oldValue, newValue]) => {
      if (oldValue === newValue) {
        return;
      }
      let primeId = hot.getCopyableText(row, 0, row, 0);
      let tmp = tableData.value.map.get(primeId);

      let tmpp: baseObject = {};
      tools_objToobj(tmp, tmpp);
      delete tmpp.children;
      tmpp.cmd = "edit";
      PushDataRow([tmpp], () => {
        myLoadData(tableData.value.list);
      });
    });
  },
  hiddenColumns: {
    columns: [0],
    copyPasteEnabled: true,
    indicators: true,
  },
  width: "100%",
  height: "100%",
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
const HandleCurrentChange = (val: number) => {
  listUriParams.page = val;
  FetchDataList(listUriParams);
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
const FetchLeftTreeDataList = async (row: baseObject) => {
  showasideing.value = true;

  props
    .LeftTreeFetchList(row)
    .then((response: any) => {
      organizedata.value = organizedata2 = response["list"];

      nextTick(() => {
        if (props.GetTreePrimeId)
          mytree.value!.setCurrentKey(
            props?.GetTreePrimeId(organizedata.value[0], null)
          );

        if (props.TreeSelectNode && props?.GetTreePrimeId)
          props.TreeSelectNode(listUriParams, organizedata.value[0]);

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
  if (!props?.HasTree) {
    return;
  }
  if (props.GetTreePrimeId) {
    if (
      props?.GetTreePrimeId(data) == 0 ||
      props?.GetTreePrimeId(data) == undefined ||
      props?.GetTreePrimeId(data) == ""
    )
      return;
  }
  if (props.TreeSelectNode) {
    props.TreeSelectNode(listUriParams, data);
  }

  FetchDataList(listUriParams);
};
const priInstanData = () => {
  if (props?.HasTree) {
    let curNode = mytree.value!.getCurrentNode();
    if (curNode != null) {
      if (props.GetFormInstance && props.GetTreePrimeId)
        props?.GetFormInstance(
          "SET",
          "primeid",
          props?.GetTreePrimeId(curNode, null)
        );
      if (props.GetFormInstance && props.GetTreePrimeName)
        props?.GetFormInstance(
          "SET",
          "name",
          props?.GetTreePrimeName(curNode, null)
        );
      if (props.GetTreePrimeId) {
        if (
          props?.GetTreePrimeId(curNode, null) == 0 ||
          props?.GetTreePrimeId(curNode, null) == "" ||
          props?.GetTreePrimeId(curNode, null) == undefined
        )
          return;
      }
    } else {
      return;
    }
  }
};
const currentChange = (newRow: baseObject, oldRow: baseObject) => {
  currentRow = newRow;
  console.log("change ", newRow, oldRow);
};
const ClkAddData = () => {
  if (props.GetFormInstance) props?.GetFormInstance("SET", "new", null);
  priInstanData();
  dialogIsAdd.value = true;
  getDialogAddVisible(true);

  SubMitLoading.value = false;
  if (props.OnOpenDialog) props?.OnOpenDialog("add");
};
const upAllMove = (cmd: String) => {
  let hot = myHotTable.value.hotInstance;
  let plugin = hot.getPlugin("manualRowMove");

  let selectR = hot.getSelected()[0][0];
  let selectC = hot.getSelected()[0][1];
  let toR = 0;
  //找位置
  let selectId = hot.getCopyableText(selectR, 0, selectR, 0);
  let selectRow = tableData.value.map.get(selectId);
  if (selectRow == undefined) {
    ElMessage.info("没有选择行");
    return;
  }
  let toRow: baseObject;
  let brotherRows: baseObject;
  if (!selectRow.parentId) {
    brotherRows = tableData.value.list;
  } else {
    brotherRows = tableData.value.map.get(selectRow.parentId).children;
  }
  if (brotherRows == undefined) {
    ElMessage.info("父行有问题");
    return;
  }

  let i = 0;
  if (cmd == "up") {
    i = selectR - 1;
  } else {
    i = selectR + 1;
  }
  while (1) {
    if (cmd == "up") {
      if (i < 0) break;
    }
    let id = hot.getCopyableText(i, 0, i, 0);
    let row = tableData.value.map.get(id);
    if (!row) {
      break;
    }
    if (!toRow && row.__level == selectRow.__level) {
      toRow = row;
    }
    if (row.__level < selectRow.__level) {
      break;
    }
    if (cmd == "up") {
      i--;
    } else {
      i++;
    }
  }

  //找选中行的索引
  let selectIndex = 0;
  for (let i = selectR - 1; i >= 0; i--) {
    let id = hot.getCopyableText(i, 0, i, 0);
    let row = tableData.value.map.get(id);
    if (!row) {
      break;
    }
    if (row.__level == selectRow.__level) {
      selectIndex++;
    } else if (row.__level < selectRow.__level) {
      break;
    }
  }
  if (toRow == undefined) {
    ElMessage.info("没有找到目标");
    return;
  }
  console.log("ffffff", toRow);
  //换sort
  toRow.old_sort = toRow.sort;
  toRow.old_sortR = toRow.sortR;
  selectRow.old_sort = selectRow.sort;
  selectRow.old_sortR = selectRow.sortR;

  selectRow.sortR = toRow.old_sortR;
  selectRow.sort = toRow.old_sort;

  toRow.sortR = selectRow.old_sortR;
  toRow.sort = selectRow.old_sort;
  //post
  toRow.cmd = "edit";
  selectRow.cmd = "edit";
  loading.value = true;
  let postToRow: baseObject = {};
  let postSelectRow: baseObject = {};
  tools_objToobj(toRow, postToRow);
  tools_objToobj(selectRow, postSelectRow);
  delete postToRow.children;
  delete postSelectRow.children;
  console.log("bbbbbbbbb", postToRow, postSelectRow);
  props
    .MainContentPushRow([postToRow, postSelectRow])
    .then((response: any) => {
      loading.value = false;
      //array换位置
      console.log("rrrrrrrrrrrrr", selectIndex);

      if (cmd == "up") {
        if (selectIndex > 0) {
          let tmp = brotherRows.splice(selectIndex, 1);
          brotherRows.splice(selectIndex - 1, 0, ...tmp);
        }
      } else {
        if (selectIndex < brotherRows.length - 1) {
          let tmp = brotherRows.splice(selectIndex + 1, 1);
          brotherRows.splice(selectIndex, 0, ...tmp);
        }
      }

      myLoadData(tableData.value.list);
    })
    .catch((err: any) => {
      loading.value = false;
    });
  ///////////////////////////////
};
const ClkUpMove = () => {
  upAllMove("up");
};
const ClkDownMove = () => {
  upAllMove("down");
};
const allSign = (cmd: string) => {
  let hot = myHotTable.value.hotInstance;
  let plugin = hot.getPlugin("manualRowMove");

  let selectR = hot.getSelected()[0][0];
  let selectC = hot.getSelected()[0][1];
  let toR = 0;
  //找位置
  let selectId = hot.getCopyableText(selectR, 0, selectR, 0);
  let selectRow = tableData.value.map.get(selectId);
  if (selectRow == undefined) {
    ElMessage.info("没有选择行");
    return;
  }
  let postSelectRow: baseObject = {};
  selectRow.cmd = "edit";
  if (cmd == "sign") selectRow.tag = 1;
  else selectRow.tag = 0;
  tools_objToobj(selectRow, postSelectRow);
  delete postSelectRow.children;

  props
    .MainContentPushRow([postSelectRow])
    .then((response: any) => {
      loading.value = false;
      myRender();
      //loaddata
    })
    .catch((err: any) => {
      loading.value = false;
    });
};
const ClkSign = () => {
  allSign("sign");
};
const ClkUnSign = () => {
  allSign("unsign");
};
const allInstert = (cmd: string) => {
  let hot = myHotTable.value.hotInstance;

  let selectR = hot.getSelected()[0][0];
  let selectC = hot.getSelected()[0][1];
  let toR = 0;
  //找位置
  let selectId = hot.getCopyableText(selectR, 0, selectR, 0);
  let selectRow = tableData.value.map.get(selectId);
  if (selectRow == undefined) {
    ElMessage.info("没有选择行");
    return;
  }
  let toRow: baseObject;
  let brotherRows: baseObject;
  if (!selectRow.parentId) {
    brotherRows = tableData.value.list;
  } else {
    brotherRows = tableData.value.map.get(selectRow.parentId).children;
  }
  if (brotherRows == undefined) {
    ElMessage.info("父行有问题");
    return;
  }

  let i = 0;
  if (cmd == "up") {
    i = selectR - 1;
  } else {
    i = selectR + 1;
  }
  while (1) {
    if (cmd == "up") {
      if (i < 0) break;
    }
    let id = hot.getCopyableText(i, 0, i, 0);
    let row = tableData.value.map.get(id);
    if (!row) {
      break;
    }
    if (!toRow && row.__level == selectRow.__level) {
      toRow = row;
    }
    if (row.__level < selectRow.__level) {
      break;
    }
    if (cmd == "up") {
      i--;
    } else {
      i++;
    }
  }

  //找选中行的索引
  let selectIndex = 0;
  for (let i = selectR - 1; i >= 0; i--) {
    let id = hot.getCopyableText(i, 0, i, 0);
    let row = tableData.value.map.get(id);
    if (!row) {
      break;
    }
    if (row.__level == selectRow.__level) {
      selectIndex++;
    } else if (row.__level < selectRow.__level) {
      break;
    }
  }
  let toSort = 0;
  if (toRow == undefined) {
    if (cmd == "up") {
      toSort = 0;
    } else {
      Big.DP = 10;
      Big.RM = Big.roundHalfUp;
      let tmp = new Big(selectRow.sort);

      toSort = tmp.add(1).toString();
      console.log("aaaaaaaaaaaaaaaddddddddddddddwww", toSort, selectRow.sort);
    }
  } else {
    toSort = toRow.sort;
  }

  //求sort
  let row = props.GetInitHotTable();

  Big.DP = 10;
  Big.RM = Big.roundHalfUp;

  let selectSort = new Big(selectRow.sort);
  let toRowSort = new Big(toSort);
  row.sort = selectSort.add(toRowSort).div(2).toString();
  row.cmd = "add";
  row.parentId = selectRow.parentId;
  row.ownId = selectRow.ownId;
  //post
  console.log("aaaaaaaaaaaaaaadddddddddddddd", row.sort);
  loading.value = true;

  props
    .MainContentPushRow([row])
    .then((response: any) => {
      loading.value = false;

      console.log("rrrrrrrrrrrrr", response);
      props.GetMainPrimeId(row, response);
      if (cmd == "up") {
        brotherRows.splice(selectIndex, 0, row);
      } else {
        brotherRows.splice(selectIndex + 1, 0, row);
      }
      console.log("rrrrrrrrrrrrrrrr d ", tableData.value.list);
      myLoadData(tableData.value.list);
    })
    .catch((err: any) => {
      loading.value = false;
    });
  ///////////////////////////////
  //////////////////////////
};
const ClkPreInsert = () => {
  allInstert("up");
};
const ClkBackInsert = () => {
  allInstert("down");
};
const onCancel = () => {
  if (props.GetDialogAddVisible) props?.GetDialogAddVisible(false);
  if (props.OnCancelDialog) props?.OnCancelDialog();
};
function ClkEditData(row: baseObject) {
  if (props.GetFormInstance) props?.GetFormInstance("SET", "*", row);
  priInstanData();
  dialogIsAdd.value = false;
  SubMitLoading.value = false;
  getDialogAddVisible(true);

  if (props.OnOpenDialog) props?.OnOpenDialog("edit");
}

/**
 * need to change
 * api call
 */

const OnSubmit = () => {
  if (props.PreSubmit) {
    if (props.PreSubmit() == false) {
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

const PushDataRow = async (body: any, ...args: Function[]) => {
  loading.value = true;
  let cb: Function = args[0];

  console.log("cccccccccc", body);
  props
    .MainContentPushRow(body)
    .then((response: any) => {
      loading.value = false;

      SubMitLoading.value = false;

      if (cb) cb(response);
    })
    .catch((err: any) => {
      loading.value = false;
      SubMitLoading.value = false;
    });
};
const filterRow = (
  rows: Array<baseObject>,
  lists: Map<Object, baseObject>,
  level: number
) => {
  if (rows.length > 0) level++;
  for (let i = 0; i < rows.length; i++) {
    rows[i].__level = level;
    lists.set(props.GetMainPrimeId(rows[i]), rows[i]);
    filterRow(rows[i].children, lists, level);
  }
};
/**
 * need to change
 * api call
 */
const FetchDataList = async (row: any) => {
  loading.value = true;

  if (props.MainContentFetchList)
    props
      .MainContentFetchList(row)
      .then((resdata: any) => {
        pageInfo.value.itemTotal = parseInt(resdata["itemTotal"]);
        pageInfo.value.pageSize = parseInt(resdata["pageSize"]);
        if (!resdata["list"] || resdata["list"].length == 0) {
          tableData.value.list = [props.GetInitHotTable()];
        } else {
          tableData.value.list = resdata["list"];
        }

        myLoadData(tableData.value.list);
        //////////////////////

        /////////////////////
        loading.value = false;
      })
      .catch((err: any) => {
        loading.value = false;
      });
};
const myLoadData = (listData: Array<baseObject>) => {
  tableData.value.map = new Map<Object, baseObject>();
  filterRow(listData, tableData.value.map, 0);
  let indexi = 0;
  settings.value.cell = new Array<baseObject>();
  for (let [key, value] of tableData.value.map) {
    if (value["children"]) {
      value["__children"] = value["children"];
    }

    props.AddComment(settings.value.cell, indexi, value);
    indexi++;
  }

  myHotTable.value.hotInstance.loadData(listData);

  myRender();
};

const ExportDataList = () => {
  return tableData.value.list;
};
function PageLoaded() {
  if (props.PreFirstGetData) props.PreFirstGetData(listUriParams);
  if (props?.HasTree == true) {
    FetchLeftTreeDataList(listUriParams);
  } else {
    FetchDataList(listUriParams);
  }

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
<style>
body .handsontable .truncate {
  width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 20px;
}
body .handsontable .mytagrow {
  background: yellow;
}
.el-main {
  padding: 0px;
}
</style>
  
    