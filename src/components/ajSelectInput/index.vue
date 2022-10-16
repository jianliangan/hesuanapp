<template>
  <el-select v-model="conditionValue" filterable :placeholder="props.Placeholder" @change="onchange">
    <el-option v-for="item in conditionOptions" :key="item.value" :label="item.label" :value="item.value"
      popper-class="eloption" />
  </el-select>
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
const conditionValue = ref("");
const conditionOptions = ref(new Array<baseObject>());
const loading = ref(false);
const listUriParams = {} as baseObject;

const search = ref("");

const props = defineProps({
  MainContentFetchList: {
    type: Function,
    default: null,
  },
  ItemSelect: {
    type: Function,
    default: null,
  },

  GetMainPrimeId: {
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
  Placeholder: {
    type: String,
    default: "请选择",
  }
});
const color_config_array = ["", "success", "info", "warning", "danger"];
const ui_dialog_visible = ref(false);

const allemits = defineEmits(["patheditok"]);
const onchange = (value: String) => {
  change(value);
};
const change = (value: String) => {
  if (props.ItemSelect) props.ItemSelect(value);
};

const LoadData = async (row: any) => {
  loading.value = true;
  conditionOptions.value.splice(0);
  if (props.MainContentFetchList)

    props
      .MainContentFetchList(row)
      .then((resdata: any) => {
        for (let i = 0; i < resdata.list.length; i++) {
          let value = resdata.list[i];

          conditionOptions.value?.push({
            value: props.GetMainPrimeId(value),
            label: props.GetMainName(value),
          });
        }
        //
        if (conditionOptions.value.length > 0) {
          conditionValue.value = conditionOptions.value[0].value;
          change(conditionValue.value);
        }

        loading.value = false;
      })
      .catch((err: any) => {
        loading.value = false;
      });
};

function PageLoaded(uri: baseObject) {
  ui_dialog_visible.value = true;

  tools_objToobj(uri, listUriParams);
  LoadData(uri);
  //
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
<style>
/*
.el-select-dropdown .el-select-dropdown__wrap {
 background-color: bisque !important;
  max-height: 150px !important;
}*/
</style>