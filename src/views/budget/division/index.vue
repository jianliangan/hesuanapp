<template>
  <el-container>
    <el-aside width="200px" class="ajtree">
      <com-left ref="comleft" @init="init" :AfterSelected="leftAfterSelected" class="adminui"></com-left>
      <!-- <div class="adminui-side-bottom left-right" @click="a">
        <el-icon class="">
          <el-icon-expand v-if="menuIsCollapse" />
            <el-icon-fold v-else />
          
            <CaretLeft class="jianto9" />

          <CaretRight />
        </el-icon>
      </div> -->
    </el-aside>

    <el-container direction="vertical">
      <el-main>
        <div style="height: 500px">
          <com-main ref="commain" :AfterSelected="mainAfterSelected" :CheckUpfile="checkUpfile"></com-main>
        </div>
        <div style="height: 300px; background-color: white">
          <span style="font-size: 12px">工料机:</span>
          <com-down ref="comdown"></com-down>
        </div>

      </el-main>
    </el-container>
  </el-container>
</template>
<script lang="ts" setup>
import comLeft from "./components/comLeft.vue";
import { CaretLeft, CaretRight, Refresh } from "@element-plus/icons-vue";
import comMain from "./components/comMain.vue";
import comDown from "./components/comDown.vue";
import { ref, nextTick, onMounted } from "vue";
interface baseObject {
  [key: string]: any;
}
/**
 * comleft
 */
// function a() {
//   setTimeout(() => {
//     var ev = new Event("pagecontentCollapse", { "bubbles": true, "cancelable": true });
//     document.dispatchEvent(ev);
//   }, 300);
//   const className = document.getElementsByClassName('el-aside ajtree')[0];
//   const inputa = document.getElementsByClassName('el-input__wrapper')[0];
//   const jianto = document.getElementsByClassName('jianto9')[0];
//   if (className.offsetWidth == 200) {
//     className.style.width = "20px";
//     inputa.style.display = "none";
//     jianto.style.transform = "rotate(180deg)";
//   } else {
//     className.style.width = "200px";
//     inputa.style.display = "";
//     jianto.style.transform = "";
//   }
// }
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
const checkUpfile = () => {
  let node = comleft.value.GetCurrentTreeNode();
  if (node.level != 3)
    return "只有单位工程可以导入"
  else
    return "";
}
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
<style>
element.style {
  --el-aside-width: 0px;
}

.adminui {
  height: 92.6%;
}

.ajtree {
  width: 200px;
}

/* .nopadding{
  display: none;
} */
</style>