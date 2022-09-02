<template>

  <el-dialog v-model="ui_show_visible" title="字段新增" width="80%">

    <el-form label-width="120px" :data="pageCurrentItem">
      <el-form-item label="字段类型">
        <el-input v-model="pageCurrentItem.field_id" type="hidden" />
        <el-select v-model="pageCurrentItem.type" placeholder="选择">
          <el-option v-for="item in ui_btnconfoptions" :key="item.label" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="字段名称">
        <el-input v-model="pageCurrentItem.field_name" placeholder="" />
      </el-form-item>
      <el-form-item label="只api写">
        <el-radio-group v-model="pageCurrentItem.onlyapi" class="ml-4">
          <el-radio label="no" size="large">否</el-radio>
          <el-radio label="yes" size="large">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="api内容">
        <el-input type="textarea" rows="6" v-model="pageCurrentItem.apijson_ui" placeholder="" />
      </el-form-item>
      <el-form-item label="表格内容">
        <el-input type="textarea" rows="6" v-model="pageCurrentItem.tablejson_ui" placeholder="" />
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="handleFieldAddOk">确定</el-button>
  </el-dialog>

  <el-tabs type="border-card" v-model="activeName" class="demo-tabs">
    <!--表单设计-->

    <el-tab-pane label="表单设计" name="wfformd">

      <div class="common-layout" v-loading="loading">
        <el-container>
          <el-header>表单预览</el-header>
          <el-button size="small" round @click="handleFieldAdd()">增加</el-button>
          <el-main>
            <el-row>
              <el-col :span="24">
                <el-form label-width="120px" :data="pageListInfos">
                  <el-form-item v-for="(item, index) in pageListInfos" v-bind:key="index"
                    v-bind:label="item.field_name + '：'">
                    <el-space>
                      <template v-if="item.onlyapi == 'no'">
                        <el-input v-if="item.type == 's'" placeholder="输入字符" />

                        <el-col :span="20" v-else-if="item.type == 'd'">
                          <el-date-picker type="date" placeholder="选择日期" style="width: 100%" />
                        </el-col>

                        <el-col :span="20" v-else-if="item.type == 'm'">
                          <el-time-picker placeholder="选择时间" style="width: 100%" />
                        </el-col>

                        <el-input-number placeholder="输入数字" precision=2 v-else-if="item.type == 'i'" />
                        <el-table border :data="item.tablebody_ui"
                          v-else-if="item.type == 't' && item.table != undefined && item.tablebody_ui">
                          <el-table-column v-for="(val, index) in item.table" v-bind:key="index"
                            v-bind:label="val.label" width="200">
                            <template #header="scope">
                              <span v-if="index == item.table.length - 1">
                                <el-space>
                                  <span> {{ scope.column.label }}</span>
                                  <el-button size="small" icon="CirclePlus"
                                    @click="clk_add_tablerow(item.tablebody_ui)" />
                                </el-space>
                              </span>
                              <span v-else>
                                <span>{{ scope.column.label }}</span>
                              </span>
                            </template>
                            <template #default="scope">
                              <span>
                                <el-input v-if="val.type == 's'" placeholder="输入字符" />

                                <el-col :span="20" v-else-if="val.type == 'd'">
                                  <el-date-picker type="date" placeholder="选择日期" style="width: 100%" />
                                </el-col>

                                <el-col :span="20" v-else-if="val.type == 'm'">
                                  <el-time-picker placeholder="选择时间" style="width: 100%" />
                                </el-col>

                                <el-input-number placeholder="输入数字" precision=2 v-else-if="val.type == 'i'" />
                                <el-button size="small" v-if="index == item.table.length - 1" icon="Delete"
                                  @click="clk_delete_tablerow(item.tablebody_ui, scope.$index)" />
                              </span>
                            </template>

                          </el-table-column>
                        </el-table>
                      </template>
                      <template v-if="item.onlyapi == 'yes'">
                        <el-input disabled v-if="item.type == 's'" placeholder="输入字符" />

                        <el-col :span="20" v-else-if="item.type == 'd'">
                          <el-date-picker disabled type="date" placeholder="选择日期" style="width: 100%" />
                        </el-col>

                        <el-col :span="20" v-else-if="item.type == 'm'">
                          <el-time-picker disabled placeholder="选择时间" style="width: 100%" />
                        </el-col>

                        <el-input-number disabled placeholder="输入数字" precision=2 v-else-if="item.type == 'i'" />
                        <el-table border :data="item.tablebody_ui"
                          v-else-if="item.type == 't' && item.table != undefined && item.tablebody_ui">
                          <el-table-column v-for="(val, index) in item.table" v-bind:key="index"
                            v-bind:label="val.label" width="200">
                            <template #header="scope">
                              <span v-if="index == item.table.length - 1">
                                <el-space>
                                  <span> {{ scope.column.label }}</span>

                                </el-space>
                              </span>
                              <span v-else>
                                <span>{{ scope.column.label }}</span>
                              </span>
                            </template>
                            <template #default>
                              <span>
                                <el-input v-if="val.type == 's'" placeholder="输入字符" />

                                <el-col :span="20" v-else-if="val.type == 'd'">
                                  <el-date-picker type="date" placeholder="选择日期" style="width: 100%" />
                                </el-col>

                                <el-col :span="20" v-else-if="val.type == 'm'">
                                  <el-time-picker placeholder="选择时间" style="width: 100%" />
                                </el-col>

                                <el-input-number placeholder="输入数字" precision=2 v-else-if="val.type == 'i'" />

                              </span>
                            </template>

                          </el-table-column>
                        </el-table>
                      </template>


                      <el-button type="primary" :icon="Search" v-if="item.api != undefined"></el-button>
                      <el-button size="small" round @click="handleFieldUpdate(index)">修改</el-button>
                      <el-button size="small" round @click="handleFieldTop(index)">上移</el-button>
                      <el-button size="small" round @click="handleFieldDown(index)">下移</el-button>
                      <el-popconfirm title="确定要删除吗?" @confirm="handleFieldDelete(index)">
                        <template #reference>
                          <el-button size="small" round>删除</el-button>
                        </template>
                      </el-popconfirm>
                    </el-space>
                  </el-form-item>

                </el-form>

              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">

              </el-col>
            </el-row>
          </el-main>
        </el-container>
      </div>


      <!--方框结束-->
    </el-tab-pane>
    <!--流程节点-->
    <el-tab-pane label="流程节点" name="wfnoded">
      <div id="workflownodes">
        <jr-flow-draw ref="flowdraw_ref" :my_reques_flow_id="fieldUriParams.flow_id" />
      </div>
    </el-tab-pane>

  </el-tabs>
