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

function initTitleLines() {
  var targets = document.querySelectorAll("[data-edge-multi]")
  if (targets.length === 0) return

  var layer = document.querySelector(".title-line-layer")
  if (!layer) {
    layer = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    layer.setAttribute("class", "title-line-layer")
    layer.style.position = "fixed"
    layer.style.inset = "0"
    layer.style.width = "100vw"
    layer.style.height = "100vh"
    layer.style.pointerEvents = "none"
    layer.style.zIndex = "80"
    layer.style.overflow = "visible"
    document.body.appendChild(layer)
  }

  var letterPool = "abcdefghijklmnopqrstuvwxyz".split("")
  var colorPool = ["#8c2f22", "#2b2e5e", "#4a7c4a", "#a63e88", "#9b8fc4", "#c99a2e", "#23555f"]

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1))
      var tmp = arr[i]
      arr[i] = arr[j]
      arr[j] = tmp
    }
    return arr
  }

  function showLines(target) {
    var count = 3 + Math.floor(Math.random() * 5)
    var rect = target.getBoundingClientRect()
    var group = document.createElementNS("http://www.w3.org/2000/svg", "g")

    var cx = rect.left + rect.width / 2
    var cy = rect.top + rect.height / 2
    var rx = rect.width / 2 + 6
    var ry = rect.height / 2 + 8

    var sector = (Math.PI * 2) / count
    var angles = []
    for (var a = 0; a < count; a++) {
      var jitter = (Math.random() - 0.5) * sector * 0.6
      angles.push(a * sector + jitter)
    }

    var minDist = 55
    var maxDist = 165
    var lengths = []
    for (var li = 0; li < count; li++) {
      var base = count === 1 ? minDist : minDist + (maxDist - minDist) * (li / (count - 1))
      lengths.push(base + (Math.random() * 10 - 5))
    }
    shuffle(lengths)

    for (var i = 0; i < count; i++) {
      var theta = angles[i]
      var ux = Math.cos(theta)
      var uy = Math.sin(theta)
      var x1 = cx + ux * rx
      var y1 = cy + uy * ry
      var dist = lengths[i]

      if (uy < -0.2) {
        var margin = 14
        var vertReach = Math.abs(uy) * dist
        var maxUpReach = Math.max(y1 - margin, 10)
        if (vertReach > maxUpReach) {
          dist = maxUpReach / Math.abs(uy)
        }
      }

      var x2 = x1 + ux * dist
      var y2 = y1 + uy * dist
      var midX = (x1 + x2) / 2 + (Math.random() * 6 - 3)
      var midY = (y1 + y2) / 2 + (Math.random() * 6 - 3)

      var path = document.createElementNS("http://www.w3.org/2000/svg", "path")
      path.setAttribute("d", "M" + x1 + "," + y1 + " Q" + midX + "," + midY + " " + x2 + "," + y2)
      path.setAttribute("fill", "none")
      path.setAttribute("stroke", "#8c2f22")
      path.setAttribute("stroke-width", "1.4")
      path.setAttribute("filter", "url(#pencil)")
      path.style.opacity = "0"
      group.appendChild(path)

      var letter = document.createElementNS("http://www.w3.org/2000/svg", "text")
      var chosenLetter = letterPool[Math.floor(Math.random() * letterPool.length)]
      var chosenColor = colorPool[Math.floor(Math.random() * colorPool.length)]
      var angle = Math.random() * 50 - 25
      letter.textContent = chosenLetter
      letter.setAttribute("font-family", "Doodlefont, cursive")
      letter.setAttribute("font-size", "56")
      letter.setAttribute("text-anchor", "middle")
      letter.setAttribute("dominant-baseline", "middle")
      letter.setAttribute("x", String(x2))
      letter.setAttribute("y", String(y2))
      letter.setAttribute("transform", "rotate(" + angle + " " + x2 + " " + y2 + ")")
      letter.style.setProperty("fill", chosenColor, "important")
      letter.style.opacity = "0"
      group.appendChild(letter)

      ;(function (p, l, delay) {
        var len = p.getTotalLength()
        p.style.transition = "none"
        p.style.strokeDasharray = String(len)
        p.style.strokeDashoffset = String(len)
        p.getBoundingClientRect()
        p.style.transition = "stroke-dashoffset 0.4s ease " + delay + "s, opacity 0.2s ease " + delay + "s"
        p.style.opacity = "0.8"
        p.style.strokeDashoffset = "0"
        l.style.transition = "opacity 0.3s ease " + (delay + 0.2) + "s"
        l.style.opacity = "0.9"
      })(path, letter, i * 0.08)
    }

    layer.appendChild(group)
    target._lineGroup = group
  }

  function hideLines(target) {
    var group = target._lineGroup
    if (!group) return
    var els = group.querySelectorAll("path, text")
    els.forEach(function (el) {
      el.style.transition = "opacity 0.15s ease"
      el.style.opacity = "0"
    })
    setTimeout(function () {
      if (group.parentNode) group.parentNode.removeChild(group)
    }, 200)
    target._lineGroup = null
  }

  targets.forEach(function (item) {
    if (item.dataset.multiBound) return
    item.dataset.multiBound = "1"
    item.addEventListener("mouseenter", function () { showLines(item) })
    item.addEventListener("mouseleave", function () { hideLines(item) })
  })
}

