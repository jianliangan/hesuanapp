<template>

  <div class="hello" v-loading="loading" style="background-color: beige;" @mousemove="flowpagemousemove">

    <NodeEdit ref="view_node_edit" @nodeeditok="event_nodeeditok_cb" :my_reques_flow_id="props.my_reques_flow_id">
    </NodeEdit>

    <svg :width="mysvgWidth" :height="mysvgHeight" style="background-color: white;margin: 10px;" ref="mysvg">

      <template v-for="nodeinfo of instan_nodes_map.values()" v-bind:key="nodeinfo.key">

        <rect v-bind:width="nodewidth" v-bind:height="nodeheight" style="cursor:pointer;" v-bind:x="nodeinfo.x_ui"
          v-bind:y="nodeinfo.y_ui" fill="#bff3c3" v-bind:stroke="nodeinfo.stroke_ui" />

        <text font-size="13" font-family="Verdana" style="text-anchor: middle;cursor:pointer;">
          <tspan v-bind:x="nodeinfo.x_ui + nodewidth / 2" v-bind:y="nodeinfo.y_ui + 0 + nodeheight / 2"
            v-bind:width="nodewidth" v-bind:height="nodeheight">
            {{ nodeinfo.node_name }}</tspan>

          <tspan v-if="nodeinfo.timeout > 0" v-bind:x="nodeinfo.x_ui + nodewidth / 2"
            v-bind:y="nodeinfo.y_ui + 13 + nodeheight / 2" fill="#ff0000" style="font-size:10px;">{{ nodeinfo.timeout +
                "分"
            }}
          </tspan>

        </text>
      </template>
      <template v-for="(value, index) in ui_lines_map" v-bind:key="index">

        <path v-bind:d="value.d" style="cursor:pointer;" v-if="value.type === 'line'" fill="none"
          v-bind:stroke="value.stroke" stroke-miterlimit="10" v-on:dblclick="pathmouseclick(index)"
          v-on:mouseenter="pathmouseover(index, true)" v-on:mouseleave="pathmouseover(index, false)">
        </path>

        <path v-bind:d="value.d" style="cursor:pointer;" v-else v-bind:fill="value.stroke" v-bind:stroke="value.stroke"
          stroke-miterlimit="10" pointer-events="all" v-on:dblclick="pathmouseclick(index - 1)"
          v-on:mouseenter="pathmouseover(index - 1, true)" v-on:mouseleave="pathmouseover(index - 1, false)">
        </path>
      </template>

      <rect v-bind:width="nodewidth" v-bind:height="nodeheight" v-bind:x="rectmyoffset.left"
        v-bind:visibility="rectmyoffset.visibility" v-bind:y="rectmyoffset.top" fill="#aa0000" stroke="#aa0000"
        v-on:dblclick="textmouseclick" />
    </svg>

  </div>
</template >
  
<script lang="ts" setup>

import NodeEdit from './components/NodeEdit.vue'
import { reactive, ref, defineExpose, defineProps } from 'vue';
import { drawarrow } from './components/draw'
import { nodeheight, nodeinfo_str, nodewidth, DrawNodeInit } from './components/node';
import {
  nodepathinfo_str,
  DrawPathInit,
  fixedgeXy, fixMPoint, fixTrailPointBym, fixTrailPointByt, fixTrailXy, pathline_str,
  pathwidth
} from './components/path';
import { mypoint_str } from './components/point';
import { btnactinfo_str, btncheckinfo_str, buttoninfo_str } from './components/common';

import { FlowNodeFetch, FieldUriParams } from '@/api/model/flow';

class MyDataStr {
  instan_btninfo_map_sort = new Map<string, Array<buttoninfo_str>>()
  ui_my_btns_map_paths = new Map<string, Map<string, Array<nodepathinfo_str>>>()
  ui_my_btns_map_checkinfs = new Map<string, Map<string, Array<btncheckinfo_str>>>()
  ui_my_btns_map_btnokinfs = new Map<string, Map<string, Array<btncheckinfo_str>>>()
  ui_my_btns_map_btnactinfs = new Map<string, Map<string, Array<btnactinfo_str>>>()
}

//ui event

let myselectvx = 0
let myselectvy = 0

const view_node_edit = ref(null)
const mysvg = ref({})
const mysvgWidth = ref(0)
const mysvgHeight = ref(0)
const loading = ref(true)
const rectmyoffset = reactive({
  left: 0,
  top: 0,
  visibility: "hidden"
})
let ui_lines_map = ref(new Array<pathline_str>())
var instan_nodes_map = ref(new Map<string, nodeinfo_str>())
var myDataStr = new MyDataStr()

