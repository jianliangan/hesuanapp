<template>
  <el-container>
    <el-container direction="vertical">
      <com-main ref="commain" :AfterSelected="mainAfterSelected"></com-main>
    </el-container>
  </el-container>
</template>
<script lang="ts" setup>
import comMain from "./components/comMain.vue";

import { ref, nextTick, onMounted } from "vue";
interface baseObject {
  [key: string]: any;
}
/**
 * comleft
 */

const mainAfterSelected = (selected: baseObject, row, column, row2, column2) => {
  // comdown.value.PageLoaded({
  //   supplyUnitId: selected.supplyUnitId,
  // });
};
/**
 * commain
 */
const commain = ref<baseObject>({});

/**
 * this api
 */
const init = () => {
  alert();
};
function PageLoaded(uri: baseObject, ownId: Object) {
  commain.value.PageLoaded(uri, ownId);
}

const childMounted = () => {
  // alert();
};

nextTick(() => {
  PageLoaded({ rootId: "0" }, 0);
});
</script>