import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("canvas-container").appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const imageSources = [
    "https://picsum.photos/id/237/200/300",
    "https://picsum.photos/id/238/200/300",
    "https://picsum.photos/id/239/200/300",
    "https://picsum.photos/id/231/200/300",
    "https://picsum.photos/id/232/200/300",
    "https://picsum.photos/id/233/200/300",
    "https://picsum.photos/id/234/200/300",
    "https://picsum.photos/id/235/200/300",
    "https://picsum.photos/id/236/200/300",
    "https://picsum.photos/id/240/200/300",
    "https://picsum.photos/id/287/200/300",
    "https://picsum.photos/id/218/200/300",
    "https://picsum.photos/id/219/200/300",
    "https://picsum.photos/id/211/200/300",
    "https://picsum.photos/id/212/200/300",
    "https://picsum.photos/id/213/200/300",
    "https://picsum.photos/id/214/200/300",
    "https://picsum.photos/id/215/200/300",
    "https://picsum.photos/id/216/200/300",
    "https://picsum.photos/id/270/200/300",
    "https://picsum.photos/id/281/200/300",
    "https://picsum.photos/id/282/200/300",
    "https://picsum.photos/id/283/200/300",
    "https://picsum.photos/id/284/200/300",
    "https://picsum.photos/id/225/200/300",
    "https://picsum.photos/id/228/200/300",
    "https://picsum.photos/id/280/200/300",
];

const planeWidth = 1;
const planeHeight = 1.5;
const planeAspect = planeWidth / planeHeight;

const TOTAL_PLANES = imageSources.length;
const spacing = 2.5; // distance Z entre chaque plan
const totalDepth = TOTAL_PLANES * spacing;

// Positions X/Y variées pour chaque slot (10 positions uniques)
const layouts = [
    { x: 2.0, y: 0.0 },
    { x: -2.0, y: 0.3 },
    { x: 1.2, y: -0.4 },
    { x: -1.5, y: 0.5 },
    { x: 2.5, y: 0.2 },
    { x: -0.8, y: -0.3 },
    { x: 1.8, y: 0.6 },
    { x: -2.3, y: -0.1 },
    { x: 0.5, y: 0.4 },
    { x: -1.8, y: 0.2 },
];

const planes = [];

// Charge les textures d'abord, puis crée les plans
const textures = [];
let loadedCount = 0;

imageSources.forEach((src, i) => {
    textureLoader.load(src, (texture) => {
        coverTexture(texture, planeAspect, "center");
        textures[i] = texture;
        loadedCount++;
        if (loadedCount === imageSources.length) {
            buildPlanes();
        }
    });
});

function buildPlanes() {
    for (let i = 0; i < TOTAL_PLANES; i++) {
        const texture = textures[i % imageSources.length];

        // Clone la texture pour ne pas partager les mêmes offset/repeat
        const texClone = texture.clone();
        texClone.needsUpdate = true;
        coverTexture(texClone, planeAspect, "center");

        const material = new THREE.MeshBasicMaterial({
            map: texClone,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0,
        });

        const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
        const mesh = new THREE.Mesh(geometry, material);

        const layout = layouts[i % layouts.length];
        // Les plans commencent devant la caméra (z positif) pour ne pas être visibles au départ
        // La caméra part à z = 5, les plans démarrent à z = -spacing pour être derrière
        mesh.position.set(layout.x, layout.y, -(i + 1) * spacing);

        scene.add(mesh);
        planes.push(mesh);
    }
}

// Caméra au départ avant tous les plans
camera.position.z = 5;

let targetZ = 5;
let currentZ = 5;

window.addEventListener("wheel", (e) => {
    targetZ -= e.deltaY * 0.02;
});

let lastTouchY = null;
window.addEventListener("touchstart", (e) => {
    lastTouchY = e.touches[0].clientY;
});
window.addEventListener("touchmove", (e) => {
    if (lastTouchY === null) return;
    const delta = lastTouchY - e.touches[0].clientY;
    targetZ -= delta * 0.05;
    lastTouchY = e.touches[0].clientY;
});

function updatePlanes() {
    planes.forEach((mesh) => {
        // Recyclage infini : replace le plan dans la boucle
        while (mesh.position.z > camera.position.z + spacing * 1.5) {
            mesh.position.z -= totalDepth;
        }
        while (
            mesh.position.z <
            camera.position.z - spacing * (TOTAL_PLANES + 0.5)
        ) {
            mesh.position.z += totalDepth;
        }

        // Fade in / fade out selon la distance à la caméra
        const dist = Math.abs(mesh.position.z - camera.position.z);
        const fadeInStart = 8; // commence à apparaître
        const fadeInEnd = 3; // pleinement visible
        const fadeOutStart = 2; // commence à disparaître en passant devant
        const fadeOutEnd = 0.5; // complètement transparent

        let opacity = 0;

        if (dist > fadeInStart) {
            opacity = 0;
        } else if (dist > fadeInEnd) {
            // Apparition progressive en approchant
            opacity = 1 - (dist - fadeInEnd) / (fadeInStart - fadeInEnd);
        } else if (dist > fadeOutStart) {
            opacity = 1;
        } else {
            // Disparition en passant devant la caméra
            opacity = Math.max(
                0,
                (dist - fadeOutEnd) / (fadeOutStart - fadeOutEnd),
            );
        }

        mesh.material.opacity = THREE.MathUtils.clamp(opacity, 0, 1);
    });
}

function animate() {
    requestAnimationFrame(animate);

    currentZ += (targetZ - currentZ) * 0.06;
    camera.position.z = currentZ;

    if (planes.length > 0) {
        updatePlanes();
    }

    renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function coverTexture(texture, planeAspect, align = "center") {
    const image = texture.image;
    if (!image) return;

    const imageAspect = image.width / image.height;

    if (imageAspect > planeAspect) {
        texture.repeat.set(planeAspect / imageAspect, 1);
        if (align === "center") {
            texture.offset.x = (1 - texture.repeat.x) / 2;
        } else if (align === "right") {
            texture.offset.x = 1 - texture.repeat.x;
        } else {
            texture.offset.x = 0;
        }
        texture.offset.y = 0;
    } else {
        texture.repeat.set(1, imageAspect / planeAspect);
        texture.offset.y = (1 - texture.repeat.y) / 2;
        texture.offset.x = 0;
    }
}
