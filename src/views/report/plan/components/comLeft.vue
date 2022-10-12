<template>
  <aj-Tree ref="ajtree" :LeftTreeFetchList="ProjectFetchTree" :GroupsProps="groupsProps"
    :GetTreePrimeName="getTreePrimeName" :AfterSelected="afterSelected" :GetTreePrimeId="getTreePrimeId"></aj-Tree>
</template>
<script lang="ts" setup>
import numbro from "numbro";

import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.min.css";

import { ProjectFetchTree } from "@/api/model/home/project";
import {
  BudgetDivisionPushRow,
  BudgetDivisionTree,
} from "@/api/model/budget/division";
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
  value: "projectId",
  label: "projectName",
  emitPath: false,
  checkStrictly: true,
};
const getTreePrimeId = (item: baseObject, value: Object) => {
  if (value != null) item.projectId = value;

  return item.projectId;
};
const getTreePrimeName = (item: baseObject, value: Object) => {
  if (value != null) item.projectName = value;
  return item.projectName;
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