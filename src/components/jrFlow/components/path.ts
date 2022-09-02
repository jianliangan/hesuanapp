import { fixnodeEdgeOffset, getPeerEdgeOffset, nodeedgeintervalH, nodeedgeintervalW, nodeheight, nodeinfo_str, nodewidth } from "./node"
import { mypoint_str } from "./point"
export class nodepathinfo_str {
  //{ "id": "id1", "flow": "" }
  node_id: string = ""
  flow_id: string = ""
  btn_id: string = ""
  cmd: string = ""
}
export class pathline_str {
  start_node_id: string = ""
  end_node_id: string = ""
  d: string = ""
  type: string = ""
  stroke: string = ""
}
export class segment_str {
  //{ "start": 0, "end": 0, "num": 0 }
  start: number = -1
  end: number = -1
  num: number = 0
}


export const pathwidth: number = 50 //走廊宽度
export const pathmaxnum: number = 10//走廊最大并行线段数
export const pathinterval: number = pathwidth / pathmaxnum
export const patharealinesX = new Map<number, Array<segment_str>>()//{"0":[{"start":0,"end":0,"num":0}]} 每一列都记录多段情况
export const patharealinesY = new Map<number, Array<segment_str>>()//同上
export var DrawPathInit = () => {
  patharealinesX.clear()
  patharealinesY.clear()
}
/**
 * 通过全局坐标4个值和end确定线段,包含从起始点M
 * @param trailvx 
 * @param trailvy 
 * @param vx 
 * @param vy 
 * @param end 
 */
export var fixSegmentsFromM2End = (edge: string, vx: number, vy: number, end: nodeinfo_str): [segmentstart: number, segmentend: number] => {
  let segmentend: number = 0
  let segmentstart: number = 0

  if (edge === "top" || edge === "bottom") {
    if (end.vx < vx) {//左侧
      if (Math.abs(end.vy - vy) <= 1) {//临近节点
        segmentstart = end.vx
        segmentend = vx
      } else {//远处节点
        segmentstart = end.vx + 1
        segmentend = vx
      }
    } else {//右侧
      if (Math.abs(end.vy - vy) <= 1) {//临近节点
        segmentstart = vx
        segmentend = end.vx
      } else {//远处节点
        segmentstart = vx
        segmentend = end.vx - 1
      }
    }


  } else if (edge === "left" || edge === "right") {
    if (end.vy < vy) {//上侧
      if (Math.abs(end.vx - vx) <= 1) {//临近节点
        segmentstart = end.vy
        segmentend = vy
      } else {//远处节点
        segmentstart = end.vy + 1
        segmentend = vy
      }
    } else {
      if (Math.abs(end.vx - vx) <= 1) {//临近节点
        segmentstart = vy
        segmentend = end.vy
      } else {//远处节点
        segmentstart = vy
        segmentend = end.vy - 1
      }
    }


  }

  return [segmentstart, segmentend]
}
/**
 * 通过全局坐标4个值和end确定线段,包含从起始点M
 * @param trailvx 
 * @param trailvy 
 * @param vx 
 * @param vy 
 * @param end 
 */
export var fixSegmentsFromPoin2End = (trailvx: number, trailvy: number, vx: number, vy: number, end: nodeinfo_str): [segmentstart: number, segmentend: number] => {
  let segmentend: number = 0
  let segmentstart: number = 0
  if (trailvx != -1 && vy != -1) {//竖向    
    if (end.vx < trailvx) {//左侧
      segmentstart = end.vx
      segmentend = trailvx - 1
    } else {//右侧
      segmentstart = trailvx
      segmentend = end.vx
    }
  } else if (trailvy != -1 && vx != -1) {//横向
    if (end.vy < trailvy) {//上侧
      segmentstart = end.vy
      segmentend = trailvy - 1
    } else {//右侧
      segmentstart = trailvy
      segmentend = end.vy
    }
  } else if (trailvy != -1 && trailvx != -1) {//十字路口
    if (end.vy < trailvy) {//上侧
      segmentstart = end.vy
      segmentend = trailvy - 1
    } else {//右侧
      segmentstart = trailvy
      segmentend = end.vy
    }
  }
  return [segmentstart, segmentend]
}

