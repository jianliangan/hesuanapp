<template>
  <aj-hot-table ref="ajhottable" :MainContentPushRow="MaterialsPushRow" :MainContentFetchList="MaterialsList"
    MaxFileNums="1" MaxFileSize="20" TableKey="name" :HighlightCurrentRow="true" :BtnUpMove="false" :BtnDownMove="false"
    :BtnInsert="false" :BtnSign="false" :BtnDel="false" :BtnInsertChildren="false" :BtnNew="false"
    :GetMainPrimeId="getMainPrimeId" :GetInitHotTable="getInitHotTable" :AddComment="addComment"
    :GetComments="getComments" :AfterSelected="afterSelected" :GetExtendData="getExtendData" :BtnMulti="false">
    <template v-slot:tableitem>
      <hot-column width="0" data="materialsId" title="" />
      <hot-column width="310" data="materialsName" title="材料名称" />
      <hot-column width="120" data="code" title="编码" />
      <hot-column width="120" data="subject" type="dropdown" title="科目" />
      <hot-column width="120" data="distinction" title="特征" />
      <hot-column width="120" data="category" type="dropdown" title="分类" />

      <hot-column width="120" data="unit" title="单位" />
      <hot-column width="120" data="status" type="dropdown" title="状态" />
      <hot-column width="120" data="createByName" title="操作者" />
      <hot-column width="120" data="createTime" title="创建时间" />
      <hot-column width="120" data="updateTime" title="更新时间" />
    </template>
  </aj-hot-table>
</template>
<script lang="ts" setup>
import numbro from "numbro";

import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.min.css";
import { hottableSettings } from "../../../components/common";
import { MaterialsPushRow, MaterialsList } from "@/api/model/dict/materials";
import { tools_objToobj } from "@/components/jrTools";
import { ref, nextTick, defineProps } from "vue";

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

const ajhottable = ref<baseObject>({});

const tableData2 = ref(new Array<baseObject>());
let getExtendData = (value: any) => {

  let hottable = ajhottable.value.GetSettings();
  let divisionarray = hottableSettings(hottable, value);


  //console.log(value);
  let statusl = value["extend"].statusl;
  hottable.columns[7].source = statusl;
  hottable.columns[7].strict = false;
  hottable.columns[7].allowInvalid = false;
};
let getMainPrimeId = (item: baseObject, value: Object) => {
  if (value != null) item.materialsId = value;
  return item.materialsId;
};
const afterSelected = (selected: baseObject, row, column, row2, column2) => {
  if (props.AfterSelected) props.AfterSelected(selected);
};
const addComment = (cell: Array<baseObject>, i: Number, row: baseObject) => {
  cell.push({
    row: i,
    col: 1,
    comment: { value: row.materialsName },
  }, {
    row: i,
    col: 4,
    comment: { value: row.distinction },
  });
};
const getComments = () => {
  return [1, 4];
};
const getInitHotTable = () => {
  return {
    cmd: "",
    sortR: 0,
    materialsId: "",

    materialsName: "",
    code: "",
    category: "",
    subject: "",
    distinction: "",
    unit: "",
    status: "",
    delFlag: "",
    createBy: "",
    createByName: "",
    createTime: "",
    updateTime: "",
    remark: "",
    by1: "",
    by2: "",
    by3: "",
    by4: "",

    sort: 0,
    ownId: "",
    parentId: "",
    tag: 0,

    source: "",
    children: [],
  };
};
/**
 * this api
 */
function PageLoaded(uri: baseObject, ownId: Object) {
  ajhottable.value.PageLoaded(uri, ownId);
}

// nextTick(() => {
//   PageLoaded({ rootId: "0" });
// });

defineExpose({ PageLoaded });
</script>