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
renderer.outputColorSpace = THREE.SRGBColorSpace;
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
    "/images/truc.mp4",
    "https://picsum.photos/id/214/200/300",
    "/images/machin.mp4",
];

const planeWidth = 1;
const planeHeight = 1.5;
const planeAspect = planeWidth / planeHeight;

const TOTAL_PLANES = imageSources.length;
const spacing = 2.5;
const totalDepth = TOTAL_PLANES * spacing;

const layouts = [
    { x: 1.0, y: 0.0 },
    { x: -1.0, y: 0.3 },
    { x: 0.2, y: -0.4 },
    { x: -0.5, y: 0.5 },
    { x: 1.5, y: 0.2 },
    { x: -0.8, y: -0.3 },
    { x: 1.2, y: 0.6 },
    { x: -0.3, y: -0.1 },
    { x: 0.5, y: 0.4 },
    { x: -0.8, y: 0.2 },
];

const planes = [];
const textures = [];
let loadedCount = 0;

// ------------------ HELPERS ------------------

function isVideo(src) {
    return /\.(mp4|webm|ogg)$/i.test(src);
}

function coverTexture(texture, planeAspect, align = "center") {
    const image = texture.image;
    if (!image) return;

    const width = image.videoWidth || image.width;
    const height = image.videoHeight || image.height;
    if (!width || !height) return;

    const imageAspect = width / height;

    if (imageAspect > planeAspect) {
        texture.repeat.set(planeAspect / imageAspect, 1);
        texture.offset.x =
            align === "center"
                ? (1 - texture.repeat.x) / 2
                : align === "right"
                  ? 1 - texture.repeat.x
                  : 0;
        texture.offset.y = 0;
    } else {
        texture.repeat.set(1, imageAspect / planeAspect);
        texture.offset.y = (1 - texture.repeat.y) / 2;
        texture.offset.x = 0;
    }
}

// ------------------ LOADER ------------------

imageSources.forEach((src, i) => {
    if (isVideo(src)) {
        // ---- VIDEO ----
        const video = document.createElement("video");
        video.src = src;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.crossOrigin = "anonymous";
        video.setAttribute("webkit-playsinline", "");

        video.addEventListener("canplay", () => {
            const texture = new THREE.VideoTexture(video);
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.isVideoTexture = true;

            coverTexture(texture, planeAspect, "center");

            textures[i] = texture;
            loadedCount++;
            if (loadedCount === imageSources.length) buildPlanes();

            video.play().catch(() => {});
        });

        // Auto-play fallback (mobile)
        video.play().catch(() => {});
    } else {
        // ---- IMAGE ----
        textureLoader.load(src, (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.isVideoTexture = false;

            coverTexture(texture, planeAspect, "center");

            textures[i] = texture;
            loadedCount++;
            if (loadedCount === imageSources.length) buildPlanes();
        });
    }
});

// ------------------ BUILD PLANES ------------------

function buildPlanes() {
    for (let i = 0; i < TOTAL_PLANES; i++) {
        const baseTexture = textures[i % imageSources.length];
        if (!baseTexture) continue;

        const texture =
            baseTexture.isVideoTexture === true
                ? baseTexture
                : baseTexture.clone();

        if (!baseTexture.isVideoTexture) {
            texture.needsUpdate = true;
            coverTexture(texture, planeAspect, "center");
        }

        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0,
        });

        const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
        const mesh = new THREE.Mesh(geometry, material);

        const layout = layouts[i % layouts.length];
        mesh.position.set(layout.x, layout.y, -(i + 1) * spacing);

        scene.add(mesh);
        planes.push(mesh);
    }
}

// ------------------ CAMERA & SCROLL ------------------

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

// ------------------ UPDATE PLANES ------------------

function updatePlanes() {
    planes.forEach((mesh) => {
        while (mesh.position.z > camera.position.z + spacing * 1.5) {
            mesh.position.z -= totalDepth;
        }
        while (
            mesh.position.z <
            camera.position.z - spacing * (TOTAL_PLANES + 0.5)
        ) {
            mesh.position.z += totalDepth;
        }

        const dist = Math.abs(mesh.position.z - camera.position.z);
        const fadeInStart = 10,
            fadeInEnd = 3,
            fadeOutStart = 1,
            fadeOutEnd = 0.1;

        let opacity = 0;
        if (dist > fadeInStart) opacity = 0;
        else if (dist > fadeInEnd)
            opacity = 1 - (dist - fadeInEnd) / (fadeInStart - fadeInEnd);
        else if (dist > fadeOutStart) opacity = 1;
        else
            opacity = Math.max(
                0,
                (dist - fadeOutEnd) / (fadeOutStart - fadeOutEnd),
            );

        mesh.material.opacity = THREE.MathUtils.clamp(opacity, 0, 1);
    });
}

// ------------------ ANIMATION LOOP ------------------

function animate() {
    requestAnimationFrame(animate);

    currentZ += (targetZ - currentZ) * 0.06;
    camera.position.z = currentZ;

    if (planes.length > 0) updatePlanes();

    renderer.render(scene, camera);
}
animate();

// ------------------ RESIZE ------------------

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
