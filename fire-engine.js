class BlueFlame {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.life = 1.0;
        this.decay = Math.random() * 0.02 + 0.01;
        this.speedY = Math.random() * 3 + 2;
        this.waveOffset = Math.random() * 10;
        this.size = Math.random() * 8 + 4;
    }

    update() {
        this.y -= this.speedY;
        this.life -= this.decay;
        // Curvatura orgánica
        this.curvedX = this.x + Math.sin(this.y * 0.04 + this.waveOffset) * 12 * this.life;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const alpha = this.life;
        const g = ctx.createRadialGradient(this.curvedX, this.y, 0, this.curvedX, this.y, this.size);
        g.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        g.addColorStop(0.3, `rgba(0, 242, 255, ${alpha})`);
        g.addColorStop(0.6, `rgba(0, 102, 255, ${alpha * 0.4})`);
        g.addColorStop(1, 'transparent');
        
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(this.curvedX, this.y, this.size * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

const FireEngine = {
    particles: [],
    render(ctx, cardId) {
        const card = document.getElementById(cardId);
        if (!card) return;
        const rect = card.getBoundingClientRect();

        // Generar llamas en los bordes
        for(let i=0; i<3; i++) {
            this.particles.push(new BlueFlame(rect.left, rect.top + Math.random()*rect.height));
            this.particles.push(new BlueFlame(rect.right, rect.top + Math.random()*rect.height));
        }

        this.particles = this.particles.filter(p => p.life > 0);
        this.particles.forEach(p => { p.update(); p.draw(ctx); });
    }
};