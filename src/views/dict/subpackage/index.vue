<template>
  <el-container>
    <el-container direction="vertical">
      <el-main>
        <div style="height: 600px">
          <com-main ref="commain" :AfterSelected="mainAfterSelected"></com-main>

        </div>
        <div style="height: 400px; background-color: white">
          <span style="font-size: 14px">清单:</span>
          <com-down ref="comdown"></com-down>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script lang="ts" setup>
import comMain from "./components/comMain.vue";
import comDown from "./components/comDown.vue";
import { ref, nextTick, onMounted } from "vue";
import { ElMessage } from 'element-plus'
interface baseObject {
  [key: string]: any;
}
/**
 * comleft
 */

const leftAfterSelected = (selected: baseObject) => {
  commain.value.PageLoaded(
    {
      ownId: selected.ownId,
      selectId: selected.projectId,
    },
    selected.ownId
  );
};
const mainAfterSelected = (selected: baseObject) => {
  if (!selected || !selected.projectId) {
    ElMessage.error('发生错误：请选择项目')
    return;
  }
  comdown.value.PageLoaded({
    subPackageId: selected.subPackageId,
    projectId: selected.projectId
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