</template>
<script lang="ts" setup>
import { ref, reactive, h } from 'vue'
import jrFlowDraw from '@/components/jrFlow/index.vue'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import { Calendar, Search, CirclePlus, Delete } from '@element-plus/icons-vue'
import { interface_with_sort, myMessageBoxErr, tools_get_uniq_id, tools_sort_map, tools_sort_map_loop, tools_updateFieldSort } from '@/components/jrTools/index'
import { FieldUriParams, FlowFormFetch, flowFormFieldNewPush, FlowFormPush } from '@/api/model/flow'

class form_table_field_str {
  type: string = ""
  label: string = ""
  prop: string = ""
}
class form_api_str {
  api: string = ""
  params: string = ""
  list: string = ""
  return: string = ""
}
class customer_form_str implements interface_with_sort {

  field_id: string = ""
  flow_id: string = ""
  type: string = ""
  field_name: string = ""
  onlyapi: string = "no"
  api: form_api_str | undefined = undefined
  table: Array<form_table_field_str> | undefined = undefined
  tablebody_ui: Array<Map<string, string>> | undefined = undefined
  apijson_ui: string = ""
  tablejson_ui: string = ""
  sort: number = 0
  cmd_: string = ""
  init() {

    this.field_id = ""
    this.flow_id = ""
    this.type = ""
    this.field_name = ""
    this.onlyapi = "no"
    this.api = undefined
    this.table = undefined
    this.tablebody_ui = undefined
    this.apijson_ui = ""
    this.tablejson_ui = ""
    this.sort = 0
    this.cmd_ = ""


  }

}

const tabeldatatest = ref(new Array<string>())

const tableData = [
  {
    name: '',
  }]
//{ "label": "h","value":"" }隐藏
const ui_btnconfoptions = [{ "value": "s", "label": "字符类型" }, { "value": "i", "label": "数字类型" }, { "value": "d", "label": "日期类型" }, { "value": "m", "label": "时间类型" }, { "value": "t", "label": "表格类型" }]
let pageListInfos = ref(new Array<customer_form_str>())
const route = useRoute()
//tab内容

const activeName = ref('wfformd')

