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
document.addEventListener("nav", initNavArrow)
document.addEventListener("render", initNavArrow)
`

const NavArrow: QuartzComponent = () => null
NavArrow.afterDOMLoaded = navArrowScript

export default (() => NavArrow) satisfies QuartzComponentConstructor