var real_xy_nodes_map = new Map<string, string>()
var relate_allpaths_map: Map<string, Array<nodepathinfo_str>> = new Map<string, Array<nodepathinfo_str>>()
const props = defineProps({
  my_reques_flow_id: String,
});


const flowpagemousemove = (event: MouseEvent) => {

  let mousex = event.clientX
  let mousey = event.clientY

  let basex = mysvg.value.getBoundingClientRect().left
  let basey = mysvg.value.getBoundingClientRect().top
  let realoffx = mousex - basex
  let realoffy = mousey - basey

  let realx = 0
  let realy = 0

  let ygroupnum = parseInt((realoffy / (nodeheight + pathwidth)) + "")
  let widthYgroup = ygroupnum * (nodeheight + pathwidth)

  let xgroupnum = parseInt((realoffx / (nodewidth + pathwidth)) + "")
  let widthXgroup = xgroupnum * (nodewidth + pathwidth)
  if (realoffy - widthYgroup > pathwidth && realoffx - widthXgroup > pathwidth) {
    realy = widthYgroup + pathwidth
    realx = widthXgroup + pathwidth
    rectmyoffset.visibility = "visible"
    myselectvx = xgroupnum
    myselectvy = ygroupnum

  } else {
    rectmyoffset.visibility = "hidden"
    myselectvx = -1
    myselectvy = -1
  }

  rectmyoffset.left = realx//(event.target as SVGRectElement).x.baseVal.value
  rectmyoffset.top = realy//(event.target as SVGRectElement).y.baseVal.value

}

var event_nodeeditok_cb = (node: nodeinfo_str,
  infoBtnInfo: Array<buttoninfo_str>, infoPathsInfo: Map<string, Array<nodepathinfo_str>>,
  infoCheckInfo: Map<string, Array<btncheckinfo_str>>,
  infoBtnOkInfo: Map<string, Array<btncheckinfo_str>>,
  infoBtnActInfo: Map<string, Array<btnactinfo_str>>
) => {
  if (node.cmd_ == "delete") {
    let key = node.vx + ":" + node.vy
    real_xy_nodes_map.delete(key)
    instan_nodes_map.value.delete(node.node_id)
    relate_allpaths_map.delete(node.node_id)
    refresh()
    return
  } else if (node.cmd_ == "add") {
    instan_nodes_map.value.set(node.node_id, node)
    myDataStr.instan_btninfo_map_sort.set(node.node_id, infoBtnInfo)
    myDataStr.ui_my_btns_map_paths.set(node.node_id, infoPathsInfo)
    myDataStr.ui_my_btns_map_checkinfs.set(node.node_id, infoCheckInfo)
    myDataStr.ui_my_btns_map_btnokinfs.set(node.node_id, infoBtnOkInfo)
    myDataStr.ui_my_btns_map_btnactinfs.set(node.node_id, infoBtnActInfo)
  }
  instan_nodes_map.value.set(node.node_id, node)
  let key = node.vx + ":" + node.vy
  real_xy_nodes_map.set(key, node.node_id)


  let btnpatharr = relate_allpaths_map.get(node.node_id)
  if (btnpatharr === undefined) {
    btnpatharr = new Array<nodepathinfo_str>()
    relate_allpaths_map.set(node.node_id, btnpatharr)
  } else {
    btnpatharr.splice(0)
  }
  for (let val of infoPathsInfo.values()) {
    for (var i = 0; i < val.length; i++) {
      let path = new nodepathinfo_str()
      let node = instan_nodes_map.value.get(val[i].node_id)
      if (node != undefined) {
        path.flow_id = val[i].flow_id
        path.node_id = val[i].node_id
        path.btn_id = val[i].btn_id
        btnpatharr.push(path)
      }

    }

  }


  relate_allpaths_map.set(node.node_id, btnpatharr)
  refresh()
}
const textmouseclick_2 = (selectnodeinfo: nodeinfo_str) => {

  let infoBtnInfo = myDataStr.instan_btninfo_map_sort.get(selectnodeinfo.node_id)
  if (infoBtnInfo == undefined) {
    infoBtnInfo = new Array<buttoninfo_str>()

  }


  let infoPathsInfo = myDataStr.ui_my_btns_map_paths.get(selectnodeinfo.node_id)
  if (infoPathsInfo == undefined) {
    infoPathsInfo = new Map<string, Array<nodepathinfo_str>>()

  }

  let infoCheckInfo = myDataStr.ui_my_btns_map_checkinfs.get(selectnodeinfo.node_id)
  if (infoCheckInfo == undefined) {
    infoCheckInfo = new Map<string, Array<btncheckinfo_str>>()

  }

  let infoBtnOkInfo = myDataStr.ui_my_btns_map_btnokinfs.get(selectnodeinfo.node_id)
  if (infoBtnOkInfo == undefined) {
    infoBtnOkInfo = new Map<string, Array<btncheckinfo_str>>()

  }
  let infoBtnActInfo = myDataStr.ui_my_btns_map_btnactinfs.get(selectnodeinfo.node_id)
  if (infoBtnActInfo == undefined) {
    infoBtnActInfo = new Map<string, Array<btnactinfo_str>>()

  }

  if (view_node_edit.value != null)
    view_node_edit.value.NodeEdit_Init(selectnodeinfo, instan_nodes_map.value, infoBtnInfo, infoPathsInfo, infoCheckInfo, infoBtnOkInfo,
      infoBtnActInfo)
}