function initTitleMark() {
  var targets = document.querySelectorAll("[data-edge-multi]")
  if (targets.length === 0) return

  var underlineMarks = [
    "underline-dash-gold.png",
    "underline-thick-navy.png",
    "underline-thin-green.png",
    "underline-thin-sage.png",
    "underline-zigzag-gold.png",
    "underline-thick-gold.png"
  ]

  var overlayMarks = [
    "box-outline-green.png",
    "box-outline-lavender.png",
    "circle-oval-red.png",
    "circle-knot-red.png",
    "circle-knot-rust.png",
    "scribble-hatch-magenta.png",
    "scribble-hatch-rust.png"
  ]

  var markPool = underlineMarks.concat(overlayMarks)

  function staticBase() {
    var ref = document.querySelector(".pencil-rule-mini")
    if (ref && ref.src) return ref.src.replace(/[^/]+$/, "")
    var slug = document.body.getAttribute("data-slug") || ""
    var prefix = /^(kind|mode|grid)\\//.test(slug) ? "../" : "./"
    return new URL(prefix + "static/", document.baseURI).href
  }

  var img = document.createElement("img")
  img.className = "title-mark-overlay"
  img.style.position = "fixed"
  img.style.pointerEvents = "none"
  img.style.zIndex = "78"
  img.style.opacity = "0"
  img.style.transition = "opacity 0.2s ease"
  document.body.appendChild(img)

  function showMark(target) {
    var rect = target.getBoundingClientRect()
    var base = staticBase()
    var chosen = markPool[Math.floor(Math.random() * markPool.length)]
    var isUnderline = underlineMarks.indexOf(chosen) !== -1
    var angle = Math.random() * 8 - 4
    var padX, top, height

    if (isUnderline) {
      padX = rect.width * 0.08
      var padY = rect.height * 0.35
      top = rect.top - padY
      height = rect.height + padY * 2
    } else {
      padX = rect.width * 0.18
      var padTop = rect.height * 0.75
      var padBottom = rect.height * 0.15
      top = rect.top - padTop
      height = rect.height + padTop + padBottom
    }

    img.src = base + chosen
    img.style.left = (rect.left - padX) + "px"
    img.style.top = top + "px"
    img.style.width = (rect.width + padX * 2) + "px"
    img.style.height = height + "px"
    img.style.transform = "rotate(" + angle + "deg)"
    img.style.transition = "none"
    img.style.opacity = "0"
    img.getBoundingClientRect()
    img.style.transition = "opacity 0.25s ease"
    img.style.opacity = "0.55"
  }

  function hideMark() {
    img.style.transition = "opacity 0.15s ease"
    img.style.opacity = "0"
  }

  targets.forEach(function (item) {
    if (item.dataset.markBound) return
    item.dataset.markBound = "1"
    item.addEventListener("mouseenter", function () { showMark(item) })
    item.addEventListener("mouseleave", hideMark)
  })
}

document.addEventListener("nav", initNavArrow)
document.addEventListener("render", initNavArrow)
document.addEventListener("nav", initMarkLines)
document.addEventListener("render", initMarkLines)
document.addEventListener("nav", initTitleLines)
document.addEventListener("render", initTitleLines)
document.addEventListener("nav", initTitleMark)
document.addEventListener("render", initTitleMark)
`

const NavArrow: QuartzComponent = () => null
NavArrow.afterDOMLoaded = navArrowScript

export default (() => NavArrow) satisfies QuartzComponentConstructor