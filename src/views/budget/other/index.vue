<template>
  <el-container>
    <com-main ref="commain"></com-main>
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

/**
 * commain
 */
const commain = ref<baseObject>({});

/**
 * this api
 */

function PageLoaded(uri: baseObject) {
  commain.value.PageLoaded(uri);
}

nextTick(() => {
  PageLoaded({ rootId: "0" });
});
</script>