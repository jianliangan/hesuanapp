<template>
  <inventory-search ref="inventorysearch" :OnSubmit="onSubmit"></inventory-search>
  <materials-search ref="materialsSearch" :AfterSelected="materialsSelected"></materials-search>
  <aj-hot-table ref="ajhottable" :MainContentPushRow="BudgetMeasurePushRow" :MainContentFetchList="BudgetMeasureTree"
    MaxFileNums="1" MaxFileSize="20" TableKey="name" :HighlightCurrentRow="true" :BtnUpMove="true" :BtnDownMove="true"
    :BtnInsert="true" :BtnSign="true" :BtnDel="true" :BtnInsertChildren="true" :BtnNew="false"
    :GetMainPrimeId="getMainPrimeId" :GetInitHotTable="getInitHotTable" :AddComment="addComment"
    :GetComments="getComments" :AfterSelected="afterSelected" :Click="click"
    :AfterDocumentKeyDown="afterDocumentKeyDown" :AfterBeginEditing="afterBeginEditing" :BtnField="true"
    :GetExtendData="getExtendData" :SuplyReadOnly="true">
    <template v-slot:tableitem>
      <hot-column width="0" data="measureId" title="" />
      <hot-column width="310" data="projectName" title="项目相关" />
      <hot-column width="130" data="name" title="名称" />
      <hot-column width="150" data="subject" type="dropdown" title="成本科目" />
      <hot-column width="120" data="code" title="编码" />
      <hot-column width="120" data="category" type="dropdown" title="类别" />

      <hot-column width="120" data="distinction" title="项目特征" />
      <hot-column width="120" data="unit" type="dropdown" title="单位" />
      <hot-column width="90" data="have" type="numeric" title="含量" />
      <hot-column width="90" data="workAmount" type="numeric" title="招标工程量" />
      <hot-column width="90" data="costUnitprice" type="numeric" numeric-format="formatJP" title="综合单价" />
      <hot-column width="90" data="costSumprice" type="numeric" numeric-format="formatJP" title="综合合价" />
      <hot-column width="90" data="manageUnitprice" type="numeric" numeric-format="formatJP" title="管理费单价" />
      <hot-column width="90" data="profitUnitprice" type="numeric" numeric-format="formatJP" title="利润单价" />
      <hot-column width="90" data="manageSumprice" type="numeric" numeric-format="formatJP" title="管理费合价" />
      <hot-column width="90" data="profitSumprice" type="numeric" numeric-format="formatJP" title="利润合价" />
    </template>
    <template v-slot:expendcondition>
      <el-button @click="onSearch" class="myelbutton">
        <span title="查询" style="width:50px;">查</span>
      </el-button>
    </template>
  </aj-hot-table>
</template>
<script lang="ts" setup>
import numbro from "numbro";

import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.min.css";
import InventorySearch from "../../../components/inventorysearch/index.vue";
import { hottableSettings } from "../../../components/common";
import MaterialsSearch from "../../../components/materialssearch/index.vue";
import {
  BudgetMeasurePushRow,
  BudgetMeasureTree,
} from "@/api/model/budget/measure";
import { tools_objToobj } from "@/components/jrTools";
import { ref, nextTick, defineProps, onBeforeUnmount } from "vue";

interface baseObject {
  [key: string]: any;
}
const props = defineProps({
  AfterSelected: {
    type: Function,
    default: null,
  },
});
/**
 * left tree
 */

/**
 * right main
 */
function scrollHancle() {
  materialsSearch.value?.SetVisible(false)
}
document.addEventListener('scroll', scrollHancle, true);

function refreshtable() {
  ajhottable.value.Refresh();
};
document.addEventListener(
  "MyComdownChange",
  refreshtable, true
);
onBeforeUnmount(() => {
  document.removeEventListener(
    'scroll', scrollHancle, true
  );
  document.removeEventListener(
    'MyComdownChange', refreshtable, true
  );
})
const HotCommentIndex = [4];
registerAllModules();


