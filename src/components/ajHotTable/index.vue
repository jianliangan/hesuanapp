<template>
  <el-container>
    <el-header :class="[props.BtnInsertChildren == true?'headeh':'headeh2']" v-if="props.HasHeader==true">
      <el-space class="ajtre " :class="[props.BtnInsertChildren == true?'spach':'spach2']">
        <el-button type="primary" @click="ClkUpMove" v-if="props.BtnUpMove == true">
          <el-icon><img class="iconimgq" src="../../icons/svg/moveUp.svg" /></el-icon>
        </el-button>
        <el-button type="primary" @click="ClkDownMove" v-if="props.BtnDownMove == true">
          <el-icon>
            <img class="iconimgq" src="../../icons/svg/moveDown.svg" />
          </el-icon>
        </el-button>
        <el-popconfirm title="确认删除吗？" @confirm="ClkDel">
          <template #reference>
            <el-button type="primary" v-if="props.BtnDel == true">
              <el-icon>
                <img class="iconimgq" src="../../icons/svg/delete.svg" />
              </el-icon>
            </el-button>
          </template>
        </el-popconfirm>

        <el-button type="primary" @click="ClkInsertChildren" v-if="props.BtnInsertChildren == true">
          <el-icon>
            <img class="iconimgq" src="../../icons/svg/addChild.svg" />
          </el-icon>
        </el-button>
        <el-button type="primary" @click="ClkPreInsert" v-if="props.BtnInsert == true">
          <el-icon>
            <img class="iconimgq" src="../../icons/svg/addition.svg" />
          </el-icon>
        </el-button>
        <el-button type="primary" @click="ClkBackInsert" v-if="props.BtnInsert == true">
          <el-icon>
            <img class="iconimgq" src="../../icons/svg/postAddition.svg" />
          </el-icon>
        </el-button>
        <el-button type="primary" @click="ClkSign" v-if="props.BtnSign == true">
          <el-icon>
            <img class="iconimgq" src="../../icons/svg/mark.svg" />
          </el-icon>
        </el-button>
        <el-button type="primary" @click="ClkUnSign" v-if="props.BtnSign == true">
          <el-icon>
            <img class="iconimgq" src="../../icons/svg/unMark.svg" />
          </el-icon>
        </el-button>
        <template v-if="props?.ImportUri != undefined && props?.ImportUri != ''">
          <el-upload :accept="props.FilesExts" :maxSize="props.MaxFileSize" :limit="1" :data="listUriParams"
            :show-file-list="false" :action="props?.ImportUri" :on-error="handleError" :on-success="handleSuccess"
            :on-change="handleChange" auto-upload>
            <el-button type="primary">
              <el-icon>
                <img class="iconimgq" src="../../icons/svg/import.svg" />
              </el-icon>
            </el-button>
          </el-upload>
        </template>
        <slot name="expendcondition"></slot>
      </el-space>
    </el-header>
    <div class="adminui-side-bottom topbottom" v-if="props.BtnInsertChildren == true" @click="ab">
      <el-icon class="">
        <!-- <el-icon-expand v-if="menuIsCollapse" />
            <el-icon-fold v-else /> -->
        <CaretBottom class="jianto1" />
        <!-- <CaretRight /> -->
      </el-icon>
    </div>
    <div class="adminui-side-bottom topbottom" v-if="props.BtnInsertChildren == false" @click="ac">
      <el-icon>
        <!-- <el-icon-expand v-if="menuIsCollapse" />
            <el-icon-fold v-else /> -->
        <CaretBottom class="jianto2" />
        <!-- <CaretRight /> -->
      </el-icon>
    </div>
    <el-main>
      <hot-table :settings="settings" v-on:dblclick="dblClick" v-on:click="click" style="height: 100%" ref="myHotTable">
        <slot name="tableitem"></slot>
      </hot-table>
    </el-main>
    <el-footer v-if="HasPage == true">
      <el-pagination layout="prev, pager, next" :total="pageInfo.itemTotal" :page-size="pageInfo.pageSize" small
        background @current-change="HandleCurrentChange" />
    </el-footer>
  </el-container>
</template>
    
<script lang="ts" setup>
import numbro from "numbro";
import { CaretLeft, CaretRight, CaretTop, CaretBottom } from "@element-plus/icons-vue";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.min.css";

import { computed, nextTick, ref, watch, defineProps, defineExpose, onBeforeUnmount } from "vue";
import {
  tools_objToobj,
  tools_sort_map_loop,
} from "@/components/jrTools/index";

