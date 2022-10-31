<template>
  <inventory-search ref="inventorysearch" :OnSubmit="onSubmit"></inventory-search>
  <materials-search ref="materialsSearch" :AfterSelected="materialsSelected"></materials-search>
  <aj-hot-table ref="ajhottable" :MainContentPushRow="ActualMeasurePushRow" :MainContentFetchList="ActualMeasureTree"
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
      <hot-column width="120" data="unit" title="单位" />
      <hot-column width="90" data="have" type="numeric" title="含量" />
      <hot-column width="90" data="workAmount" type="numeric" title="招标工程量" />
      <hot-column width="90" data="budgetWorkAmount" type="numeric" title="预算工程量" />
      <hot-column width="90" data="costUnitprice" type="numeric" numeric-format="formatJP" title="成本单价" />
      <hot-column width="90" data="costSumprice" type="numeric" numeric-format="formatJP" title="成本合价" />
      <hot-column width="90" data="costManprice" type="numeric" numeric-format="formatJP" title="成本人工费" />
      <hot-column width="90" data="costMaterialsprice" type="numeric" numeric-format="formatJP" title="成本材料费" />
      <hot-column width="90" data="costMechanicsprice" type="numeric" numeric-format="formatJP" title="成本机械费" />
      <hot-column width="90" data="costDeviceprice" type="numeric" numeric-format="formatJP" title="成本设备费" />
      <hot-column width="90" data="costSubpackageprice" type="numeric" numeric-format="formatJP" title="专业分包费" />
    </template>
    <template v-slot:expendcondition>
      <el-button @click="onSearch" id="bu">
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
  ActualMeasurePushRow,
  ActualMeasureTree,
} from "@/api/model/actual/measure";
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

const HotCommentIndex = [4];
registerAllModules();

let materialsSearch = ref<baseObject>({});

let isEditting = false;
const ajhottable = ref<baseObject>({});
let inventorysearch = ref<baseObject>({});
const tableData2 = ref(new Array<baseObject>());
const listUriParams = {} as baseObject;
let currentColumn = -1;

function scrollHancle() {
  materialsSearch.value?.SetVisible(false)
}
document.addEventListener('scroll', scrollHancle, true);
onBeforeUnmount(() => {
  document.removeEventListener(
    'scroll', scrollHancle, true
  );
})


let getMainPrimeId = (item: baseObject, value: Object) => {
  if (value != null) item.measureId = value;
  return item.measureId;
};
const afterSelected = (selected: baseObject, row, column, row2, column2) => {
  currentColumn = column;
  if (props.AfterSelected) props.AfterSelected(selected);
  isEditting = false;
};
const click = (cell: any, event: any) => {
  if (event.target.nodeName == "TD") {
    materialsSearch.value.SetVisible(false);
  }
}
const materialsSelected = (row: baseObject) => {
  // subPackageName
  // rows: Array<>

  let map = new Map<String, Object>();

  map.set("name", row.materialsName);
  map.set("code", row.code);
  map.set("category", row.category);
  map.set("distinction", row.distinction);
  map.set("unit", row.unit);

  console.log("iiiiiiiii", row);
  ajhottable.value.PageUpdateRows(map, row.materialsName);
};
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
    divisionId: "",
    name: "",
    subject: "",
    code: null,
    category: "",

    distinction: "",
    unit: "",
    have: 0,
    workAmount: 0,
    budgetWorkAmount: 0,

    costUnitprice: 0,
    costSumprice: 0,
    costManprice: 0,
    costMaterialsprice: 0,
    costMechanicsprice: 0,
    costDeviceprice: 0,
    costSubpackageprice: 0,
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
    label: "预算工程量",
    index: 10,
    isshow: true,
  },
  {
    label: "成本单价",
    index: 11,
    isshow: true,
  },
  {
    label: "成本合价",
    index: 12,
    isshow: true,
  },
  {
    label: "成本人工费",
    index: 13,
    isshow: true,
  },
  {
    label: "成本材料费",
    index: 14,
    isshow: true,
  },
  {
    label: "成本机械费",
    index: 15,
    isshow: true,
  },
  {
    label: "成本设备费",
    index: 16,
    isshow: true,
  },
  {
    label: "专业分包费",
    index: 17,
    isshow: true,
  },

];

nextTick(() => {
  ajhottable.value.SetColumns(userColumn);
});

defineExpose({ PageLoaded });
</script>