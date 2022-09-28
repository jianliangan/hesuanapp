<template>
  <el-container>
    <el-aside width="200px">
      <com-left ref="comleft" :AfterSelected="leftAfterSelected"></com-left>
    </el-aside>
    <el-container direction="vertical">
      <com-main ref="commain" :AfterSelected="mainAfterSelected"></com-main>
    </el-container>
  </el-container>
</template>
<script lang="ts" setup>
import comLeft from "./components/comLeft.vue";
import comMain from "./components/comMain.vue";

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
      ownId: selected.projectId,
      projectId: selected.projectId,
    },
    selected.projectId
  );
};
const mainAfterSelected = (selected: baseObject) => {};
/**
 * commain
 */
const commain = ref<baseObject>({});

const comdown = ref<baseObject>({});
/**
 * this api
 */

function PageLoaded(uri: baseObject) {
  comleft.value.PageLoaded(uri);
}

nextTick(() => {
  PageLoaded({ rootId: "0" });
});
</script>