import {
  ElMessage,
  UploadFile,
  UploadFiles,
  UploadProps,
  UploadRawFile,
} from "element-plus";
import Big from "big.js";
import { RowsSpan } from "hyperformula/typings/Span";
import { ConfigValueTooSmallError } from "hyperformula";
registerAllModules();
var languages = require("numbro/dist/languages.min.js");
interface baseObject {
  [key: string]: any;
}
var firstApiLoad = true;
const myHotTable = ref<baseObject>({});
let listUriParamsOwnId = {};
let planAreas = ref(new Map<string, baseObject>());

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

function ab() {
  const space = document.getElementsByClassName('spach')[0];
  const header = document.getElementsByClassName('headeh')[0];
  const jianto1 = document.getElementsByClassName('jianto1')[0];
  if (space.offsetHeight == 0) {
    space.style.height = "";
    header.style.height = "";
    jianto1.style.transform = "rotate(180deg)";
  } else {
    space.style.height = "0";
    header.style.height = "0";
    jianto1.style.transform = "";
  }
}
function ac() {
  const space = document.getElementsByClassName('spach2')[0];
  const header = document.getElementsByClassName('headeh2')[0];
  const jianto1 = document.getElementsByClassName('jianto2')[0];
  if (space.offsetHeight == 0) {
    space.style.height = "";
    header.style.height = "";
    jianto1.style.transform = "rotate(180deg)";
  } else {
    space.style.height = "0";
    header.style.height = "0";
    jianto1.style.transform = "";
  }
}
/**
 * need to change
 * api call
 */
