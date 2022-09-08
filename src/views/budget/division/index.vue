<template>
  <el-dialog v-model="dialogAddVisible" title="新增" width="50%">
    <el-form :model="form" label-width="120px">
      <el-form-item label="上级名称">
        <el-cascader
          v-model="form.parentid"
          :options="tableData"
          :props="groupsProps"
          clearable
        />
      </el-form-item>
      <el-form-item label="架构名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="架构描述">
        <el-input v-model="form.desc" />
      </el-form-item>
      <el-form-item label="架构排序">
        <el-input v-model="form.sort" />
      </el-form-item>
      <el-form-item label="架构状态">
        <el-switch
          v-model="form.status"
          :active-value="1"
          :inactive-value="0"
        ></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="SubMitLoading" @click="onSubmit"
          ><span v-if="dialogIsAdd == true">保存增加</span
          ><span v-else>保存修改</span>
        </el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-container>
    <el-aside width="200px" v-loading="showasideing">
      <el-container>
        <el-header>
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText"
            clearable
          ></el-input>
        </el-header>
        <el-main class="nopadding">
          <el-tree
            :data="organizedata"
            :props="groupsProps"
            @node-click="leftRowClick"
          ></el-tree>
        </el-main>
      </el-container>
    </el-aside>
    <el-container>
      <el-header>
        <el-upload
          class="upload-demo"
          action="http://localhost:8001/budget/import/"
          multiple
          :limit="1"
          :on-exceed="handleExceed"
          :on-success="handleSuccess"
        >
          <el-button type="primary">导入</el-button>
          <template #tip>
            <div class="el-upload__tip">
              jpg/png files with a size less than 500KB.
            </div>
          </template>
        </el-upload>

        <el-button type="primary" @click="clk_add_flow">新增</el-button>
      </el-header>
      <el-main class="nopadding">
        <el-table
          v-loading="loading"
          :data="tableData"
          row-key="id"
          border
          default-expand-all
          stripe
          style="width: 100%"
        >
          <el-table-column prop="username" label="用户名称" width="180" />
          <el-table-column prop="avatar" label="头像" width="180" />
          <el-table-column prop="email" label="邮箱" width="180" />
          <el-table-column prop="phone" label="手机号" width="180" />
          <el-table-column label="部门" width="180">
            <template #default="scope">
              {{ organizes.get(scope.row.organize_str_id)?.name }}
            </template>
          </el-table-column>
          <el-table-column prop="business_name" label="业务" width="180">
            <template #default="scope">
              {{ businesses.get(scope.row.business_str_id)?.name }}
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作">
						<template #default="scope2">

							<el-popconfirm title="确定删除吗" @confirm="deleteRow(scope2.row)">
								<template #reference>
									<el-button link type="primary" size="small">
										删除
									</el-button>
								</template>
							</el-popconfirm>
							<span>
								<el-button text type="primary" @click.stop="clk_edit_flow(scope2.row)">编辑</el-button>
							</span>

						</template>
					</el-table-column> -->
        </el-table>
        <div style="float: right; margin: 20px">
          <el-pagination
            layout="prev, pager, next"
            :total="flowListNum"
            :page-size="flowPageSize"
            small
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router"; //
import { getCurrentInstance, ref } from "vue";
import { reactive, watch } from "vue";
import { module_in } from "@/api/modtype";
import { ts_object } from "@/utils/common";
import { FlowFetchList } from "@/api/model/flow";
import { Action } from "vuex";
import {
  interface_with_sort,
  tools_objToobj,
} from "@/components/jrTools/index";
import {
  OrganizeFetchList,
  OrganizePushRow,
  UserFetchList,
} from "@/api/model/setting";
import { ElMessage, UploadFile, UploadFiles, UploadProps } from "element-plus";
class ListUriParams {
  page: number = 1;
  id: string = "";
}
const groupsProps = {
  value: "id",
  label: "name",
  emitPath: false,
  checkStrictly: true,
};
// do not use same name with ref

class table_info_str {
  id: string;
  parentid: string;
  name: string;
  dtime: string;
  desc: string;
  status: number;
  sort: number;
  cmd_: string;
  children: Array<table_info_str>;
  constructor() {
    this.id = "";
    this.parentid = "";
    this.name = "";
    this.dtime = "";
    this.desc = "";
    this.status = 0;
    this.sort = 0;
    this.cmd_ = "";
    this.children = new Array<table_info_str>();
  }
  init() {
    this.id = "";
    this.parentid = "";
    this.name = "";
    this.dtime = "";
    this.desc = "";
    this.status = 0;
    this.sort = 0;
    this.children = new Array<table_info_str>();
  }
}
const dialogAddVisible = ref(false);
const dialogIsAdd = ref(true);
const loading = ref(true);
const showasideing = ref(false);
const flowListNum = ref(0);
const flowPageSize = ref(0);
const organizedata = ref(new Array<any>());
let organizedata2 = new Array<any>();

interface keyable {
  [key: string]: any;
}

let organizes = new Map<string, any>();
let businesses = new Map<string, any>();
const filterText = ref("");