/**
* 通过M点找线段数组信息
* @param mypoint 
* @param end 
*/
export var fixTrailFromM2End = (mpoint: mypoint_str): Array<segment_str> => {//专找轨道偏移量



  let linesinfo = new Array<segment_str>()

  if (mpoint.edge === "top" || mpoint.edge === "bottom") {

    let index = 0
    if (mpoint.edge === "top") {
      index = mpoint.vy
    } else {
      index = mpoint.vy + 1
    }
    let linesinfotmp = patharealinesY.get(index)
    if (linesinfotmp === undefined) {
      linesinfotmp = linesinfo
      patharealinesY.set(index, linesinfotmp)

    } else {

      linesinfo = linesinfotmp
    }

  } else if (mpoint.edge === "left" || mpoint.edge === "right") {
    let index = 0
    if (mpoint.edge === "left") {
      index = mpoint.vx
    } else {
      index = mpoint.vx + 1
    }
    let linesinfotmp = patharealinesX.get(index)

    if (linesinfotmp === undefined) {
      linesinfotmp = linesinfo
      patharealinesX.set(index, linesinfotmp)

    }
    linesinfo = linesinfotmp

  }

  return linesinfo
}


export var fixTrailOffsetIndex = (linesinfo: Array<segment_str>, segmentstart: number, segmentend: number, increase: boolean): number => {//专找轨道偏移量 
  let hasblock: boolean = false
  let linenum: number = 0;

  if (linesinfo != undefined) {

    for (let points of linesinfo) {

      if (segmentend < points.start || segmentstart > points.end) {
        //说明没有交集
        hasblock = false
      } else {
        //有交集
        if (!increase) {
          linenum = points.num
          hasblock = true
          break
        }
        points.num += 1

        linenum = points.num

        points.start = segmentstart < points.start ? segmentstart : points.start
        points.end = segmentend > points.end ? segmentend : points.end
        hasblock = true
        break
      }

    }
  }

  if (hasblock === false) {
    if (linesinfo != undefined) {
      if (increase) {

        linesinfo.push({ "start": segmentstart, "end": segmentend, "num": 1 })
      }
    }
    linenum = 1
  }
  return linenum
}


/**
 * 交叉路口，远距离以横向走，近距离按近距离走
 * @param trailpoint 
 * @param end 
 */
export var crossTrail = (trailpoint: mypoint_str, end: nodeinfo_str): mypoint_str => {
  var re: mypoint_str = new mypoint_str()
  if (end.vy == trailpoint.trailvy - 1 || end.vy === trailpoint.trailvy) {//临近终点，横向方向
    re = horizontalTrailNear(trailpoint, end)
  } else if (end.vx == trailpoint.trailvx - 1 || end.vx === trailpoint.trailvx) {//临近终点,竖向
    re = verticalTrailNear(trailpoint, end)
  } else {//距离终点还比较远
    re = horizontalTrailFar(trailpoint, end)
  }
  return re
}
/**
 * 横向近距离
 * @param trailpoint 
 * @param end 
 */
export var horizontalTrailNear = (trailpoint: mypoint_str, end: nodeinfo_str): mypoint_str => {
  var re: mypoint_str = new mypoint_str()
  if (trailpoint.lineAxis === "nocross" && end.vx === trailpoint.vx) {
    let edge = ""
    if (end.vy < trailpoint.trailvy) {
      edge = "bottom"
    } else {
      edge = "top"
    }

    if (trailpoint.type === "line2in") {
      re.edge = edge
      re.edgeoffsetindex = trailpoint.edgeoffsetindex
      re.trailoffsetindex = 0
      re.lineAxis = ""
      re.trailvx = -1
      re.trailvy = -1
      re.type = "in"
      re.vx = end.vx
      re.vy = end.vy
      re.node_id = end.node_id
      re.lastuse = "x"
      return re
    } else if (trailpoint.type === "out2line") {
      let offset = getPeerEdgeOffset(end, edge)
      if (offset <= trailpoint.edgeoffsetindex) {
        fixnodeEdgeOffset(end, edge, "directin")//
        re.edge = edge
        re.edgeoffsetindex = trailpoint.edgeoffsetindex
        re.trailoffsetindex = 0
        re.lineAxis = ""
        re.trailvx = -1
        re.trailvy = -1
        re.type = "in"
        re.vx = end.vx
        re.vy = end.vy
        re.node_id = end.node_id
        re.lastuse = "x"
        return re
      }

    }

  }
  let offtmp: number
  if (end.vy == trailpoint.trailvy - 1) {//上侧

    offtmp = fixnodeEdgeOffset(end, "bottom", "in")//, "in"
  } else {//下侧

    offtmp = fixnodeEdgeOffset(end, "top", "in")//, "in"
  }
  re.edgeoffsetindex = offtmp
  re.lineAxis = "nocross"
  re.trailvx = -1
  re.trailvy = trailpoint.trailvy
  re.type = "line2in"
  re.vx = end.vx
  re.vy = -1
  re.lastuse = "y"
  return re
}
/**
 * 横向远距离
 * @param trailpoint 
 * @param end 
 */