const pageCurrentItem = ref(new customer_form_str())
const ui_show_visible = ref(false)
const ui_update_will = ref(false)
const ui_cur_will_index = ref(0)
const flowdraw_ref = ref()
const loading = ref(true)
const fieldUriParams = reactive(new FieldUriParams())
const handleFieldAddOk = () => {
  pageCurrentItem.value.apijson_ui = ""
  pageCurrentItem.value.tablebody_ui?.splice(0)
  pageCurrentItem.value.tablejson_ui = ""
  if (ui_update_will.value) {
    pageCurrentItem.value.cmd_ = "edit"
  } else {
    pageCurrentItem.value.cmd_ = "add"
  }
  //PushFields(fieldPushParams)
  loading.value = true

  flowFormFieldNewPush([pageCurrentItem.value]).then((response: any) => {
    loading.value = false
    if (response.status == 200) {
      let body = response.data
      if (body["obj"] == "1") {
        /////////////////
        let api
        let table
        if (pageCurrentItem.value.apijson_ui.trim() != "")
          try {
            api = JSON.parse(pageCurrentItem.value.apijson_ui.trim())
          } catch (err: any) {
            alert(pageCurrentItem.value.field_name + "api内容 json格式错误" + err)
            return
          }

        else
          api = undefined

        if (pageCurrentItem.value.tablejson_ui.trim() != "")
          try {
            table = JSON.parse(pageCurrentItem.value.tablejson_ui.trim())
          } catch (err: any) {
            alert("表格内容 json格式错误" + err)
            return
          }

        else
          table = undefined



        if (ui_update_will.value) {
          let index = ui_cur_will_index.value
          pageListInfos.value[index].table = table
          pageListInfos.value[index].api = api
          pageListInfos.value[index].tablebody_ui?.splice(0)

        } else {
          pageListInfos.value.splice(ui_cur_will_index.value, 0, pageCurrentItem.value)
        }

        //tools_updateFieldSort(pageListInfos.value)
        tools_sort_map_loop<customer_form_str>(pageListInfos.value, 0, (a: customer_form_str): number => {
          return a.sort
        })
        ui_show_visible.value = false
        ///////////////
      } else {
        ElMessage.error('服务器错误！')
      }

    } else {
      myMessageBoxErr()
    }
  }).catch((err: any) => {
    loading.value = false
    myMessageBoxErr()
  })

}

const handleGetheader = (ob: any) => {
  if (ob.$index == ob.column.count)
    return h('span', ob.column.label)
  else
    return h('span', ob.column.label)
}
const clk_delete_tablerow = (row: Array<Map<string, string>> | undefined, index: number) => {
  if (row != undefined) {
    row.splice(index, 1)
  }
}
const clk_add_tablerow = (row: Array<Map<string, string>> | undefined) => {
  if (row != undefined) {
    row.push(new Map<string, string>())
  }
}

