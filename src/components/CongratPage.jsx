import React, { useState, useEffect } from 'react'

function CongratPage(props) {
  let canvas, ctx, xPoint, yPoint;
  let particles = [];
  const [probability, _] = useState(0.04);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

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
    }, 250);
    onLoad()
    window.addEventListener('resize', debouncedHandleResize);
    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
  }, []);

  useEffect(() => {
    onLoad()
  }, [windowSize])

  function onLoad() {
    canvas = document.getElementById("congrat");
    ctx = canvas.getContext("2d");
    canvas.addEventListener('click', props.continues, false)
    window.requestAnimationFrame(updateWorld);
  }

  function updateWorld() {
    ctx = canvas.getContext("2d");
    ctx.font = 'italic 70px Arial';
    ctx.textAlign = 'center';
    ctx. textBaseline = 'middle';
    ctx.color = 'white'
    ctx.fillStyle = 'white'; 
    ctx.fillText('恭喜！', windowSize.width / 2, windowSize.height / 2 - 100);
    ctx.font = 'italic 120px Arial';
    ctx.fillText(props.winner, windowSize.width / 2, windowSize.height / 2 + 100);
    update();
    paint();
    window.requestAnimationFrame(updateWorld);
  }

  function update() {
    if (particles.length < 500 && Math.random() < probability) {
      createFirework();
    }
    var alive = [];
    for (var i = 0; i < particles.length; i++) {
      if (particles[i].move()) {
        alive.push(particles[i]);
      }
    }
    particles = alive;
  }

  function paint() {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 0, windowSize.width, windowSize.height);
    ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < particles.length; i++) {
      particles[i].draw(ctx);
    }
  }

  function createFirework() {
    xPoint = Math.random() * (windowSize.width - 200) + 100;
    yPoint = Math.random() * (windowSize.height - 200) + 100;
    var nFire = Math.random() * 50 + 100;
    var c = "rgb(" + (~~(Math.random() * 200 + 55)) + ","
      + (~~(Math.random() * 200 + 55)) + "," + (~~(Math.random() * 200 + 55)) + ")";
    for (var i = 0; i < nFire; i++) {
      var particle = new Particle();
      particle.color = c;
      var vy = Math.sqrt(25 - particle.vx * particle.vx);
      if (Math.abs(particle.vy) > vy) {
        particle.vy = particle.vy > 0 ? vy : -vy;
      }
      particles.push(particle);
    }
  }

  class Particle {
    constructor() {
      this.w = this.h = Math.random() * 4 + 1;
      this.x = xPoint - this.w / 2;
      this.y = yPoint - this.h / 2;
      this.vx = (Math.random() - 0.5) * 10;
      this.vy = (Math.random() - 0.5) * 10;
      this.alpha = Math.random() * .5 + .5;
      this.color;
      this.gravity = 0.05
    }
    move() {
      this.x += this.vx;
      this.vy += this.gravity;
      this.y += this.vy;
      this.alpha -= 0.01;
      if (this.x <= -this.w || this.x >= screen.width ||
        this.y >= screen.height ||
        this.alpha <= 0) {
        return false;
      }
      return true;
    }
    draw(c) {
      c.save();
      c.beginPath();
      c.translate(this.x + this.w / 2, this.y + this.h / 2);
      c.arc(0, 0, this.w, 0, Math.PI * 2);
      c.fillStyle = this.color;
      c.globalAlpha = this.alpha;
      c.closePath();
      c.fill();
      c.restore();
    }
  }

  return (
    <div id='congrat-page'>
      <canvas
        id='congrat'
        width={windowSize.width}
        height={windowSize.height}
      />
    </div>)
}

export default CongratPage;