export var horizontalTrailFar = (trailpoint: mypoint_str, end: nodeinfo_str): mypoint_str => {
  var re: mypoint_str = new mypoint_str()
  if (end.vy < trailpoint.trailvy) {//上侧

    let linesinfo: Array<segment_str> | undefined
    let vx = -1
    if (end.vx < trailpoint.vx) {
      linesinfo = patharealinesX.get(end.vx + 1)
      if (linesinfo == undefined) {
        linesinfo = new Array<segment_str>()
        patharealinesX.set(end.vx + 1, linesinfo)
      }
      vx = end.vx + 1
    } else {
      linesinfo = patharealinesX.get(end.vx)
      if (linesinfo == undefined) {
        linesinfo = new Array<segment_str>()
        patharealinesX.set(end.vx, linesinfo)
      }
      vx = end.vx
    }


    let segmentstart: number
    let segmentend: number
    [segmentstart, segmentend] = fixSegmentsFromPoin2End(-1, trailpoint.trailvy, trailpoint.vx, -1, end)
    let linenum = fixTrailOffsetIndex(linesinfo, segmentstart, segmentend, true)


    re.lineAxis = "cross"
    re.trailvx = vx
    re.trailvy = trailpoint.trailvy
    re.type = "line"
    re.trailoffsetindex = linenum

  } else {//下侧

    let linesinfo: Array<segment_str> | undefined
    if (end.vx < trailpoint.vx) {
      linesinfo = patharealinesX.get(end.vx + 1)
      if (linesinfo == undefined) {
        linesinfo = new Array<segment_str>()
        patharealinesX.set(end.vx + 1, linesinfo)
      }

    } else {
      linesinfo = patharealinesX.get(end.vx)
      if (linesinfo == undefined) {
        linesinfo = new Array<segment_str>()
        patharealinesX.set(end.vx, linesinfo)
      }

    }


    let segmentstart: number
    let segmentend: number
    [segmentstart, segmentend] = fixSegmentsFromPoin2End(-1, trailpoint.trailvy, trailpoint.vx, -1, end)
    let linenum = fixTrailOffsetIndex(linesinfo, segmentstart, segmentend, true)


    re.lineAxis = "cross"
    re.trailvx = end.vx + 1
    re.trailvy = trailpoint.trailvy
    re.type = "line"
    re.trailoffsetindex = linenum
  }
  re.lastuse = "y"
  return re
}
/**
 * 横向
 * @param trailpoint 
 * @param end 
 */
export var horizontalTrail = (trailpoint: mypoint_str, end: nodeinfo_str): mypoint_str => {
  var re: mypoint_str = new mypoint_str()
  if (end.vy == trailpoint.trailvy - 1 || end.vy === trailpoint.trailvy) {//临近终点
    re = horizontalTrailNear(trailpoint, end)
  } else {//距离终点还比较远
    re = horizontalTrailFar(trailpoint, end)
  }
  return re
}
/**
 * 竖向近距离
 * @param trailpoint 
 * @param end 
 */
