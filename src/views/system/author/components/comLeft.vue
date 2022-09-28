<template>
  <aj-Tree
    ref="ajtree"
    :LeftTreeFetchList="RoleFetchList"
    :GroupsProps="groupsProps"
    :GetTreePrimeName="getTreePrimeName"
    :AfterSelected="afterSelected"
    :GetTreePrimeId="getTreePrimeId"
  ></aj-Tree>
</template>
<script lang="ts" setup>
import numbro from "numbro";

import { RoleFetchList } from "@/api/model/system/role";

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
  value: "roleId",
  label: "roleName",
  emitPath: false,
  checkStrictly: true,
};
const getTreePrimeId = (item: baseObject, value: Object) => {
  if (value != null) item.roleId = value;

  return item.roleId;
};
const getTreePrimeName = (item: baseObject, value: Object) => {
  if (value != null) item.roleName = value;
  return item.roleName;
};

const afterSelected = (selected: baseObject) => {
  props.AfterSelected(selected);
};

/**
 * this api
 */
function PageLoaded(uri: baseObject) {
  ajtree.value.PageLoaded(uri);
}
defineExpose({ PageLoaded });
</script>