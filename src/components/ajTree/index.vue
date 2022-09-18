<template>
  <el-container v-loading="showasideing">
    <el-header>
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText"
        clearable
      ></el-input>
    </el-header>
    <el-main class="nopadding">
      <el-tree
        ref="mytree"
        node-key="projectId"
        :highlight-current="true"
        :data="organizedata"
        :props="props?.GroupsProps"
        @node-click="leftRowClick"
      ></el-tree>
    </el-main>
  </el-container>
</template>
    
    <script lang="ts" setup>
import { nextTick, ref, watch, defineProps } from "vue";

interface baseObject {
  [key: string]: any;
}

const organizedata = ref(new Array<baseObject>());
let organizedata2 = new Array<any>();

/**
 * need to change
 * api call
 */

const mytree = ref<baseObject>({});
const filterText = ref("");
const showasideing = ref(false);
const loading = ref(false);

const listUriParams = {} as baseObject;
const props = defineProps({
  LeftTreeFetchList: {
    type: Function,
    default: null,
  },

  GetTreePrimeId: {
    type: Function,
    default: null,
  },
  GetTreePrimeName: {
    type: Function,
    default: null,
  },
  GroupsProps: {
    type: Object,
    required: true,
  },

  TreeSelectNode: {
    type: Function,
    default: null,
  },
});

//
watch(filterText, (newValue, oldValue) => {
  organizedata.value = organizedata2.filter((data) => {
    if (newValue) {
      return props
        .GetTreePrimeName(data, null)
        .toLowerCase()
        .includes(newValue);
    } else {
      return true;
    }
  });
});

const FetchLeftTreeDataList = async (row: baseObject) => {
  showasideing.value = true;

  props
    .LeftTreeFetchList(row)
    .then((response: any) => {
      organizedata.value = organizedata2 = response["list"];

      nextTick(() => {
        if (props.GetTreePrimeId)
          mytree.value!.setCurrentKey(
            props?.GetTreePrimeId(organizedata.value[0], null)
          );

        if (props.TreeSelectNode && props?.GetTreePrimeId)
          props.TreeSelectNode(listUriParams, organizedata.value[0]);
      });
      showasideing.value = false;
    })
    .catch((err: any) => {
      showasideing.value = false;
    });
};

//event handles
const leftRowClick = (data: any) => {
  if (props.GetTreePrimeId) {
    if (
      props?.GetTreePrimeId(data) == 0 ||
      props?.GetTreePrimeId(data) == undefined ||
      props?.GetTreePrimeId(data) == ""
    )
      return;
  }
  if (props.TreeSelectNode) {
    props.TreeSelectNode(listUriParams, data);
  }
};

function PageLoaded() {
  if (props.PreFirstGetData) props.PreFirstGetData(listUriParams);
  FetchLeftTreeDataList(listUriParams);
}
PageLoaded();
</script>

<style>
.el-main {
  padding: 0px;
}
</style>
  
    