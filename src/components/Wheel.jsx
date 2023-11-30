import React, { useEffect, useMemo, useState, useRef } from 'react'


const WheelComponent = ({
  segments,
  segColors,
  onFinished,
  primaryColor = 'black',
  contrastColor = 'white',
  buttonText = 'Spin',
  isOnlyOnce = true,
  size = 290,
  upDuration = 100,
  downDuration = 1000,
  fontFamily = 'proxima-nova'
}) => {
  let currentSegment = ''
  const [isStarted, setIsStarted] = useState(false)
  const [isFinished, setFinished] = useState(false)
  const timerHandle = useRef(0)
  const timerDelay = useMemo(() => segments.length, [segments])
  const angleCurrent = useRef(0)
  const angleDelta = useRef(0)
  let canvasContext = null
  let maxSpeed = Math.PI / `${segments.length}`
  const upTime = useMemo(() => {
    return segments.length * upDuration
  }, [upDuration, segments]) 
  const downTime = useMemo(() => {
    return segments.length * downDuration
  }, [downDuration, segments])

  let spinStart = 0
  let frames = 0

  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [center, setCenter] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  const debounce = (func, delay) => {
    let debounceTimer;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    }
  }

  useEffect(() => {
    const debouncedHandleResize = debounce(() => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      setCenter({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }, 250);
    wheelInit()
    window.addEventListener('resize', debouncedHandleResize);
    setTimeout(() => {
      window.scrollTo(0, 1)
    }, 0)
    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
  }, []);


  useEffect(() => {
    canvasContext = document.getElementById('canvas').getContext('2d')
    wheelDraw();
  }, [center])

  const wheelInit = () => {
    initCanvas();
    wheelDraw();
  }

  const initCanvas = () => {
    let canvas = document.getElementById('canvas')
    if (navigator.userAgent.indexOf('MSIE') !== -1) {
      canvas = document.createElement('canvas')
      canvas.setAttribute('width', windowSize.width)
      canvas.setAttribute('height', windowSize.height)
      canvas.setAttribute('id', 'canvas')
      document.getElementById('wheel').appendChild(canvas)
    }
    canvas.addEventListener('click', spin, false)
    canvasContext = canvas.getContext('2d')
  }

  const spin = () => {
    setIsStarted(true)
    if (timerHandle.current === 0) {
      spinStart = new Date().getTime()
      maxSpeed = Math.PI / segments.length
      frames = 0
      timerHandle.current = setInterval(onTimerTick, timerDelay)
    }
  }
  const onTimerTick = () => {
    frames++
    draw()
    const duration = new Date().getTime() - spinStart
    let progress = 0
    let finished = false
    if (duration < upTime) {
      progress = duration / upTime
      angleDelta.current = maxSpeed * Math.sin((progress * Math.PI) / 2)
    } else {
      progress = (duration - upTime) / downTime;
      progress = easeOutCubic(progress);
      console.log(progress)
      angleDelta.current  = maxSpeed * (1 - progress);
      if (progress >= 0.999) finished = true
    }

    angleCurrent.current += angleDelta.current
    while (angleCurrent.current >= Math.PI * 2) angleCurrent.current -= Math.PI * 2
    if (finished) {
      setFinished(true)
      onFinished(currentSegment)
      clearInterval(timerHandle.current)
      timerHandle.current = 0
      angleDelta.current = 0
    }
  }

  function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }

  const wheelDraw = () => {
    clear()
    drawWheel()
    drawNeedle()
  }

  const draw = () => {
    clear()
    drawWheel()
    drawNeedle()
  }

  const drawSegment = (key, lastAngle, angle) => {
    const ctx = canvasContext
    const value = segments[key]
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(center.x, center.y)
    ctx.arc(center.x, center.y, size, lastAngle, angle, false)
    ctx.lineTo(center.x, center.y)
    ctx.closePath()
    ctx.fillStyle = segColors[key]
    ctx.fill()
    ctx.stroke()
    ctx.save()
    ctx.translate(center.x, center.y)
    ctx.rotate((lastAngle + angle) / 2)
    ctx.fillStyle = contrastColor
    ctx.font = 'bold 1em ' + fontFamily
    ctx.fillText(value.substr(0, 21), size / 2 + 20, 0)
    ctx.restore()
  }

  const drawWheel = () => {
    if (!canvasContext) return;

    const ctx = canvasContext
    let lastAngle = angleCurrent.current
    const len = segments.length
    const PI2 = Math.PI * 2
    ctx.lineWidth = 1
    ctx.strokeStyle = primaryColor
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.font = '1em ' + fontFamily
    for (let i = 1; i <= len; i++) {
      const angle = PI2 * (i / len) + angleCurrent.current
      drawSegment(i - 1, lastAngle, angle)
      lastAngle = angle
    }

    // Draw a center circle
    ctx.beginPath()
    ctx.arc(center.x, center.y, 50, 0, PI2, false)
    ctx.closePath()
    ctx.fillStyle = primaryColor
    ctx.lineWidth = 10
    ctx.strokeStyle = contrastColor
    ctx.fill()
    ctx.font = 'bold 1em ' + fontFamily
    ctx.fillStyle = contrastColor
    ctx.textAlign = 'center'
    ctx.fillText(buttonText, center.x, center.y + 3)
    ctx.stroke()

    // Draw outer circle
    ctx.beginPath()
    ctx.arc(center.x, center.y, size, 0, PI2, false)
    ctx.closePath()

    ctx.lineWidth = 10
    ctx.strokeStyle = primaryColor
    ctx.stroke()
  }

  const drawNeedle = () => {
    const ctx = canvasContext
    ctx.lineWidth = 1
    ctx.strokeStyle = contrastColor
    ctx.fileStyle = contrastColor
    ctx.beginPath()
    ctx.moveTo(center.x + 20, center.y - 50)
    ctx.lineTo(center.x - 20, center.y - 50)
    ctx.lineTo(center.x, center.y - 70)
    ctx.closePath()
    ctx.fill()
    const change = angleCurrent.current + Math.PI / 2
    let i =
      segments.length -
      Math.floor((change / (Math.PI * 2)) * segments.length) -
      1
    if (i < 0) i = i + segments.length
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = primaryColor
    ctx.font = 'bold 1.5em ' + fontFamily
    currentSegment = segments[i]
    isStarted && ctx.fillText(currentSegment, center.x + 10, center.y + size + 50)
  }
  const clear = () => {
    if (!canvasContext) return;
    canvasContext.clearRect(0, 0, windowSize.width, windowSize.height)
  }

  return (
    <div id='wheel'>
      <canvas
        id='canvas'
        width={windowSize.width}
        height={windowSize.height}
        style={{
          pointerEvents: isFinished && isOnlyOnce ? 'none' : 'auto'
        }}
      />
    </div>
  )
}
export default WheelComponent