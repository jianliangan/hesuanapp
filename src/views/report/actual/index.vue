
<template>
  <el-container>
    <el-aside width="200px" class="ajtree">
      <com-left
        ref="comleft"
        @init="init"
        :AfterSelected="leftAfterSelected"
        class="adminui"
      ></com-left>
      <div class="adminui-side-bottom" @click="a">
          <el-icon>
            <el-icon-expand v-if="menuIsCollapse" />
            <el-icon-fold v-else />
          </el-icon>
        </div>
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
      ownId: selected.ownId,
      projectId: selected.projectId,
      cmd: "sj",
    },
    selected.ownId
  );
};
function a() {
  const className=document.getElementsByClassName('el-aside ajtree')[0];
  const inputa=document.getElementsByClassName('el-input__wrapper')[0];
  console.log(className.offsetWidth)
  if(className.offsetWidth == 200){
    className.style.width="20px";
    inputa.style.display="none"
  }else{
    className.style.width="200px";
    inputa.style.display=""
  }
}
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
<style>
element.style {
    --el-aside-width: 0px;
}
.adminui{
  height: 92.6%;
}
.ajtree{
  width: 200px;
}
/* .nopadding{
  display: none;
} */
</style>