const SubMitLoading = ref(false);
const form = reactive(new table_info_str());
const router = useRouter();
const cns = getCurrentInstance();
const listUriParams = new ListUriParams();
const listUriParamspage = ref(0);
const tableData = ref(new Array<ts_object>());
const leftRowClick = (data: any) => {
  listUriParams.id = data.id;

  Get_Data_list_middle(listUriParams);
};
const clk_add_flow = () => {
  dialogIsAdd.value = true;
  dialogAddVisible.value = true;
  SubMitLoading.value = false;
  form.init();
};
const handleExceed: UploadProps["onExceed"] = (files, uploadFiles) => {
  ElMessage.warning(
    `The limit is 3, you selected ${files.length} files this time, add up to ${
      files.length + uploadFiles.length
    } totally`
  );
};
const handleError: UploadProps["onError"] = (
  error: Error,
  uploadFile: UploadFile,
  uploadFiles: UploadFiles
) => {
  ElMessage.info(`success ${error.name} ${error.message} `);
};
const handleSuccess: UploadProps["onSuccess"] = (
  response: any,
  uploadFile: UploadFile,
  uploadFiles: UploadFiles
) => {
  ElMessage.info(`success ${uploadFile.name} `);
};
const handleSizeChange = (val: number) => {};
const handleCurrentChange = (val: number) => {
  listUriParams.page = val;
  Get_Data_list_middle(listUriParams);
};
const handleManageRow = (row: table_info_str) => {
  //: '/user', params: { username }
  //{ path: '/register', query: { plan: 'private' }
  router.push({
    path: "/flowedit",
    query: { id: row.id },
    // name: 'WorkFlowEdit',
    // params: {
    //   id: row.id
    // }
  });
};
function clk_edit_flow(row: table_info_str) {
  // form.desc = row.desc
  // form.flow_name = row.
  // 	form.id = row.id

  tools_objToobj(row, form);

  dialogIsAdd.value = false;
  SubMitLoading.value = false;
  dialogAddVisible.value = true;
}

watch(filterText, (newValue, oldValue) => {
  organizedata.value = organizedata2.filter((data) => {
    if (newValue) {
      return data.name.toLowerCase().includes(newValue);
    } else {
      return true;
    }
  });
  var allNode = { id: "", name: "所有" };
  organizedata.value.unshift(allNode);
});

const Get_Data_list = async (row: any) => {
  loading.value = true;
  dialogAddVisible.value = true;
  OrganizeFetchList(row)
    .then((response: any) => {
      tableData.value.splice(0);

      if (response.status == 200) {
        let body = response.data;

        //flowListNum.value = body["num"]
        //flowPageSize.value = body["size"]
        organizedata.value = organizedata2 = body["list"];
        var allNode = { id: "", name: "所有" };
        organizedata.value.unshift(allNode);
      }
      dialogAddVisible.value = false;
    })
    .catch((err: any) => {
      dialogAddVisible.value = false;
    });
};
const Get_Data_list_middle = async (row: any) => {
  loading.value = true;

  UserFetchList(row)
    .then((response: any) => {
      tableData.value.splice(0);

      if (response.status == 200) {
        let body = response.data;

        //flowListNum.value = body["num"]
        //flowPageSize.value = body["size"]
        tableData.value = body["list"]["user"];

        let organtmp: Array<keyable> = body["list"]["organize"];
        for (let i = 0; i < organtmp.length; i++) {
          let value = organtmp[i];
          organizes.set(value.id, value);
        }
        let businestmp = body["list"]["business"];
        for (let i = 0; i < businestmp.length; i++) {
          let value = businestmp[i];
          businesses.set(value.id, value);
        }
      }
      loading.value = false;
    })
    .catch((err: any) => {
      loading.value = false;
    });
};
const PageLoaded = () => {
  Get_Data_list(listUriParams);
  Get_Data_list_middle(listUriParams);
};
PageLoaded();
const PushDataRow = async (body: any) => {
  OrganizePushRow(body).then((response: any) => {
    if (response.status == 200) {
      let body = response.data;
      Get_Data_list(listUriParams);
      dialogAddVisible.value = false;
    }
  });
};

const onCancel = () => {
  dialogAddVisible.value == false;
};

const onSubmit = () => {
  if (form.name.trim() == "") return;
  SubMitLoading.value = true;
  if (dialogIsAdd.value == true) {
    form.cmd_ = "add";
  } else {
    form.cmd_ = "edit";
  }

  PushDataRow(form);
};
function deleteRow(row: any) {
  row.cmd_ = "delete";
  PushDataRow(row);
}

////////////////////
interface Tree {
  label: string;
  children?: Tree[];
}

const handleNodeClick = (data: Tree) => {};

const data: Tree[] = [
  {
    label: "Level one 1",
    children: [
      {
        label: "Level two 1-1",
        children: [
          {
            label: "Level three 1-1-1",
          },
        ],
      },
    ],
  },
  {
    label: "Level one 2",
    children: [
      {
        label: "Level two 2-1",
        children: [
          {
            label: "Level three 2-1-1",
          },
        ],
      },
      {
        label: "Level two 2-2",
        children: [
          {
            label: "Level three 2-2-1",
          },
        ],
      },
    ],
  },
  {
    label: "Level one 3",
    children: [
      {
        label: "Level two 3-1",
        children: [
          {
            label: "Level three 3-1-1",
          },
        ],
      },
      {
        label: "Level two 3-2",
        children: [
          {
            label: "Level three 3-2-1",
          },
        ],
      },
    ],
  },
];

const defaultProps = {
  children: "children",
  label: "label",
};
</script>