const dblClick = (event: any) => {
  let hot = myHotTable.value.hotInstance;
  let cell = hot.getSelectedLast();
  //let testcontainerOffset = myHotTable.value.offset(hot.rootElement);
  if (props.CellDblClick) props.CellDblClick(cell, event);
};
const click = (event: any) => {
  let hot = myHotTable.value.hotInstance;
  let cell = hot.getSelectedLast();
  if (props.Click) props.Click(cell, event);
};
const mainframe = ref<baseObject>({});

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

  MainContentPushRow: {
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

  HasPage: {
    type: Boolean,
    default: false,
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
  BtnInsertChildren: {
    type: Boolean,
    default: false,
  },
  BtnDel: {
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

  AfterSelected: {
    type: Function,
    default: null,
  },
  NestedHeaders: {
    type: Array,
    default: null,
  },
  CellDblClick: {
    type: Function,
    default: null,
  },
  AfterDocumentKeyDown: {
    type: Function,
    default: null,
  },
  AutoSelectFirst: {
    type: String,
    default: "yes",
  },
  HasHeader: {
    type: Boolean,
    default: true,
  },
  Click: {
    type: Function,
    default: null,
  },
  AfterBeginEditing: {
    type: Function,
    default: null,
  }
});
const myAfterDocumentKeyDown = (e: any) => {
  if (props.AfterDocumentKeyDown) props.AfterDocumentKeyDown(e);
}
const myRender = () => {
  let hot = myHotTable.value.hotInstance;
  let rows = hot.countRows();
  let cols = hot.countCols();
  let primeId = 0;
  for (let j = 0; j < rows; j++) {
    primeId = hot.getCopyableText(j, 0, j, 0);
    if (!primeId) {
      for (let i = 0; i < cols; i++) {
        hot.setCellMeta(j, i, "className", "onlyRead");
      }
      continue;
    }
    let maprow = tableData.value.map.get(primeId);

    //以行遍历
    if (maprow) {
      let classall = "";
      if (maprow.tag == 1) {
        classall = "mytagrow";
      }
      if (maprow.source == "project") {
        classall += " sourceproject_" + maprow.__level;
      } else if (maprow.children && maprow.children.length > 0) {
        classall += " sourceproject_" + maprow.__level;
      }
      for (let i = 0; i < cols; i++) {
        if (props.GetComments().indexOf(i) != -1) {
          classall += " truncate";
        }
        hot.setCellMeta(j, i, "className", classall);
      }
    } else {
      for (let i = 0; i < cols; i++) {
        hot.setCellMeta(j, i, "className", "");
      }
    }
  }
  hot.render();
};
// hot.getPlugin('nestedRows').collapsingUI.collapseChildren(5); 可以手动展开
let settings = ref({
  manualColumnResize: true,
  rowHeaderWidth: 80,
  outsideClickDeselects: false,
  manualRowMove: true,
  nestedRows: true,
  rowHeaders: true,
  colHeaders: true,
  contextMenu: false,
  comments: true,
  height: "auto",
  licenseKey: "d50be-b4e43-2af78-46c17-f1be1",
  data: [props.GetInitHotTable()],
  nestedHeaders: props.NestedHeaders,
  cell: [],
  afterBeginEditing: (row: any, column: any) => {
    //// console.log("aafter edit");
    if (props.AfterBeginEditing) props.AfterBeginEditing(row, column);
  },
  afterSelection: (row, column, row2, column2, preventScrolling, selectionLayerLevel) => {
    console.log("aaaaaaaaaaa", 33);
  }
  ,
  afterDocumentKeyDown: function (event: any) {
    //console.log("key down");
    if (!event.target.onkeyup)
      event.target.onkeyup = myAfterDocumentKeyDown
  },
  afterUpdateSettings: function () {
    if (firstApiLoad) {
      let hot = myHotTable.value.hotInstance;
      //AfterSelected
      if (props.AutoSelectFirst == "yes")
        hot.selectCell(0, 0);
      firstApiLoad = false;
    }
    myRender();
  },
  afterSelection: (
    row: any,
    column: any,
    row2: any,
    column2: any,
    preventScrolling: any,
    selectionLayerLevel: any
  ) => {

    let hot = myHotTable.value.hotInstance;
    let primeId = hot.getCopyableText(row, 0, row, 0);
    let tmp;
    if (tableData.value.map) {
      tmp = tableData.value.map.get(primeId);
    }
    if (props.AfterSelected) props.AfterSelected(tmp, row, column, row2, column2);

  },
  afterChange: (changes: []) => {
    if (changes == null) return;
    let hot = myHotTable.value.hotInstance;

    changes.forEach(([row, prop, oldValue, newValue]) => {

      if (oldValue == newValue || (oldValue == null && newValue == "")) {
        return;
      }

      let primeId = hot.getCopyableText(row, 0, row, 0);
      if (!primeId) {
        ElMessage.info("此行不能编辑，请先增加");
        return;
      }
      let tmp = tableData.value.map.get(primeId);

      let tmpp: baseObject = {};
      tools_objToobj(tmp, tmpp);
      delete tmpp.children;
      tmpp.cmd = "edit";
      PushDataRow([tmpp], () => {
        //myLoadData(tableData.value.list);

        LoadData(listUriParams);
      });
    });
  },
  hiddenColumns: {
    columns: [0],
    copyPasteEnabled: true,
    indicators: false,
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
  set() { },
});
tableData.value.tablePackageHeight = computed({
  get() {
    return mainframe.value.offsetHeight - 50 - 32 + "px";
  },
  set() { },
});

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

const handleChange: UploadProps["onChange"] = (
  uploadFile: UploadFile,
  uploadFiles: UploadFiles
) => { };
const handleSuccess: UploadProps["onSuccess"] = (
  error: Error,
  uploadFile: UploadFile,
  uploadFiles: UploadFiles
) => {
  ElMessage.success("导入成功");
  firstApiLoad = true;
  LoadData(listUriParams);
};
const handleError: UploadProps["onError"] = (
  error: Error,
  uploadFile: UploadFile,
  uploadFiles: UploadFiles
) => {
  ElMessage.error("发生错误：" + error);
};

const findSelectRowBrother = (selectRow: baseObject) => {
  let brotherRows: baseObject;
  if (!selectRow.parentId) {
    brotherRows = tableData.value.list;
  } else {
    if (tableData.value.map.get(selectRow.parentId)) {
      brotherRows = tableData.value.map.get(selectRow.parentId).children;
    } else {
      brotherRows = tableData.value.list;
    }
  }
  return brotherRows;
};
const upAllMove = (cmd: String) => {
  let hot = myHotTable.value.hotInstance;
  let plugin = hot.getPlugin("manualRowMove");
  if (!hot.getSelected()) {
    ElMessage.info("需要先选中一行");
    return;
  }
  let selectR = hot.getSelected()[0][0];
  let selectC = hot.getSelected()[0][1];
  let toR = 0;
  //找位置
  let selectId = hot.getCopyableText(selectR, 0, selectR, 0);
  let selectRow = tableData.value.map.get(selectId);
  if (selectRow.source == "project") {
    ElMessage.info("项目属性不能操作");
    return;
  }
  if (selectRow == undefined) {
    ElMessage.info("没有选择行");
    return;
  }
  let toRow: baseObject;
  let brotherRows: baseObject = findSelectRowBrother(selectRow);

  if (!brotherRows) {
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
  let selectIndex = findSelectIndex(selectR, selectRow);

  if (toRow == undefined) {
    ElMessage.info("没有找到目标");
    return;
  }

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
const findSelectIndex = (selectR: number, selectRow: baseObject) => {
  let selectIndex = 0;
  let hot = myHotTable.value.hotInstance;
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
  return selectIndex;
};
const allSign = (cmd: string) => {
  let hot = myHotTable.value.hotInstance;

  if (!hot.getSelected()) {
    ElMessage.info("需要先选中一行");
    return;
  }
  let selectR = hot.getSelected()[0][0];
  let selectC = hot.getSelected()[0][1];
  let toR = 0;
  //找位置
  let selectId = hot.getCopyableText(selectR, 0, selectR, 0);
  let selectRow = tableData.value.map.get(selectId);
  if (selectRow.source == "project") {
    ElMessage.info("项目属性不能操作");
    return;
  }
  if (selectRow == undefined) {
    ElMessage.info("没有选择行");
    return;
  }
  let postSelectRow: baseObject = {};
  if (cmd == "delete") {
    selectRow.cmd = "delete";
  } else {
    selectRow.cmd = "edit";
  }
  let brotherRows: baseObject;
  let selectIndex = 0;
  if (cmd == "delete") {
    brotherRows = findSelectRowBrother(selectRow);
    selectIndex = findSelectIndex(selectR, selectRow);
  }
  if (cmd == "sign") selectRow.tag = 1;
  else selectRow.tag = 0;
  tools_objToobj(selectRow, postSelectRow);
  delete postSelectRow.children;

  props
    .MainContentPushRow([postSelectRow])
    .then((response: any) => {
      loading.value = false;
      if (cmd == "delete") {
        if (brotherRows) brotherRows.splice(selectIndex, 1);
        myLoadData(tableData.value.list);
      }
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
const ClkDel = () => {
  allSign("delete");
};
const ClkUnSign = () => {
  allSign("unsign");
};
const allInstert = (cmd: string) => {
  let hot = myHotTable.value.hotInstance;
  if (!hot.getSelected()) {
    ElMessage.info("需要先选中一行");
    return;
  }
  let selectR = hot.getSelected()[0][0];
  let selectC = hot.getSelected()[0][1];
  let toR = 0;
  let brotherRows: baseObject;
  let selectIndex = 0;
  let row;

  //找位置
  if (tableData.value.map && tableData.value.map.size > 0) {
    let selectId = hot.getCopyableText(selectR, 0, selectR, 0);
    let selectRow = tableData.value.map.get(selectId);
    if (cmd != "children") {
      if (selectRow.source == "project") {
        ElMessage.info("项目属性不能操作");
        return;
      }
    }

    if (selectRow == undefined) {
      ElMessage.info("没有选择行");
      return;
    }
    let toRow: baseObject;

    if (cmd != "children") {
      if (selectRow.parentId) {
        if (tableData.value.map.get(selectRow.parentId)) {
          brotherRows = tableData.value.map.get(selectRow.parentId).children;
        } else {
          brotherRows = tableData.value.list;
        }
      } else {
        if (tableData.value.empty) tableData.value.list.splice(0);
        brotherRows = tableData.value.list;
      }
    } else {
      brotherRows = selectRow.children;
    }
    if (!brotherRows) {
      ElMessage.info("父行有问题");
      return;
    }
    let toSort = 0;
    if (cmd != "children") {
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
      toSort = 0;
      if (toRow == undefined) {
        if (cmd == "up") {
          toSort = 0;
        } else {
          Big.DP = 10;
          Big.RM = Big.roundHalfUp;
          let tmp = new Big(selectRow.sort);

          toSort = tmp.add(1).toString();
        }
      } else {
        toSort = toRow.sort;
      }
    }
    //求sort
    row = props.GetInitHotTable();

    Big.DP = 10;
    Big.RM = Big.roundHalfUp;
    if (cmd == "children") {
      if (brotherRows.length > 0) {
        let selectSort = new Big(brotherRows[0].sort);
        let toRowSort = new Big(0);
        row.sort = selectSort.add(toRowSort).div(2).toString();
        row.cmd = "add";
        row.parentId = selectId;
        row.ownId = selectRow.ownId;
      } else {
        row.sort = 1;
        row.cmd = "add";
        row.parentId = selectId;
        row.ownId = selectRow.ownId;
      }
    } else {
      let selectSort = new Big(selectRow.sort);
      let toRowSort = new Big(toSort);

      row.sort = selectSort.add(toRowSort).div(2).toString();
      row.cmd = "add";
      row.parentId = selectRow.parentId;
      row.ownId = selectRow.ownId;
    }
  } else {
    row = tableData.value.list[0];
    row.sort = 1;
    row.cmd = "add";
    row.parentId = listUriParamsOwnId;
    row.ownId = listUriParamsOwnId;
  }
  //post

  loading.value = true;

  props
    .MainContentPushRow([row])
    .then((response: any) => {
      loading.value = false;

      props.GetMainPrimeId(row, response);
      if (brotherRows) {
        if (cmd == "up") {
          brotherRows.splice(selectIndex, 0, row);
        } else {
          brotherRows.splice(selectIndex + 1, 0, row);
        }
      }

      myLoadData(tableData.value.list);
    })
    .catch((err: any) => {
      loading.value = false;
    });
  ///////////////////////////////
  //////////////////////////
};
function pagecontentCollapseHandle() { PageResize() };



document.addEventListener(
  "pagecontentCollapse",
  pagecontentCollapseHandle, true
);
onBeforeUnmount(() => {
  document.removeEventListener(
    "pagecontentCollapse",
    pagecontentCollapseHandle, true
  );
})
const ClkPreInsert = () => {
  allInstert("up");
};
const ClkBackInsert = () => {
  allInstert("down");
};
const ClkInsertChildren = () => {
  allInstert("children");
};
/**
 * need to change
 * api call
 */

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

  props
    .MainContentPushRow(body)
    .then((response: any) => {
      loading.value = false;

      if (cb) cb(response);
    })
    .catch((err: any) => {
      loading.value = false;
    });
};
const filterRow = (
  rows: Array<baseObject>,
  lists: Map<Object, baseObject>,
  level: number
) => {
  if (!rows) return;
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
const LoadData = async (row: any) => {
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

  if (props.GetMainPrimeId(listData[0])) {

    filterRow(listData, tableData.value.map, 0);
  }
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
let PageUpdateRows = (map: Map<Object, Object>, celldata: String) => {
  let hot = myHotTable.value.hotInstance;
  let cell = hot.getSelectedLast();
  let selectR = cell[0];
  let selectId = 0;
  if (tableData.value.map && tableData.value.map.size > 0) {
    selectId = hot.getCopyableText(selectR, 0, selectR, 0);
  } else {
    return;
  }

  let vv = tableData.value.map.get(selectId);
  for (let [key, value] of map) {
    vv[key] = value;
  }
  hot.setDataAtCell(cell[0], cell[1], celldata);
  console.log("iiiiiiiii", map, vv);
  //hot的事件设计不合理，只能再去推送一下，否则直接触发修改就行了

  let tmpp: baseObject = {};
  tools_objToobj(vv, tmpp);
  delete tmpp.children;
  tmpp.cmd = "edit";
  PushDataRow([tmpp], () => {
    myLoadData(tableData.value.list);
  });
  //
};
let PageLoaded = (uri: baseObject, ownId: String) => {
  tools_objToobj(uri, listUriParams);
  firstApiLoad = true;
  listUriParamsOwnId = ownId;
  LoadData(uri);
  //
};
let PageResize = () => {
  let hot = myHotTable.value.hotInstance;
  hot.updateSettings({
    width: "100%"
  });
}

defineExpose({ PageLoaded, PageUpdateRows, PageResize });
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
.iconimgq {
  width: 60px;
  height: 32px;
  cursor: pointer;
}

.el-button {
  background-color: #ffffff;
  border: none;
  padding-left: 1px;
}

.el-button:hover {
  background-color: #ffffff;
}

body .handsontable .truncate {
  width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 20px;
}
.handsontable {
  font-size: 12px;
}
body .handsontable .sourceproject_1 {
  background: #f0f0f0f0
}

body .handsontable .sourceproject_2 {
  background: #f0f0f0f0
}

body .handsontable .sourceproject_3 {
  background: #f0f0f0f0
}

body .handsontable .sourceproject_4 {
  background: #f0f0f0f0
}

body .handsontable .sourceproject_5 {
  background: #f0f0f0f0
}

body .handsontable .sourceproject_6 {
  background: #f0f0f0f0
}

body .handsontable .sourceproject_7 {
  background: #f0f0f0f0
}

body .handsontable .mytagrow {
  background: yellow;
}

body .handsontable .onlyRead {
  background: rgb(227, 229, 230);
}

.el-main {
  padding: 0px;
}

.topbottom {
  width: 100px;
  position: fixed;
  left: 95%;
  margin-top: -30px;
}

.el-space {
  overflow: hidden;
  display: inline-flex;
  vertical-align: top;
}

.el-container {
  overflow: hidden;
}
</style>

    