let materialsSearch = ref<baseObject>({});
let isEditting = false;
let currentColumn = -1;
const ajhottable = ref<baseObject>({});
let inventorysearch = ref<baseObject>({});
const tableData2 = ref(new Array<baseObject>());
const listUriParams = {} as baseObject;
const materialsSelected = (row: baseObject) => {
  // subPackageName
  // rows: Array<>

  let map = new Map<String, Object>();

  map.set("name", row.materialsName);
  map.set("code", row.code);
  map.set("category", row.category);
  map.set("distinction", row.distinction);
  map.set("unit", row.unit);


  ajhottable.value.PageUpdateRows(map, row.materialsName);
};
let getMainPrimeId = (item: baseObject, value: Object) => {
  if (value) item.measureId = value;
  return item.measureId;
};
const afterSelected = (selected: baseObject, row, column, row2, column2) => {
  currentColumn = column;
  if (props.AfterSelected) props.AfterSelected(selected);
  isEditting = false;

  materialsSearch.value.SetVisible(false);
};
let getExtendData = (value: any) => {
  let hottable = ajhottable.value.GetSettings();
  let divisionarray = hottableSettings(hottable, value);
  inventorysearch.value.UpdateData(divisionarray[0], divisionarray[1]);
};
let onSubmit = (params: baseObject) => {
  tools_objToobj(params, listUriParams);
  ajhottable.value.PageLoaded(listUriParams, listUriParams.ownId);
}
let onSearch = () => {
  inventorysearch.value.PageLoaded(null, null);
}
const click = (cell: any, event: any) => {
  if (event.target.nodeName == "TD") {
    materialsSearch.value.SetVisible(false);
  }
}
const afterBeginEditing = (row, column) => {

  if (currentColumn == 4 || currentColumn == 2) {
    isEditting = true;
  }
}
const afterDocumentKeyDown = (event: any) => {
  let element = event.target;

  var current = element.parentNode
  let rect = element.getBoundingClientRect();

  if (isEditting) {

  } else {
    return;
  }

  if (currentColumn == 4 || currentColumn == 2) {
    let tmp: baseObject = {};
    if (currentColumn == 4) {
      tmp.code = element.value;
    } else {
      tmp.materialsName = element.value;
    }

    materialsSearch.value.PageLoaded(tmp, null);
    materialsSearch.value.SetPosition(700, 300, rect.x, rect.y + rect.height);
  }
};
const addComment = (cell: Array<baseObject>, i: Number, row: baseObject) => {
  cell.push({
    row: i,
    col: 1,
    comment: { value: row.projectName },
  }, {
    row: i,
    col: 2,
    comment: { value: row.name },
  }, {
    row: i,
    col: 6,
    comment: { value: row.distinction },
  });
};
const getComments = () => {
  return [1, 2, 6];
};
const getInitHotTable = () => {
  return {
    cmd: null,
    sortR: 0,
    projectName: "",
    children: [],
    measureId: "",
    subject: "",
    code: null,
    category: "",
    name: "",
    distinction: "",
    unit: "",
    have: 0,
    workAmount: 0,
    costUnitprice: 0,
    costSumprice: 0,
    manageUnitprice: 0,
    profitUnitprice: 0,
    manageSumprice: 0,
    profitSumprice: 0,
    sort: 0,
    ownId: "",
    parentId: "",
  };
};
/**
 * this api
 */
function PageLoaded(uri: baseObject, ownId: Object) {
  tools_objToobj(uri, listUriParams);
  ajhottable.value.PageLoaded(uri, ownId);
}

let userColumn = [
  {
    label: "项目相关",
    index: 1,
    isshow: true,
  },
  {
    label: "名称",
    index: 2,
    isshow: true,
  },
  {
    label: "成本科目",
    index: 3,
    isshow: true,
  },
  {
    label: "编码",
    index: 4,
    isshow: true,
  },
  {
    label: "类别",
    index: 5,
    isshow: true,
  },
  {
    label: "项目特征",
    index: 6,
    isshow: true,
  },
  {
    label: "单位",
    index: 7,
    isshow: true,
  },
  {
    label: "含量",
    index: 8,
    isshow: true,
  },
  {
    label: "招标工程量",
    index: 9,
    isshow: true,
  },
  {
    label: "综合单价",
    index: 10,
    isshow: true,
  },
  {
    label: "综合合价",
    index: 11,
    isshow: true,
  },
  {
    label: "管理费单价",
    index: 12,
    isshow: true,
  },
  {
    label: "利润单价",
    index: 13,
    isshow: true,
  },
  {
    label: "管理费合价",
    index: 14,
    isshow: true,
  },
  {
    label: "利润合价",
    index: 15,
    isshow: true,
  },
];

nextTick(() => {
  ajhottable.value.SetColumns(userColumn);
});

defineExpose({ PageLoaded });
</script>