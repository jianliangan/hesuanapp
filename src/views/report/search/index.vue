<template>
  <el-container>


    <el-main>

      <com-main ref="commain" :AfterSelected="mainAfterSelected"></com-main>


    </el-main>

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


const mainAfterSelected = (selected: baseObject) => {

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
function PageLoaded(uri: baseObject) {
  commain.value.PageLoaded(uri);
}

const childMounted = () => {
  // alert();
};

nextTick(() => {
  PageLoaded({ rootId: "0" });
});
</script>