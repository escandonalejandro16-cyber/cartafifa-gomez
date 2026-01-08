const canvas = document.getElementById('iframeCanvas');
const ctx = canvas.getContext('2d');

// --- Configuración de Recursos ---
const folders = {
    right: { path: 'iframesSpeed/', total: 18 },
    left: { path: 'iframeSpeedIzq/', total: 10 }
};

const images = { right: [], left: [] };
let loadedCount = 0;
const totalToLoad = folders.right.total + folders.left.total;

// --- Variables de Estado de Animación ---
let currentFrame = 1;
let posX = 0;
let direction = 1; // 1 = Derecha (Right), -1 = Izquierda (Left)
let isInitialized = false;

// Configuración de pantalla
const container = document.querySelector('.iframe-fixed-animation');

// --- 1. Precarga de Imágenes ---
function preloadAll() {
    for (let i = 1; i <= folders.right.total; i++) {
        const img = new Image();
        img.src = `${folders.right.path}${i}.png`;
        img.onload = checkLoad;
        images.right[i] = img;
    }
    for (let i = 1; i <= folders.left.total; i++) {
        const img = new Image();
        img.src = `${folders.left.path}${i}.png`;
        img.onload = checkLoad;
        images.left[i] = img;
    }
}

function checkLoad() {
    loadedCount++;
    if (loadedCount === totalToLoad && !isInitialized) {
        isInitialized = true;
        initCanvas();
        requestAnimationFrame(mainLoop);
    }
}

function initCanvas() {
    canvas.width = images.right[1].width || 250;
    canvas.height = images.right[1].height || 350;
}

// --- 2. Lógica de Movimiento y Renderizado ---
function mainLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const currentSet = direction === 1 ? images.right : images.left;
    const maxFrames = direction === 1 ? folders.right.total : folders.left.total;

    const imgToDraw = currentSet[currentFrame];
    if (imgToDraw) {
        ctx.drawImage(imgToDraw, 0, 0);
    }

    // --- Lógica de Velocidad X ---
    // Estático del 1 al 5, movimiento del 6 en adelante
    if (currentFrame > 5) {
        let speedX = 8; 
        posX += speedX * direction;
        container.style.left = `${posX}px`;
    } else {
        container.style.left = `${posX}px`;
    }

    // --- Lógica de Ciclo de Fotogramas (Simétrica) ---
    currentFrame++;
    
    // Si llegamos al final de CUALQUIER carpeta, volvemos al frame 6
    if (currentFrame > maxFrames) {
        currentFrame = 6;
    }

    // --- Lógica de Rebote y Cambio de Carpeta ---
    const screenWidth = window.innerWidth;
    
    if (direction === 1 && posX >= (screenWidth - container.offsetWidth)) {
        direction = -1;
        currentFrame = 1; // Inicia intro 1-5 de la carpeta izquierda
        posX = screenWidth - container.offsetWidth;
    } 
    else if (direction === -1 && posX <= 0) {
        direction = 1;
        currentFrame = 1; // Inicia intro 1-5 de la carpeta derecha
        posX = 0;
    }

    // Sincronización de fluidez (18 FPS para transiciones suaves)
    setTimeout(() => {
        requestAnimationFrame(mainLoop);
    }, 1000 / 18); 
}

preloadAll();

window.addEventListener('resize', () => {
    if (posX > window.innerWidth) posX = 0;
});