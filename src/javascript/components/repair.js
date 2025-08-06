console.log("Repair.js:");

import {
    gsap
} from "gsap";
import {
    Draggable
} from "gsap/Draggable";

gsap.registerPlugin(Draggable);

// INITIAL POSITIONS IN %
const RELATIVE_POSITIONS = {
    imageA: {
        x: 0.2,
        y: 0.75
    },
    imageB: {
        x: 0.8,
        y: 0.86
    },
    zoneA: {
        x: 0.662,
        y: 0.563
    },
    zoneB: {
        x: 0.662,
        y: 0.605
    }
};



// RESPONSIF
function updatePositions() {

    const video = document.getElementById("main-video");
    const imageA = document.getElementById("image-a");
    const imageB = document.getElementById("image-b");
    const zoneA = document.getElementById("zone-a");
    const zoneB = document.getElementById("zone-b");

    if (!video || !video.videoWidth) return;

    const containerAspect = window.innerWidth / window.innerHeight;
    const videoAspect = video.videoWidth / video.videoHeight;
    let videoWidth, videoHeight, offsetX, offsetY;

    if (containerAspect > videoAspect) {
        // WIDER
        videoWidth = window.innerWidth;
        videoHeight = window.innerWidth / videoAspect;
        offsetX = 0;
        offsetY = (window.innerHeight - videoHeight) / 2;
    } else {
        // TALLER
        videoHeight = window.innerHeight;
        videoWidth = window.innerHeight * videoAspect;
        offsetY = 0;
        offsetX = (window.innerWidth - videoWidth) / 2;
    }

    const placeElement = (el, rel) => {
        const x = offsetX + rel.x * videoWidth;
        const y = offsetY + rel.y * videoHeight;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
    };

    placeElement(imageA, RELATIVE_POSITIONS.imageA);
    placeElement(imageB, RELATIVE_POSITIONS.imageB);
    placeElement(zoneA, RELATIVE_POSITIONS.zoneA);
    placeElement(zoneB, RELATIVE_POSITIONS.zoneB);
}

// CHEK IMAGE CENTER
function isCenterInside(imgRect, zoneRect) {
    const centerX = imgRect.left + imgRect.width / 2;
    const centerY = imgRect.top + imgRect.height / 2;

    return (
        centerX >= zoneRect.left &&
        centerX <= zoneRect.right &&
        centerY >= zoneRect.top &&
        centerY <= zoneRect.bottom
    );
}

// DOM READY
document.addEventListener("DOMContentLoaded", () => {
    const zoneA = document.getElementById("zone-a");
    const zoneB = document.getElementById("zone-b");

    const status = {
        imageA: false,
        imageB: false,
    };



    // TASK COMPLEET 
    function checkIfBothCorrect() {
        if (status.imageA && status.imageB) {
            console.log("First task compleet");

            const mainVideo = document.getElementById("main-video");
            mainVideo.src = "/src/assets/images/reapair_elevator_light_02.webm";
            mainVideo.load();
            mainVideo.play();

            document.getElementById("image-a").style.display = "none";
            document.getElementById("image-b").style.display = "none";
        }
    }





    // DRAGABLE BUTTTONS
    Draggable.create("#image-a", {
        bounds: "#background-container",
        onDragEnd: function () {
            const img = this.target;
            const imgRect = img.getBoundingClientRect();
            const zoneRect = zoneA.getBoundingClientRect();

            const isInside = isCenterInside(imgRect, zoneRect);

            if (isInside) {
                status.imageA = true;

                const centerX = zoneRect.left + zoneRect.width / 2;
                const centerY = zoneRect.top + zoneRect.height / 2;

                const offsetX = centerX - imgRect.width / 2;
                const offsetY = centerY - imgRect.height / 2;

                gsap.to(img, {
                    x: offsetX - imgRect.left + this.x,
                    y: offsetY - imgRect.top + this.y,
                    duration: 0.8,
                    ease: "power2.out"
                });

            } else {
                status.imageA = false;
            }
            checkIfBothCorrect();
        }
    });


    Draggable.create("#image-b", {
        bounds: "#background-container",
        onDragEnd: function () {
            const img = this.target;
            const imgRect = img.getBoundingClientRect();
            const zoneRect = zoneB.getBoundingClientRect();

            const isInside = isCenterInside(imgRect, zoneRect);

            if (isInside) {
                status.imageB = true;
                const centerX = zoneRect.left + zoneRect.width / 2;
                const centerY = zoneRect.top + zoneRect.height / 2;
                const offsetX = centerX - imgRect.width / 2;
                const offsetY = centerY - imgRect.height / 2;

                gsap.to(img, {
                    x: offsetX - imgRect.left + this.x,
                    y: offsetY - imgRect.top + this.y,
                    duration: 0.8,
                    ease: "power2.out"
                });

            } else {
                status.imageB = false;
            }
            checkIfBothCorrect();
        }
    });

    // UPDATE
    const video = document.getElementById("main-video");
    video.addEventListener("loadedmetadata", updatePositions);
    window.addEventListener("resize", updatePositions);
    updatePositions();
});