export var verticalTrailNear = (trailpoint: mypoint_str, end: nodeinfo_str): mypoint_str => {
  var re: mypoint_str = new mypoint_str()

  if (trailpoint.lineAxis === "nocross" && end.vy === trailpoint.vy) {
    let edge = ""
    if (end.vx < trailpoint.trailvx) {
      edge = "right"

    } else {
      edge = "left"
    }

    if (trailpoint.type === "line2in") {
      re.edge = edge
      re.edgeoffsetindex = trailpoint.edgeoffsetindex
      re.trailoffsetindex = 0
      re.lineAxis = ""
      re.trailvx = -1
      re.trailvy = -1
      re.type = "in"
      re.vx = end.vx
      re.vy = end.vy
      re.lastuse = "y"
      re.node_id = end.node_id
      return re
    } else if (trailpoint.type === "out2line") {
      let offset = getPeerEdgeOffset(end, edge)
      if (offset <= trailpoint.edgeoffsetindex) {
        fixnodeEdgeOffset(end, edge, "directin")//, "in"
        re.edge = edge
        re.edgeoffsetindex = trailpoint.edgeoffsetindex
        re.trailoffsetindex = 0
        re.lineAxis = ""
        re.trailvx = -1
        re.trailvy = -1
        re.type = "in"
        re.vx = end.vx
        re.vy = end.vy
        re.lastuse = "y"
        re.node_id = end.node_id
        return re
      }
    }
  }

  let offtmp: number
  if (end.vx == trailpoint.trailvx - 1) {//左侧

    offtmp = fixnodeEdgeOffset(end, "right", "in")//, "in"
  } else {//右侧

    offtmp = fixnodeEdgeOffset(end, "left", "in")//, "in"
  }
  re.edgeoffsetindex = offtmp
  re.lineAxis = "nocross"
  re.trailvx = trailpoint.trailvx
  re.trailvy = -1
  re.type = "line2in"
  re.vx = -1
  re.vy = end.vy
  re.lastuse = "x"
  return re
}
/**
 * 竖向远距离
 * @param trailpoint 
 * @param end 
 */
export var verticalTrailFar = (trailpoint: mypoint_str, end: nodeinfo_str): mypoint_str => {
  //距离终点还比较远
  var re: mypoint_str = new mypoint_str()
  if (end.vx < trailpoint.trailvx) {//左侧

    let linesinfo: Array<segment_str> | undefined
    let vy = -1
    if (end.vy < trailpoint.vy) {
      linesinfo = patharealinesY.get(end.vy + 1)
      if (linesinfo == undefined) {
        linesinfo = new Array<segment_str>()
        patharealinesY.set(end.vy + 1, linesinfo)
      }
      vy = end.vy + 1
    } else {
      linesinfo = patharealinesY.get(end.vy)
      if (linesinfo == undefined) {
        linesinfo = new Array<segment_str>()
        patharealinesY.set(end.vy, linesinfo)
      }
      vy = end.vy
    }


    let segmentstart: number
    let segmentend: number
    [segmentstart, segmentend] = fixSegmentsFromPoin2End(trailpoint.trailvx, -1, -1, trailpoint.vy, end)
    let linenum = fixTrailOffsetIndex(linesinfo, segmentstart, segmentend, true)


    re.lineAxis = "cross"
    re.trailvx = trailpoint.trailvx
    re.trailvy = vy
    re.type = "line"
    re.trailoffsetindex = linenum

  } else {//右侧
    let vy = -1
    let linesinfo: Array<segment_str> | undefined
    if (end.vy < trailpoint.vy) {
      linesinfo = patharealinesY.get(end.vy + 1)
      if (linesinfo == undefined) {
        linesinfo = new Array<segment_str>()
        patharealinesY.set(end.vy + 1, linesinfo)
      }
      vy = end.vy + 1
    } else {
      linesinfo = patharealinesY.get(end.vy)
      if (linesinfo == undefined) {
        linesinfo = new Array<segment_str>()
        patharealinesY.set(end.vy, linesinfo)
      }
      vy = end.vy
    }


    let segmentstart: number
    let segmentend: number
    [segmentstart, segmentend] = fixSegmentsFromPoin2End(trailpoint.trailvx, -1, -1, trailpoint.vy, end)
    let linenum = fixTrailOffsetIndex(linesinfo, segmentstart, segmentend, true)


    re.lineAxis = "cross"
    re.trailvx = trailpoint.trailvx
    re.trailvy = vy
    re.type = "line"
    re.trailoffsetindex = linenum
  }
  re.lastuse = "x"
  return re
}
/**
 * 竖向
 * @param trailpoint 
 * @param end 
 */
export var verticalTrail = (trailpoint: mypoint_str, end: nodeinfo_str): mypoint_str => {
  var re: mypoint_str = new mypoint_str()
  if (end.vx == trailpoint.trailvx - 1 || end.vx === trailpoint.trailvx) {//临近终点
    re = verticalTrailNear(trailpoint, end)
  } else {//距离终点还比较远
    re = verticalTrailFar(trailpoint, end)
  }
  return re
}
/**
 * 
 * @param trailpoint 
 * @param end 
 */