const handleFieldDelete = (index: number) => {

  let val = pageListInfos.value[index]
  pageCurrentItem.value = val
  pageCurrentItem.value.apijson_ui = ""
  pageCurrentItem.value.tablebody_ui?.splice(0)
  pageCurrentItem.value.tablejson_ui = ""
  pageCurrentItem.value.cmd_ = "delete"

  //fieldPushParamRow.cmd = "delete"

  loading.value = true
  flowFormFieldNewPush([pageCurrentItem.value]).then((response: any) => {
    loading.value = false
    if (response.status == 200) {
      let body = response.data
      if (body["obj"] == "1") {

        pageListInfos.value.splice(index, 1)
        ///tools_updateFieldSort(pageListInfos.value)
        tools_sort_map_loop<customer_form_str>(pageListInfos.value, 0, (a: customer_form_str): number => {
          return a.sort
        })
      } else {
        myMessageBoxErr()
      }

    } else {
      myMessageBoxErr()
    }
  }).catch((err: any) => {
    loading.value = false
    myMessageBoxErr()
  })



}
const handleFieldDown = (index: number) => {

  if (index == pageListInfos.value.length - 1)
    return
  //pageListInfos.value.splice(index, 2, pageListInfos.value[index + 1], pageListInfos.value[index])
  let tmpsortup = pageListInfos.value[index].sort
  let tmpsortdown = pageListInfos.value[index + 1].sort
  pageListInfos.value[index].sort = tmpsortdown
  pageListInfos.value[index + 1].sort = tmpsortup

  pageListInfos.value[index].cmd_ = "edit"

  pageListInfos.value[index + 1].cmd_ = "edit"



  loading.value = true
  flowFormFieldNewPush([pageListInfos.value[index], pageListInfos.value[index + 1]]).then((response: any) => {
    loading.value = false
    if (response.status == 200) {
      let body = response.data
      if (body["obj"] == "1") {


        tools_sort_map_loop<customer_form_str>(pageListInfos.value, 0, (a: customer_form_str): number => {
          return a.sort
        })
      } else {
        myMessageBoxErr()
      }

    } else {
      myMessageBoxErr()
    }
  }).catch((err: any) => {
    loading.value = false
    myMessageBoxErr()
  })


}
const handleFieldTop = (index: number) => {
  if (index == 0)
    return
  let top = pageListInfos.value[index - 1].sort
  let down = pageListInfos.value[index].sort
  pageListInfos.value[index - 1].sort = down
  pageListInfos.value[index].sort = top

  let val = pageListInfos.value[index]
  pageCurrentItem.value = val

  pageCurrentItem.value.apijson_ui = ""
  pageCurrentItem.value.tablebody_ui?.splice(0)
  pageCurrentItem.value.tablejson_ui = ""
  pageListInfos.value[index].cmd_ = "edit"
  pageListInfos.value[index - 1].cmd_ = "edit"

  loading.value = true
  flowFormFieldNewPush([pageListInfos.value[index], pageListInfos.value[index - 1]]).then((response: any) => {
    loading.value = false
    if (response.status == 200) {
      let body = response.data
      if (body["obj"] == "1") {

        tools_sort_map_loop<customer_form_str>(pageListInfos.value, 0, (a: customer_form_str): number => {
          return a.sort
        })
      } else {
        myMessageBoxErr()
      }

    } else {
      myMessageBoxErr()
    }
  }).catch((err: any) => {
    loading.value = false
    myMessageBoxErr()
  })
  //pageListInfos.value.splice(index - 1, 2, pageListInfos.value[index], pageListInfos.value[index - 1])

}

const handleFieldAdd = () => {
  pageCurrentItem.value = new customer_form_str()
  pageCurrentItem.value.init()
  pageCurrentItem.value.flow_id = fieldUriParams.flow_id
  pageCurrentItem.value.cmd_ = "add"
  let maxsort = 0

  for (let i = 0; i < pageListInfos.value.length; i++) {
    if (maxsort < pageListInfos.value[i]["sort"]) {
      maxsort = pageListInfos.value[i]["sort"]
    }
  }
  maxsort += 1
  pageCurrentItem.value["sort"] = maxsort
  ui_show_visible.value = true
  ui_update_will.value = false
  ui_cur_will_index.value = 0
}


const handleFieldUpdate = (index: number) => {
  let val = pageListInfos.value[index]
  pageCurrentItem.value = val
  pageCurrentItem.value.cmd_ = "edit"
  pageCurrentItem.value.apijson_ui = JSON.stringify(val.api)
  pageCurrentItem.value.tablejson_ui = JSON.stringify(val.table)
  if (pageCurrentItem.value.tablejson_ui == undefined) {
    pageCurrentItem.value.tablejson_ui = ""
  }
  if (pageCurrentItem.value.apijson_ui == undefined) {
    pageCurrentItem.value.apijson_ui = ""
  }

  ui_show_visible.value = true
  ui_update_will.value = true
  ui_cur_will_index.value = index
}

const Get_Fields_list = async (row: any) => {
  loading.value = true
  FlowFormFetch(row).then((response: any) => {
    pageListInfos.value.splice(0)
    if (response.status == 200) {
      let body = response.data


      for (let key in body["list"]) {
        let tmp = body["list"][key]
        pageListInfos.value.push(tmp)
      }
      tools_sort_map_loop<customer_form_str>(pageListInfos.value, 0, (a: customer_form_str): number => {
        return a.sort
      })
    }
    loading.value = false
  }).catch((err: any) => {
    loading.value = false
  })
}

const PageLoaded = () => {
  const route = useRoute()
  if (route.query["flow_id"] != undefined)
    fieldUriParams.flow_id = route.query["flow_id"].toString()
  else {
    fieldUriParams.flow_id = ""
  }


  Get_Fields_list(fieldUriParams)




}
PageLoaded()
</script>
<style>
.demo-tabs>.el-tabs__content {
  padding: 32px;

  font-size: 32px;
  font-weight: 600;
}
</style>

<style lang="scss">
.el-row {
  margin-bottom: 20px;


}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
<style scoped>
.el-link {
  margin-right: 8px;
}

.el-link .el-icon--right.el-icon {
  vertical-align: text-bottom;
}
</style>