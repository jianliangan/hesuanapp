<template>
  <aj-Tree ref="ajtree" :LeftTreeFetchList="SubPackageList" :GroupsProps="groupsProps"
    :GetTreePrimeName="getTreePrimeName" :AfterSelected="afterSelected" :GetTreePrimeId="getTreePrimeId"></aj-Tree>
</template>
<script lang="ts" setup>
import numbro from "numbro";

import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.min.css";

import { ProjectFetchTree } from "@/api/model/home/project";
import { SubPackageList } from "@/api/model/dict/subpackage";
import { tools_objToobj } from "@/components/jrTools";
import { ref, nextTick, defineProps, defineEmits, onMounted } from "vue";

interface baseObject {
  [key: string]: any;
}
const props = defineProps({
  AfterSelected: {
    type: Function,
    default: null,
  },
});
/**
 * left tree
 */
const ajtree = ref<baseObject>({});
const groupsProps = {
  value: "subPackageId",
  label: "subPackageName",
  emitPath: false,
  checkStrictly: true,
};
const getTreePrimeId = (item: baseObject, value: Object) => {
  if (value != null) item.subPackageId = value;

  return item.subPackageId;
};
const getTreePrimeName = (item: baseObject, value: Object) => {
  if (value != null) item.subPackageName = value;
  return item.subPackageName;
};

const afterSelected = (selected: baseObject) => {
  if (props.AfterSelected) props.AfterSelected(selected);
};

/**
 * this api
 */
function PageLoaded(uri: baseObject) {
  ajtree.value.PageLoaded(uri);
}
defineExpose({ PageLoaded });
</script>