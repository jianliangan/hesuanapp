export class nodeinfo_str {
  // "name": "执照是否走邮寄", "vx": 0, "vy": 0, "key": "id0", "x_ui": 0, "y_ui": 0 
  node_name: string
  vx: number
  vy: number
  node_id: string
  flow_id: string
  x_ui: number
  y_ui: number
  stroke_ui: string
  timeout: number
  cmd_: string
  constructor () {
    this.node_name = ""
    this.vx = -1
    this.vy = -1
    this.node_id = ""
    this.x_ui = -1
    this.y_ui = -1
    this.stroke_ui = ""
    this.timeout = 0
    this.cmd_ = ""
    this.flow_id = ""
  }
}
export class nodeOutIns_str {
  in: number = 0
  out: number = 0
}
export const nodeheight: number = 40 //节点高度
export const nodewidth: number = 95  //节点宽度
export const nodeLRmaxnum: number = 5  //每个边最多有奇数个线头,
export const nodeTBmaxnum: number = 10  //每个边最多有奇数个线头,
export const nodeedgeintervalW: number = nodewidth / nodeTBmaxnum
export const nodeedgeintervalH: number = nodeheight / nodeLRmaxnum
//最初保存的是4个边，以后改成
var nodelines = new Map<string, Map<string, nodeOutIns_str>>()//{"id0":{"top":{"in":0,"out":0},"left":{"in":0,"out":[]},"bottom":{"in":0,"out":[]},"right":{"in":0,"out":[]}}}
var nodelinestrail = new Map<string, number>()//{"id0":{"top":{"in":0,"out":0},"left":{"in":0,"out":[]},"bottom":{"in":0,"out":[]},"right":{"in":0,"out":[]}}}
export var DrawNodeInit = () => {
  nodelines.clear()
  nodelinestrail.clear()
}
var gettrailXY = (x: number, y: number, edge: string): string => {
  if (edge === "top") {
    return "a" + ((x + 1) + x) + ":" + (y + y)//a,b用来区分上下存一组，左右存一组
  } else if (edge === "bottom") {
    return "a" + ((x + 1) + x) + ":" + (y + 1 + y + 1)
  } else if (edge === "left") {
    return "b" + (x + x) + ":" + (y + y + 1)
  } else if (edge === "right") {
    return "b" + (x + 1 + x + 1) + ":" + (y + y + 1)
  }
  return ""
}
/**
 * 拿到此边此时应该放置的偏移量
 * @param key 
 * @param edge 
 */
export var getPeerEdgeOffset = (node: nodeinfo_str, edge: string): number => {
  let key = node.node_id

  let offtmp: number = 0 + 1

  let map1 = nodelines.get(key)
  if (map1 != undefined) {
    let map2: nodeOutIns_str | undefined = map1.get(edge)
    if (map2 != undefined) {
      offtmp = map2.in + map2.out + 1
    }
  }


  return offtmp


  // return offtmp
}
/**
 * 修改边缘偏移记录
 * @param key 
 * @param edge 
 * @param direct 
 */
export var fixnodeEdgeOffset = (node: nodeinfo_str, edge: string, direct: string): number => {

  ////////////////////////////////////
  var key = node.node_id
  let map1 = nodelines.get(key)
  let offtmp: number = 0
  let directinre = 0
  if (map1 != undefined) {
    let map2: nodeOutIns_str | undefined = map1.get(edge)

    if (map2 != undefined) {
      if (direct === "in" || direct === "directin") {
        map2.in = map2.in + 1
      } else {
        map2.out = map2.out + 1
      }
      offtmp = map2.in + map2.out
      directinre = map2.in + map2.out
    } else {
      offtmp = 1
      if (direct === "in" || direct === "directin") {
        map1.set(edge, { in: offtmp, out: 0 })
      } else {
        map1.set(edge, { in: 0, out: offtmp })
      }
      directinre = 1
    }

  } else {
    offtmp = 1
    map1 = new Map<string, nodeOutIns_str>()
    if (direct === "in" || direct === "directin") {
      map1.set(edge, { in: offtmp, out: 0 })
    } else {
      map1.set(edge, { in: 0, out: offtmp })
    }
    nodelines.set(key, map1)
    directinre = 1
  }


  ////
  let offtmp2: number = 0
  if (direct === "directin") {
    return directinre
  } else {

    let vx = node.vx
    let vy = node.vy
    let keystr = gettrailXY(vx, vy, edge)
    let map2 = nodelinestrail.get(keystr)

    if (map2 != undefined) {
      offtmp2 = map2 + 1
    } else {
      offtmp2 = 1
    }
    nodelinestrail.set(keystr, offtmp2)
  }


  return offtmp2
}