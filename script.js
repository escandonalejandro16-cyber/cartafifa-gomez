const bgCanvas = document.getElementById('ucl-bg-canvas');
const bgCtx = bgCanvas.getContext('2d');
let width, height, stars = [], starballs = [];

function resize() {
    width = bgCanvas.width = window.innerWidth;
    height = bgCanvas.height = window.innerHeight;
    stars = Array.from({length: 100}, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2,
        opacity: Math.random()
    }));
    starballs = Array.from({length: 6}, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 80 + Math.random() * 100,
        rotation: Math.random() * Math.PI * 2,
        speed: (Math.random() - 0.5) * 0.005,
        opacity: 0.08
    }));
}

function drawStarShape(ctx, cx, cy, spikes, outer, inner) {
    let rot = Math.PI/2*3; let step = Math.PI/spikes;
    ctx.beginPath();
    for(let i=0; i<spikes; i++) {
        ctx.lineTo(cx + Math.cos(rot)*outer, cy + Math.sin(rot)*outer); rot += step;
        ctx.lineTo(cx + Math.cos(rot)*inner, cy + Math.sin(rot)*inner); rot += step;
    }
    ctx.closePath(); ctx.fill();
}

function drawUCLStarball(ctx, x, y, radius, rotation, opacity) {
    ctx.save();
    ctx.translate(x, y); ctx.rotate(rotation);
    ctx.fillStyle = `rgba(0, 242, 255, ${opacity})`;
    for(let i=0; i<8; i++) {
        const a = (i * Math.PI * 2) / 8;
        ctx.save();
        ctx.translate(Math.cos(a)*radius, Math.sin(a)*radius);
        ctx.rotate(a + Math.PI/2);
        drawStarShape(ctx, 0, 0, 5, radius*0.4, radius*0.15);
        ctx.restore();
    }
    ctx.restore();
}

// FUNCIÓN ANIMATE UNIFICADA
function animate() {
    bgCtx.clearRect(0, 0, width, height);
    
    // 1. Estrellas
    stars.forEach(s => {
        bgCtx.fillStyle = `rgba(255, 255, 255, ${Math.abs(Math.sin(s.opacity += 0.01))})`;
        bgCtx.beginPath(); bgCtx.arc(s.x, s.y, s.size, 0, Math.PI * 2); bgCtx.fill();
    });

    // 2. Balones
    starballs.forEach(sb => {
        sb.rotation += sb.speed;
        drawUCLStarball(bgCtx, sb.x, sb.y, sb.radius, sb.rotation, sb.opacity);
    });

    // 3. Fuego (Llamado al motor externo)
    FireEngine.render(bgCtx, 'main-card');

    requestAnimationFrame(animate);
}

function drawCardDetails() {
    const topCtx = document.getElementById('topCanvas').getContext('2d');
    const botCtx = document.getElementById('bottomCanvas').getContext('2d');
    const w = 380;
    topCtx.canvas.width = w; topCtx.canvas.height = 120;
    botCtx.canvas.width = w; botCtx.canvas.height = 80;
    const neon = topCtx.createLinearGradient(0,0,w,0);
    neon.addColorStop(0,'#0044ff'); neon.addColorStop(0.5,'#00f2ff'); neon.addColorStop(1,'#0044ff');
    topCtx.strokeStyle = neon; topCtx.lineWidth = 4;
    topCtx.beginPath(); topCtx.moveTo(0,100); topCtx.bezierCurveTo(w*0.2,40,w*0.8,40,w,100); topCtx.stroke();
    botCtx.strokeStyle = neon; botCtx.lineWidth = 6;
    botCtx.beginPath(); botCtx.moveTo(0,0); botCtx.lineTo(w*0.5,70); botCtx.lineTo(w,0); botCtx.stroke();
}

window.addEventListener('resize', resize);
resize();
drawCardDetails();
animate();