const textmouseclick = () => {
  if (rectmyoffset.visibility == "hidden")
    return
  let key = myselectvx + ":" + myselectvy
  let node_idtmp = real_xy_nodes_map.get(key)

  if (node_idtmp === undefined) {

    let selectnodeinfo = new nodeinfo_str()
    let isnew = true
    selectnodeinfo.node_id = ""
    selectnodeinfo.cmd_ = "add"
    selectnodeinfo.flow_id = props.my_reques_flow_id ? props.my_reques_flow_id : ""
    selectnodeinfo.vx = myselectvx
    selectnodeinfo.vy = myselectvy
    textmouseclick_2(selectnodeinfo)
    return
  }

  let selectnodeinfo = instan_nodes_map.value.get(node_idtmp)
  if (selectnodeinfo == undefined) {
    console.log("找不到节点信息")
    return
  }

  selectnodeinfo.cmd_ = "edit"
  selectnodeinfo.flow_id = props.my_reques_flow_id ? props.my_reques_flow_id : ""
  textmouseclick_2(selectnodeinfo)

}
const pathmouseover = (index: number, flag: boolean) => {

  if (ui_lines_map.value != undefined) {
    if (flag) {
      ui_lines_map.value[index].stroke = "#aa0000"
      ui_lines_map.value[index + 1].stroke = "#aa0000"
    } else {
      ui_lines_map.value[index].stroke = "#8c8c8c"
      ui_lines_map.value[index + 1].stroke = "#8c8c8c"
    }
  }

}
const pathmouseclick = (index: number) => {

}





/**
* 最初入口
*/
var drawline = (start: nodeinfo_str, end: nodeinfo_str) => {
  //所有的点都由上一个点和结束点确定
  //十字路左右从上侧出发
  //右边其他节点从右侧出发
  //左边其他节点从左侧出发
  //下面第一排从下面出发
  let mpoint: mypoint_str
  let tpoint: mypoint_str


  if (end.vy === start.vy + 1) {//紧下面的节点从底边缘出发
    mpoint = fixMPoint(start, "bottom")
  }
  //这块左右的没测，回头找时间测测，优化一下
  else if (end.vy === start.vy && end.vx === start.vx + 1) {
    mpoint = fixMPoint(start, "right")
  } else if (end.vy === start.vy && end.vx + 1 === start.vx) {
    mpoint = fixMPoint(start, "left")
  }
  else if (end.vy - start.vy === 0 || end.vy - start.vy === -1) {//十字路横向从上边缘出发
    mpoint = fixMPoint(start, "top")
  } else {
    if (end.vx >= start.vx) {//其他的右侧路径从右边缘出发
      mpoint = fixMPoint(start, "right")
    } else {//其他的左侧路径从左边缘出发
      mpoint = fixMPoint(start, "left")
    }
  }
  let pointstr: string = ""
  let points: Array<mypoint_str> = new Array<mypoint_str>()



  fixedgeXy(mpoint, instan_nodes_map.value.get(mpoint.node_id))

  pointstr = "M " + mpoint.x + " " + mpoint.y
  points.push(mpoint)
  tpoint = fixTrailPointBym(mpoint, end)
  fixTrailXy(tpoint, mpoint)
  pointstr += " L " + tpoint.x + " " + tpoint.y
  points.push(tpoint)

  let lastpoint: mypoint_str
  lastpoint = tpoint
  while (tpoint.type !== "in") {
    tpoint = fixTrailPointByt(tpoint, end)
    if (tpoint.type === "in") {
      fixedgeXy(tpoint, instan_nodes_map.value.get(tpoint.node_id))
    } else {
      fixTrailXy(tpoint, lastpoint)
    }
    lastpoint = tpoint
    pointstr += " L " + tpoint.x + " " + tpoint.y
    points.push(tpoint)
  }

  ui_lines_map.value.push({
    "d": pointstr, "type": "line", "stroke": "#8c8c8c", "start_node_id": start.node_id, "end_node_id":
      end.node_id
  })

  if (tpoint.type === "in") {
    let direct = ""
    if (tpoint.edge === "top") {
      direct = "bottom"
    } else if (tpoint.edge === "bottom") {
      direct = "top"
    } else if (tpoint.edge === "left") {
      direct = "right"
    } else if (tpoint.edge === "right") {
      direct = "left"
    }

    ui_lines_map.value.push({
      "d": drawarrow(tpoint.x, tpoint.y, direct), "type": "arrow", "stroke": "#8c8c8c", "start_node_id": start.node_id, "end_node_id":
        end.node_id
    })
  }
}