export var fixTrailPointByt = (trailpoint: mypoint_str, end: nodeinfo_str): mypoint_str => {
  var re: mypoint_str = new mypoint_str()
  if (trailpoint.lineAxis == "") {
    //没有
  } else if (trailpoint.lineAxis == "cross") {
    re = crossTrail(trailpoint, end)
  } else if (trailpoint.lineAxis == "nocross") {
    if (trailpoint.trailvx !== -1) {//竖向轨道中
      re = verticalTrail(trailpoint, end)
    } else if (trailpoint.trailvy !== -1) {//横向轨道中
      re = horizontalTrail(trailpoint, end)
    }
  }
  return re
}
/**
 * 
 * @param mpoint 通过M点找轨道第一个点
 * @param end 
 */
export var fixTrailPointBym = (mpoint: mypoint_str, end: nodeinfo_str): mypoint_str => {
  let linesinfo: Array<segment_str> | undefined
  let vx: number = -1
  let vy: number = -1
  let trailvx: number = -1
  let trailvy: number = -1
  let lastuse = ""
  if (mpoint.edge === "top" || mpoint.edge === "bottom") {
    lastuse = "x"
    if (mpoint.edge === "top") {
      vx = mpoint.vx
      vy = -1
      trailvx = -1
      trailvy = mpoint.vy
    } else {
      vx = mpoint.vx
      vy = -1
      trailvx = -1
      trailvy = mpoint.vy + 1
    }


  } else if (mpoint.edge === "left" || mpoint.edge === "right") {
    lastuse = "y"
    if (mpoint.edge === "left") {
      vx = -1
      vy = mpoint.vy
      trailvx = mpoint.vx
      trailvy = -1
    } else {
      vx = -1
      vy = mpoint.vy
      trailvx = mpoint.vx + 1
      trailvy = -1
    }

  }
  linesinfo = fixTrailFromM2End(mpoint)

  //寻找线段信息
  let segmentstart: number = -1
  let segmentend: number = -1
  let increase = true
  if (mpoint.edge === "top") {
    [segmentstart, segmentend] = fixSegmentsFromM2End(mpoint.edge, mpoint.vx, mpoint.vy, end)
    if (end.vy - mpoint.vy === -1 && end.vx == mpoint.vx) {
      let offset = getPeerEdgeOffset(end, "bottom")
      if (mpoint.edgeoffsetindex >= offset) {
        increase = false
      }
    }
  } else if (mpoint.edge === "bottom") {
    [segmentstart, segmentend] = fixSegmentsFromM2End(mpoint.edge, mpoint.vx, mpoint.vy, end)
    if (end.vy - mpoint.vy === 1 && end.vx === mpoint.vx) {
      let offset = getPeerEdgeOffset(end, "top")
      if (mpoint.edgeoffsetindex >= offset) {
        increase = false
      }
    }
  } else if (mpoint.edge === "left") {
    [segmentstart, segmentend] = fixSegmentsFromM2End(mpoint.edge, mpoint.vx, mpoint.vy, end)
    if (end.vx - mpoint.vx === -1 && end.vy === mpoint.vy) {
      let offset = getPeerEdgeOffset(end, "right")
      if (mpoint.edgeoffsetindex >= offset) {
        increase = false
      }
    }
  } else if (mpoint.edge === "right") {
    [segmentstart, segmentend] = fixSegmentsFromM2End(mpoint.edge, mpoint.vx, mpoint.vy, end)
    if (end.vx - mpoint.vx === 1 && end.vy === mpoint.vy) {
      let offset = getPeerEdgeOffset(end, "left")
      if (mpoint.edgeoffsetindex >= offset) {
        increase = false
      }
    }
  }



  let linenum = fixTrailOffsetIndex(linesinfo, segmentstart, segmentend, increase)

  let re: mypoint_str = new mypoint_str
  re.trailoffsetindex = linenum
  re.edgeoffsetindex = mpoint.edgeoffsetindex
  re.vx = vx
  re.vy = vy
  re.trailvx = trailvx
  re.trailvy = trailvy
  re.edge = ""
  re.lastuse = lastuse
  re.type = "out2line"
  re.lineAxis = "nocross"

  return re
}
/**
 * 确定M点函数
 * @param start 
 * @param edge 
 * @param end 
 */
