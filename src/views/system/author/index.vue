<template>
  <el-container>
    <el-aside width="200px">
      <com-left
        ref="comleft"
        @init="init"
        :AfterSelected="leftAfterSelected"
      ></com-left>
    </el-aside>
    <el-container direction="vertical">
      <el-main>
        <com-main ref="commain" :AfterSelected="mainAfterSelected"></com-main>
      </el-main>
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
      roleId: selected.roleId,
    },
    selected.roleId
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