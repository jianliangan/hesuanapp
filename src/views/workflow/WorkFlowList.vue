<template>

  <el-dialog v-model="dialogAddVisible" title="新增" width="50%">

    <el-form :model="pageCurrentItem" label-width="120px">

      <el-form-item label="流程名称">
        <el-input v-model="pageCurrentItem.flow_name" />
      </el-form-item>

      <el-form-item label="流程描述">
        <el-input v-model="pageCurrentItem.desc" type="textarea" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :loading="SubMitLoading" @click="onSubmit"><span
            v-if="dialogIsAdd == true">保存增加</span><span v-else>保存修改</span>
        </el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>
  <div style="float:right">
    <el-button text type="primary" @click="clk_add_flow">新增</el-button>
  </div>

  <el-table v-loading="loading" :data="pageListInfos" stripe style="width: 100%">
    <el-table-column prop="flow_name" label="流程名称" width="180" />
    <el-table-column prop="lastre" label="发布时间" width="180" />
    <el-table-column prop="desc" label="更新时间" width="180" />
    <el-table-column label="操作">
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
        <span>
          <el-button text type="primary" @click.stop="handleManageRow(scope2.row)">详情管理</el-button>
        </span>
      </template>
    </el-table-column>
  </el-table>
  <div style="float:right;margin: 20px;">
    <el-pagination layout="prev, pager, next" :total="flowListNum" :page-size="flowPageSize" small background
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>

</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'//
import { getCurrentInstance, ref } from 'vue'
import { reactive } from 'vue'
import { module_in } from '@/api/modtype'
import { ts_object } from '@/utils/common'
import { FlowFetchList, FlowPushRow } from '@/api/model/flow'
import { Action } from 'vuex'
class ListUriParams {
  page: number = 1
}
// do not use same name with ref
class flow_info_str {
  lastre: string
  flow_name: string
  desc: string
  flow_id: string
  cmd_: string
  constructor () {
    this.desc = ""
    this.lastre = ""
    this.flow_name = ""
    this.flow_id = ""
    this.cmd_ = ""

  }
  init() {
    this.desc = ""
    this.lastre = ""
    this.flow_name = ""
    this.flow_id = ""
    this.cmd_ = ""
  }
}
const dialogAddVisible = ref(false)
const dialogIsAdd = ref(true)
const loading = ref(true)
const flowListNum = ref(0)
const flowPageSize = ref(0)
const SubMitLoading = ref(false)
const pageCurrentItem = ref(new flow_info_str)
const router = useRouter()
const cns = getCurrentInstance()
const listUriParams = new ListUriParams()
const listUriParamspage = ref(0)
const pageListInfos = ref(new Array<ts_object>())
const clk_add_flow = () => {
  pageCurrentItem.value = new flow_info_str
  pageCurrentItem.value.cmd_ = "add"
  dialogIsAdd.value = true
  dialogAddVisible.value = true
  SubMitLoading.value = false

}
const handleSizeChange = (val: number) => {

}
const handleCurrentChange = (val: number) => {

  listUriParams.page = val
  Get_workflow_list(listUriParams)

}
const handleManageRow = (row: flow_info_str) => {
  //: '/user', params: { username }
  //{ path: '/register', query: { plan: 'private' } 
  router.push({
    path: '/flowedit',
    query: { flow_id: row.flow_id }
    // name: 'WorkFlowEdit',
    // params: {
    //   id: row.flow_id
    // }

  })
}
function clk_edit_flow(row: flow_info_str) {

  pageCurrentItem.value = row
  pageCurrentItem.value.cmd_ = "edit"
  dialogIsAdd.value = false
  SubMitLoading.value = false
  dialogAddVisible.value = true
}


const Get_workflow_list = async (row: any) => {
  loading.value = true
  FlowFetchList(row).then((response: any) => {
    pageListInfos.value.splice(0)
    if (response.status == 200) {
      let body = response.data

      flowListNum.value = body["num"]
      flowPageSize.value = body["size"]

      for (let key in body["list"]) {
        let tmp = body["list"][key]

        pageListInfos.value.push(tmp)
      }
    }
    loading.value = false
  }).catch((err: any) => {
    loading.value = false
  })
}

const PageLoaded = () => {

  Get_workflow_list(listUriParams)
}
PageLoaded()
const AddWorkFlowRow = async (body: any) => {

  FlowPushRow(body).then((response: any) => {

    if (response.status == 200) {
      let body = response.data
      Get_workflow_list(listUriParams)
      dialogAddVisible.value = false
    }

  })
}
const EditWorkFlowRow = async (body: any) => {

  FlowPushRow(body).then((response: any) => {

    if (response.status == 200) {
      let body = response.data
      Get_workflow_list(listUriParams)
      dialogAddVisible.value = false

    }

  })
}
const DelWorkFlowRow = async (body: any) => {
  FlowPushRow(body).then((response: any) => {

    if (response.status == 200) {
      let body = response.data
      Get_workflow_list(listUriParams)

    }

  })
}
const onCancel = () => {
  dialogAddVisible.value == false
}

const onSubmit = () => {
  if (pageCurrentItem.value.flow_name.trim() == "")
    return
  SubMitLoading.value = true
  console.log("iiiiiiiiiiiiiiii", pageCurrentItem.value)
  if (dialogIsAdd.value == true) {
    AddWorkFlowRow(pageCurrentItem.value)
  } else {
    EditWorkFlowRow(pageCurrentItem.value)
  }
}
function deleteRow(row: flow_info_str) {
  row.cmd_ = "delete"
  DelWorkFlowRow(row)
}




</script>
