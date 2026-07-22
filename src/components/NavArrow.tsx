import type { QuartzComponent, QuartzComponentConstructor } from "@quartz-community/types"

const navArrowScript = `
function initNavArrow() {
  var wordmark = document.querySelector(".masthead")
  var navLinks = document.querySelectorAll(".wrap nav a")
  if (!wordmark || navLinks.length === 0) return

  var wrap = wordmark.closest(".wrap")
  if (!wrap) return

  var layer = wrap.querySelector(".header-arrow-layer")
  if (!layer) {
    layer = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    layer.setAttribute("class", "header-arrow-layer")
    layer.style.position = "absolute"
    layer.style.inset = "0"
    layer.style.width = "100%"
    layer.style.height = "100%"
    layer.style.pointerEvents = "none"
    layer.style.zIndex = "2"
    layer.style.overflow = "visible"
    wrap.style.position = "relative"
    wrap.appendChild(layer)
  }
  layer.innerHTML = ""

  var path = document.createElementNS("http://www.w3.org/2000/svg", "path")
  path.setAttribute("fill", "none")
  path.setAttribute("stroke", "#8c2f22")
  path.setAttribute("stroke-width", "2.2")
  path.setAttribute("stroke-linecap", "round")
  path.setAttribute("filter", "url(#pencil)")
  path.style.opacity = "0"
  layer.appendChild(path)

  var circleA = document.createElementNS("http://www.w3.org/2000/svg", "ellipse")
  var circleB = document.createElementNS("http://www.w3.org/2000/svg", "ellipse")
  ;[circleA, circleB].forEach(function (c) {
    c.setAttribute("fill", "none")
    c.setAttribute("stroke", "#8c2f22")
    c.setAttribute("stroke-width", "2")
    c.setAttribute("filter", "url(#pencil)")
    c.style.opacity = "0"
    layer.appendChild(c)
  })

  function drawArrow(target) {
    var wrapRect = wrap.getBoundingClientRect()
    var wRect = wordmark.getBoundingClientRect()
    var tRect = target.getBoundingClientRect()
    var x1 = wRect.left + wRect.width / 2 - wrapRect.left
    var y1 = wRect.bottom - wrapRect.top - 2
    var x2 = tRect.left + tRect.width / 2 - wrapRect.left
    var y2 = tRect.top - wrapRect.top - 4
    var midX = (x1 + x2) / 2 + (Math.random() * 16 - 8)
    var midY = (y1 + y2) / 2 + 10
    var d = "M" + x1 + "," + y1 + " Q" + midX + "," + midY + " " + x2 + "," + y2
    path.setAttribute("d", d)
    var len = path.getTotalLength()
    path.style.transition = "none"
    path.style.strokeDasharray = String(len)
    path.style.strokeDashoffset = String(len)
    path.getBoundingClientRect()
    path.style.transition = "stroke-dashoffset 0.45s ease, opacity 0.2s ease"
    path.style.opacity = "0.85"
    path.style.strokeDashoffset = "0"

    var cx = x2
    var cy = tRect.top + tRect.height / 2 - wrapRect.top
    var rx = tRect.width / 2 + 12
    var ry = tRect.height / 2 + 9
    circleA.setAttribute("cx", cx)
    circleA.setAttribute("cy", cy)
    circleA.setAttribute("rx", rx)
    circleA.setAttribute("ry", ry)
    circleA.setAttribute("transform", "rotate(-3 " + cx + " " + cy + ")")
    circleB.setAttribute("cx", cx + 2)
    circleB.setAttribute("cy", cy - 1)
    circleB.setAttribute("rx", rx - 3)
    circleB.setAttribute("ry", ry - 2.5)
    circleB.setAttribute("transform", "rotate(4 " + cx + " " + cy + ")")
    circleA.style.transition = "opacity 0.25s ease 0.3s"
    circleB.style.transition = "opacity 0.25s ease 0.38s"
    circleA.style.opacity = "0.8"
    circleB.style.opacity = "0.6"
  }

  function hideArrow() {
    path.style.opacity = "0"
    circleA.style.transition = "opacity 0.15s ease"
    circleB.style.transition = "opacity 0.15s ease"
    circleA.style.opacity = "0"
    circleB.style.opacity = "0"
  }

  navLinks.forEach(function (item) {
    if (item.dataset.arrowBound) return
    item.dataset.arrowBound = "1"
    item.addEventListener("mouseenter", function () { drawArrow(item) })
    item.addEventListener("mouseleave", hideArrow)
  })
}

function initMarkLines() {
  var targets = document.querySelectorAll("[data-edge-x]")
  if (targets.length === 0) return

  var layer = document.querySelector(".mark-line-layer")
  if (!layer) {
    layer = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    layer.setAttribute("class", "mark-line-layer")
    layer.style.position = "fixed"
    layer.style.inset = "0"
    layer.style.width = "100vw"
    layer.style.height = "100vh"
    layer.style.pointerEvents = "none"
    layer.style.zIndex = "80"
    layer.style.overflow = "visible"
    document.body.appendChild(layer)
  }
  layer.innerHTML = ""

  var path = document.createElementNS("http://www.w3.org/2000/svg", "path")
  path.setAttribute("fill", "none")
  path.setAttribute("stroke", "#8c2f22")
  path.setAttribute("stroke-width", "2.2")
  path.setAttribute("stroke-linecap", "round")
  path.setAttribute("filter", "url(#pencil)")
  path.style.opacity = "0"
  layer.appendChild(path)

  var letter = document.createElementNS("http://www.w3.org/2000/svg", "text")
  letter.setAttribute("font-family", "Doodlefont, cursive")
  letter.setAttribute("font-size", "64")
  letter.setAttribute("text-anchor", "middle")
  letter.setAttribute("dominant-baseline", "middle")
  letter.style.opacity = "0"
  layer.appendChild(letter)

  var letterPool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
  var colorPool = ["#8c2f22", "#2b2e5e", "#4a7c4a", "#a63e88", "#9b8fc4", "#c99a2e", "#23555f"]

  function edgePoint(target) {
    var xPct = parseFloat(target.dataset.edgeX)
    var yPct = parseFloat(target.dataset.edgeY)
    if (isNaN(xPct)) xPct = 50
    if (isNaN(yPct)) yPct = 50
    return { x: (xPct / 100) * window.innerWidth, y: (yPct / 100) * window.innerHeight }
  }

  function drawLine(target) {
    var rect = target.getBoundingClientRect()
    var x1 = rect.left + rect.width / 2
    var y1 = rect.top + rect.height / 2
    var end = edgePoint(target)
    var x2 = end.x
    var y2 = end.y
    var midX = (x1 + x2) / 2 + (Math.random() * 30 - 15)
    var midY = (y1 + y2) / 2 + (Math.random() * 30 - 15)
    var d = "M" + x1 + "," + y1 + " Q" + midX + "," + midY + " " + x2 + "," + y2
    path.setAttribute("d", d)
    var len = path.getTotalLength()
    path.style.transition = "none"
    path.style.strokeDasharray = String(len)
    path.style.strokeDashoffset = String(len)
    path.getBoundingClientRect()
    path.style.transition = "stroke-dashoffset 0.45s ease, opacity 0.2s ease"
    path.style.opacity = "0.85"
    path.style.strokeDashoffset = "0"

    var chosenLetter = letterPool[Math.floor(Math.random() * letterPool.length)]
    var chosenColor = colorPool[Math.floor(Math.random() * colorPool.length)]
    var angle = Math.random() * 50 - 25
    letter.textContent = chosenLetter
    letter.removeAttribute("fill")
    letter.style.removeProperty("fill")
    letter.style.setProperty("fill", chosenColor, "important")
    letter.setAttribute("x", String(x2))
    letter.setAttribute("y", String(y2))
    letter.setAttribute("transform", "rotate(" + angle + " " + x2 + " " + y2 + ")")
    letter.style.transition = "none"
    letter.style.opacity = "0"
    letter.getBoundingClientRect()
    letter.style.transition = "opacity 0.3s ease 0.25s"
    letter.style.opacity = "0.9"
  }

  function hideLine() {
    path.style.opacity = "0"
    letter.style.transition = "opacity 0.15s ease"
    letter.style.opacity = "0"
  }

  targets.forEach(function (item) {
    if (item.dataset.lineBound) return
    item.dataset.lineBound = "1"
    item.addEventListener("mouseenter", function () { drawLine(item) })
    item.addEventListener("mouseleave", hideLine)
  })
}

document.addEventListener("nav", initNavArrow)
document.addEventListener("render", initNavArrow)
document.addEventListener("nav", initMarkLines)
document.addEventListener("render", initMarkLines)
`

const NavArrow: QuartzComponent = () => null
NavArrow.afterDOMLoaded = navArrowScript

export default (() => NavArrow) satisfies QuartzComponentConstructor
