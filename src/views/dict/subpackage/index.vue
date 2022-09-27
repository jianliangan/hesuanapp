<template>
  <el-container>
    <el-container direction="vertical">
      <el-main>
        <div style="height: 300px">
          <com-main ref="commain" :AfterSelected="mainAfterSelected"></com-main>
          <div style="height: 250px; background-color: white">
            <span style="font-size: 14px">工料机:</span>
            <com-down ref="comdown"></com-down>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script lang="ts" setup>
import comMain from "./components/comMain.vue";
import comDown from "./components/comDown.vue";
import { ref, nextTick, onMounted } from "vue";
interface baseObject {
  [key: string]: any;
}
/**
 * comleft
 */

const leftAfterSelected = (selected: baseObject) => {
  commain.value.PageLoaded({
    ownId: selected.ownId,
    selectId: selected.projectId,
  });
};
const mainAfterSelected = (selected: baseObject) => {
  comdown.value.PageLoaded({
    ownId: selected.subPackageId,
    selectId: selected.subPackageId,
    rootId: selected.subPackageId,
  });
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
  commain.value.PageLoaded(uri);
}

const childMounted = () => {
  // alert();
};

nextTick(() => {
  PageLoaded({ rootId: "0" });
});
</script>