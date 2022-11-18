<template>
  <!-- :style="position" -->
  <div v-show="ui_dialog_visible" :title="props.Title" class="aj-select-div" :style="position">
    <aj-hot-table ref="ajhottable" :MainContentPushRow="MaterialsPushRow" :MainContentFetchList="MaterialsList"
      MaxFileNums="1" MaxFileSize="20" TableKey="name" :HighlightCurrentRow="false" :BtnUpMove="false"
      :BtnDownMove="false" :BtnInsert="false" :BtnSign="false" :BtnDel="false" :BtnInsertChildren="false"
      :BtnNew="false" :GetMainPrimeId="getMainPrimeId" :GetInitHotTable="getInitHotTable" :AddComment="addComment"
      :GetComments="getComments" :AfterSelected="afterSelected" :AutoSelectFirst="false" :HasHeader="false">
      <template v-slot:tableitem>
        <hot-column width="0" data="materialsId" title="" />
        <hot-column width="120" data="materialsName" title="材料名称" />
        <hot-column width="120" data="code" title="编码" />
        <hot-column width="120" data="category" title="分类" />
        <hot-column width="120" data="subject" title="科目" />
        <hot-column width="120" data="distinction" title="特征" />
        <hot-column width="120" data="unit" title="单位" />
        <hot-column width="120" data="status" title="状态" />
        <hot-column width="120" data="createBy" title="操作者" />
        <hot-column width="120" data="createTime" title="创建时间" />
        <hot-column width="120" data="updateTime" title="更新时间" />
      </template>
    </aj-hot-table>
  </div>
</template>
<script lang="ts" setup>
import numbro from "numbro";

import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.min.css";

import { MaterialsPushRow, MaterialsList } from "@/api/model/dict/materials";
import { tools_objToobj } from "@/components/jrTools";
import { ref, nextTick, defineProps, watch } from "vue";

interface baseObject {
  [key: string]: any;
}
const ui_dialog_visible = ref(false);
let position = ref<baseObject>({});
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
function SetPosition(width: int, height: int, x: int, y: int) {
  position.value.width = width + "px";
  position.value.height = height + "px";
  position.value.left = x + "px";
  position.value.top = y + "px";

}
function SetVisible(visible: any) {
  ui_dialog_visible.value = visible;
}
let getMainPrimeId = (item: baseObject, value: Object) => {
  if (value) item.materialsId = value;
  return item.materialsId;
};
const afterSelected = (selected: baseObject, row, column, row2, column2) => {
  if (props.AfterSelected) props.AfterSelected(selected);
  ui_dialog_visible.value = false;
};
const addComment = (cell: Array<baseObject>, i: Number, row: baseObject) => {
  cell.push({
    row: i,
    col: 6,
    comment: { value: row.distinction },
  });
};
watch(ui_dialog_visible, (newVal, oldVal) => {
  if (newVal == false) {

    ajhottable.value.DeSelected();
  }

})
const getComments = () => {
  return [6];
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

  ui_dialog_visible.value = true;
}

// nextTick(() => {
//   PageLoaded({ rootId: "0" });
// });

defineExpose({ PageLoaded, SetPosition, SetVisible });
</script>
<style scoped>
.aj-select-div {
  position: absolute;
  z-index: 2147483647;
  border: #cccc 1px solid;
  background-color: #cccc;
}
</style>