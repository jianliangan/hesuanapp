
<template>
  <el-container>
    <el-aside width="200px" class="ajtree">
      <com-left ref="comleft" :AfterSelected="leftAfterSelected" class="adminui"></com-left>
      <div class="adminui-side-bottom left-right" @click="a">
        <el-icon class="">
          <!-- <el-icon-expand v-if="menuIsCollapse" />
            <el-icon-fold v-else /> -->
          <CaretLeft class="jiantoa" />
          <!-- <CaretRight /> -->
        </el-icon>
      </div>
    </el-aside>
    <el-container direction="vertical">
      <com-main ref="commain" :AfterSelected="mainAfterSelected"></com-main>
    </el-container>
  </el-container>
</template>
<script lang="ts" setup>
import comLeft from "./components/comLeft.vue";
import comMain from "./components/comMain.vue";
import { CaretLeft, CaretRight } from "@element-plus/icons-vue";
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
function a() {
  setTimeout(() => {
    var ev = new Event("pagecontentCollapse", { "bubbles": true, "cancelable": true });
    document.dispatchEvent(ev);
  }, 300);
  const className = document.getElementsByClassName('el-aside ajtree')[0];
  const inputa = document.getElementsByClassName('el-input__wrapper')[0];
  const jianto = document.getElementsByClassName('jiantoa')[0];
  if (className.offsetWidth == 200) {
    className.style.width = "20px";
    inputa.style.display = "none";
    jianto.style.transform = "rotate(180deg)";
  } else {
    className.style.width = "200px";
    inputa.style.display = "";
    jianto.style.transform = "";
  }
}
const mainAfterSelected = (selected: baseObject) => { };
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