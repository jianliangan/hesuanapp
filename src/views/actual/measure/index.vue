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
        <div style="height: 500px">
          <com-main ref="commain" :AfterSelected="mainAfterSelected"></com-main>
          <div style="height: 300px; background-color: white">
            <span style="font-size: 14px">工料机:</span>
            <com-down ref="comdown"></com-down>
          </div>
        </div>
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
const mainAfterSelected = (selected: baseObject) => {
  comdown.value.PageLoaded(
    {
      ownId: selected.measureId,
      measureId: selected.measureId,
      rootId: selected.measureId,
    },
    selected.measureId
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