const refresh = () => {
  ui_lines_map.value.splice(0)

  DrawNodeInit()
  DrawPathInit()
  let maxvx = 0
  let maxvy = 0
  //灌入节点数据
  for (let key of instan_nodes_map.value.keys()) {
    let rnodeinfo = instan_nodes_map.value.get(key)
    if (rnodeinfo === undefined)
      continue

    if (rnodeinfo.vx > maxvx) {
      maxvx = rnodeinfo.vx
    }
    if (rnodeinfo.vy > maxvy) {
      maxvy = rnodeinfo.vy
    }
  }
  mysvgWidth.value = (maxvx + 3) * nodewidth + (maxvx + 3) * pathwidth
  mysvgHeight.value = (maxvy + 3) * nodeheight + (maxvy + 3) * pathwidth
  //画节点
  for (let nodeinfo of instan_nodes_map.value.values()) {
    nodeinfo.y_ui = (nodeinfo.vy + 1) * pathwidth + nodeinfo.vy * nodeheight
    nodeinfo.x_ui = (nodeinfo.vx + 1) * pathwidth + nodeinfo.vx * nodewidth
    nodeinfo.stroke_ui = "#71cba1"
  }


  for (let key of relate_allpaths_map.keys()) {
    let mapv: Array<nodepathinfo_str> | undefined = relate_allpaths_map.get(key)

    if (mapv != undefined) {
      let startnode = instan_nodes_map.value.get(key)

      if (startnode != undefined) {
        for (var i: number = 0; i < mapv.length; i++) {
          let mapvv: nodepathinfo_str | undefined = mapv[i]
          if (mapvv != undefined) {
            let endnode = instan_nodes_map.value.get(mapvv.node_id)

            if (endnode != undefined) {

              drawline(startnode, endnode)
            }
          }
        }
      }
    }
  }
}
const Get_Nodes_list = async (row: any) => {

  loading.value = true
  FlowNodeFetch(row).then((response: any) => {

    for (let i = 0; i < response.data.obj.NodeRows.length; i++) {
      let noderow = response.data.obj.NodeRows[i] as nodeinfo_str
      real_xy_nodes_map.set(noderow.vx + ":" + noderow.vy, noderow.node_id)
      console.log("set ", noderow)
      instan_nodes_map.value.set(noderow.node_id, noderow)
      console.log("set 11  ", instan_nodes_map.value)
    }

    for (let key in response.data.obj.PathRows) {
      let pathsvalue = response.data.obj.PathRows[key] as Array<nodepathinfo_str>
      let newarr = new Array<nodepathinfo_str>()

      for (let i = 0; i < (pathsvalue as Array<nodepathinfo_str>).length; i++) {
        let pathinfo = new nodepathinfo_str()
        pathinfo.flow_id = pathsvalue[i].flow_id
        pathinfo.node_id = pathsvalue[i].node_id
        pathinfo.btn_id = pathsvalue[i].btn_id
        newarr.push(pathinfo)
      }

      if (newarr.length > 0)
        relate_allpaths_map.set(key, newarr)
    }

    loading.value = false
    refresh()
  }).catch((err: any) => {
    loading.value = false
  })
}

const PageLoaded = () => {
  let request = new FieldUriParams()
  request.flow_id = props.my_reques_flow_id ? props.my_reques_flow_id : ""
  Get_Nodes_list(request)
}
PageLoaded()
// const FlowDraw_Init = (flow_id: number) => {
//   my_reques_flow_id = flow_id
// }
// defineExpose({
//   FlowDraw_Init
// })
</script>

 <style scoped>
 svg .tspannode {
 
   color: aqua;
 }
 
 .pointer {
   cursor: pointer;
 }
 </style>