export var fixMPoint = (start: nodeinfo_str, edge: string) => {
  let Mpoint = new mypoint_str//{"vx":-1,"vy":-1,"trailvx":0,"trailvy":0,"offi":0间隔偏移量,"d":"top代表点的去向方向","id":从节点id的e边离开、进入,"e":节点边,"lineAxis":"cross/nocross","t":"out代表离开节点，line轨道中，in进入节点"}
  //一步 找到离开节点的点
  Mpoint.node_id = start.node_id
  {
    let offtmp: number = fixnodeEdgeOffset(start, edge, "out")//, "out"

    if (edge === "top" || edge === "bottom") {
      // Mpoint.x = start.x + nodeedgeintervalW * ()
      if (edge === "top") {
        //  Mpoint.y = start.y

        Mpoint.vx = start.vx
        Mpoint.vy = start.vy
        Mpoint.edge = "top"

        Mpoint.type = "out"
        Mpoint.lineAxis = ""

        Mpoint.trailvx = -1
        Mpoint.trailvy = -1
        Mpoint.edgeoffsetindex = offtmp

      } else {
        //  Mpoint.y = start.y + nodeheight

        Mpoint.vx = start.vx
        Mpoint.vy = start.vy
        Mpoint.edge = "bottom"

        Mpoint.type = "out"
        Mpoint.lineAxis = ""
        Mpoint.trailvx = -1
        Mpoint.trailvy = -1
        Mpoint.edgeoffsetindex = offtmp
      }

    } else if (edge === "left" || edge === "right") {
      if (edge === "left") {
        // Mpoint.x = start.x

        Mpoint.vx = start.vx
        Mpoint.vy = start.vy
        Mpoint.edge = "left"

        Mpoint.type = "out"
        Mpoint.lineAxis = ""
        Mpoint.trailvx = -1
        Mpoint.trailvy = -1
        Mpoint.edgeoffsetindex = offtmp
      } else {
        // Mpoint.x = start.x + nodewidth

        Mpoint.vx = start.vx
        Mpoint.vy = start.vy
        Mpoint.edge = "right"

        Mpoint.type = "out"
        Mpoint.lineAxis = ""
        Mpoint.trailvx = -1
        Mpoint.trailvy = -1
        Mpoint.edgeoffsetindex = offtmp
      }

      // Mpoint.y = start.y + nodeedgeintervalH * (linearr.out + linearr.in + 1)

    }
  }
  return Mpoint
}
export var fixTrailXy = (relpoint: mypoint_str, lastpoint: mypoint_str) => {
  if (relpoint.lastuse === "x") {
    relpoint.x = lastpoint.x
    if (relpoint.lineAxis === "nocross") {
      if (relpoint.trailvy != -1) {
        relpoint.y = relpoint.trailvy * pathwidth + relpoint.trailvy * nodeheight + pathinterval * relpoint.trailoffsetindex

      } else {
        relpoint.y = (relpoint.vy + 1) * pathwidth + relpoint.vy * nodeheight + nodeedgeintervalH * relpoint.edgeoffsetindex
      }

    } else if (relpoint.lineAxis === "cross") {
      relpoint.y = relpoint.trailvy * pathwidth + relpoint.trailvy * nodeheight + pathinterval * relpoint.trailoffsetindex
    }
  } else {
    relpoint.y = lastpoint.y
    if (relpoint.lineAxis === "nocross") {
      if (relpoint.vy != -1) {
        relpoint.x = relpoint.trailvx * pathwidth + relpoint.trailvx * nodewidth + pathinterval * relpoint.trailoffsetindex
      } else {
        relpoint.x = (relpoint.vx + 1) * pathwidth + relpoint.vx * nodewidth + nodeedgeintervalW * relpoint.edgeoffsetindex
      }
    } else if (relpoint.lineAxis === "cross") {
      relpoint.x = relpoint.trailvx * pathwidth + relpoint.trailvx * nodewidth + pathinterval * relpoint.trailoffsetindex
    }
  }

}
export var fixedgeXy = (relpoint: mypoint_str, node: nodeinfo_str | undefined) => {
  let edge: string = relpoint.edge, offset: number = relpoint.edgeoffsetindex

  if (edge === "top") {

    if (node != undefined) {
      relpoint.x = node.x_ui + nodeedgeintervalW * offset
      relpoint.y = node.y_ui

    }
  } else if (edge === "bottom") {

    if (node != undefined) {
      relpoint.x = node.x_ui + nodeedgeintervalW * offset
      relpoint.y = node.y_ui + nodeheight
    }

  } else if (edge === "left") {

    if (node != undefined) {
      relpoint.x = node.x_ui
      relpoint.y = node.y_ui + nodeedgeintervalH * offset

    }
  } else {

    if (node != undefined) {
      relpoint.x = node.x_ui + nodewidth
      relpoint.y = node.y_ui + nodeedgeintervalH * offset

    }
  }
}