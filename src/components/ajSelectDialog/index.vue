<template>
  <el-dialog v-model="ui_dialog_visible" :title="props.Title" width="50%">
    <el-space direction="vertical">
      <el-space alignment="top">
        <div>
          <el-space direction="vertical" class="myspace">
            <el-tag v-for="(item, index) in selected_tags" closable :key="index" :type="color_config_array[0]"
              @close="selected_tags_close(index)">
              {{ props.GetMainName(item) }}
            </el-tag>
          </el-space>
        </div>
        <el-divider direction="vertical" style="height: 100%" />
        <el-table :data="filterTableData" style="width: 100%" height="300" :loading="loading">
          <el-table-column width="180">
            <template #header>
              <el-space><span>总条数({{ node_number }})</span>
              </el-space>
            </template>
            <template #default="scope">
              {{ props.GetMainName(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column width="150">
            <template #header>
              <el-input v-model="search" size="small" placeholder="搜索" />
            </template>

            <template #default="scope">
              <el-button size="small" round @click="handleSelect(scope.row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-space>
      <el-button type="primary" v-if="props.MultiSelete" class="my-smallbutton" @click="handleSave">
        确认
      </el-button>
    </el-space>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, defineExpose, defineEmits } from "vue";
import {
  tools_objToobj,
  tools_sort_map_loop,
} from "@/components/jrTools/index";
interface baseObject {
  [key: string]: any;
}
const loading = ref(false);
const listUriParams = {} as baseObject;
let selected_tags = ref(new Array<baseObject>());
let nodes_map = new Map<String, baseObject>();
let nodes_list = ref(new Array<baseObject>());
const search = ref("");

const node_number = ref(0);
const props = defineProps({
  MainContentFetchList: {
    type: Function,
    default: null,
  },
  MultiSelete: {
    type: Boolean,
    default: false,
  },
  ClkOk: {
    type: Function,
    default: null,
  },
  GetTreePrimeId: {
    type: Function,
    default: null,
  },
  GetMainName: {
    type: Function,
    default: null,
  },
  Title: {
    type: String,
    default: "",
  },
});
const color_config_array = ["", "success", "info", "warning", "danger"];
const ui_dialog_visible = ref(false);

const allemits = defineEmits(["patheditok"]);
const filterTableData = computed(() =>
  nodes_list.value.filter(
    (data) =>
      !search.value ||
      data.node_name.toLowerCase().includes(search.value.toLowerCase())
  )
);
const handleSave = () => {
  if (props.ClkOk) props.ClkOk(selected_tags.value);
  ui_dialog_visible.value = false;
};

const handleSelect = (row: baseObject) => {
  selected_tags.value.push(row);
  if (props.ClkOk) props.ClkOk([row]);
  if (!props.MultiSelete) {
    ui_dialog_visible.value = false;
  }
};

const selected_tags_close = (index: number) => {
  selected_tags.value.splice(index, 1);
};

const AfterSelected = async (row: any, selected: Array<String>) => {
  loading.value = true;

  if (props.MainContentFetchList)
    props
      .MainContentFetchList(row)
      .then((resdata: any) => {
        nodes_list.value = resdata.list;
        for (let i = 0; i < resdata.list.length; i++) {
          let value = resdata.list[i];
          nodes_map.set(props.GetTreePrimeId(value), value);
        }
        //

        for (var i = 0; i < selected.length; i++) {
          let nodeid = selected[i];
          let node = nodes_map.get(nodeid);
          if (node !== undefined) {
            selected_tags.value.push(node);
          }
        }

        //

        node_number.value = nodes_list.value.length;
        loading.value = false;
      })
      .catch((err: any) => {
        loading.value = false;
      });
};

function PageLoaded(uri: baseObject, selected: Array<String>) {
  selected_tags.value?.splice(0);
  ui_dialog_visible.value = true;
  nodes_list.value?.splice(0);
  tools_objToobj(uri, listUriParams);
  AfterSelected(uri, selected);
}
defineExpose({ PageLoaded });
</script>
<style scoped>
.myspace {
  margin-right: 40px;
}

.el-table>>>.header-row th {
  background-color: #81d3f8 !important;
  color: #333333;
  font-size: 10px;
  font-weight: normal;
  line-height: 10px;
  padding-top: 3px;
  padding-bottom: 3px;
}

.el-table>>>td {
  font-size: 10px;
  font-weight: normal;
  line-height: 10px;
  padding-top: 3px;
  padding-bottom: 3px;
}

.el-table>>>td span {
  font-size: 10px;
  font-weight: normal;
  line-height: 10px;
  padding: 3px;
}

.el-table>>>td .cell {
  font-size: 10px;
  font-weight: normal;
  line-height: 10px;
  padding: 3px;
  margin: 3px;
}

.el-table>>>td button {
  font-size: 10px;
  font-weight: normal;
  line-height: 10px;
  padding: 0px;
  margin: 0px;
  height: 16px;
}

.el-dialog .my-smallbutton {
  font-size: 10px;
  padding-top: 3px;
  padding-bottom: 3px;
  font-weight: normal;
  line-height: 10px;
}
</style>