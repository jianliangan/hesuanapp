export class mypoint_str {
  //{ "vx": -1, "vy": -1, "trailvx": 0, "trailvy": 0, "offsetindex": 0间隔偏移量,  "top代表点的去向方向", 
  //"id": 从节点id的e边离开、进入, "edge": 节点边, "lineAxis": "cross/nocross", "type": "out代表离开节点，line轨道中，in进入节点" }
  trailoffsetindex: number
  edgeoffsetindex: number
  vx: number
  vy: number
  trailvx: number
  trailvy: number
  edge: string
  type: string
  lineAxis: string
  node_id: string
  x: number//将来算坐标用
  y: number
  lastuse: string//沿用上一个节点的x坐标还是y坐标

  constructor () {
    this.edgeoffsetindex = 0
    this.trailoffsetindex = 0
    this.vx = -1
    this.vy = -1
    this.trailvx = -1
    this.trailvy = -1
    this.edge = ""
    this.node_id = ""
    this.type = ""
    this.lineAxis = ""
    this.x = -1
    this.y = -1
    this.lastuse = ""
  }
}