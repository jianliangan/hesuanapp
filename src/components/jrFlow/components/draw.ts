//画箭头

export var drawarrow = (x: number, y: number, direct: string): string => {
  //> 
  let str = ""
  if (direct === "top") {
    str = "M " + x + " " + y + " L " + (x + 3.5) + " " + (y + 7) + " L " + x + " " + (y + 5.25) + " L " + (x - 3.5) + " " + (y + 7) + " Z"
  } else if (direct === "bottom") {
    str = "M " + x + " " + y + " L " + (x - 3.5) + " " + (y - 7) + " L " + x + " " + (y - 5.25) + " L " + (x + 3.5) + " " + (y - 7) + " Z"
  } else if (direct === "left") {
    str = "M " + x + " " + y + " L " + (x + 7) + " " + (y + 3.5) + " L " + (x + 5.25) + " " + y + " L " + (x + 7) + " " + (y - 3.5) + " Z"
  } else {
    //>
    str = "M " + x + " " + y + " L " + (x - 7) + " " + (y + 3.5) + " L " + (x - 5.25) + " " + y + " L " + (x - 7) + " " + (y - 3.5) + " Z"

  }

  return str
}
