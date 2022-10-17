<template>
  <el-container>
    <el-aside width="200px">
      <com-left ref="comleft" @init="init" :AfterSelected="leftAfterSelected"></com-left>
    </el-aside>
    <el-container direction="vertical">
      <el-main>

        <com-main ref="commain" :AfterSelected="mainAfterSelected"></com-main>
        <com-down ref="comdown"></com-down>

      </el-main>
    </el-container>
  </el-container>
</template>
<script lang="ts" setup>
import comLeft from "./components/comLeft.vue";
import comMain from "./components/comMain.vue";
import comDown from "./components/comDown.vue";
import { ref, nextTick, onMounted } from "vue";
interface baseObject {
  [key: string]: any;
}
/**
 * comleft
 */
const comleft = ref<baseObject>({});
const leftAfterSelected = (selected: baseObject) => {
  commain.value.PageLoaded(
    {
      ownId: selected.ownId,
      projectId: selected.projectId,
    },
    selected.ownId
  );
};
const mainAfterSelected = (selected: baseObject, row, column, row2, column2) => {

  comdown.value.PageLoaded(
    {
      ownId: selected.divisionId,
      divisionId: selected.divisionId,
      rootId: selected.divisionId,
    },
    selected.divisionId
  );
};
/**
 * commain
 */
const commain = ref<baseObject>({});

const comdown = ref<baseObject>({});
/**
 * this api
 */
const init = () => {
  alert();
};
function PageLoaded(uri: baseObject) {
  comleft.value.PageLoaded(uri);
}

const childMounted = () => {
  // alert();
};

nextTick(() => {
  PageLoaded({ rootId: "0" });
});
</script>