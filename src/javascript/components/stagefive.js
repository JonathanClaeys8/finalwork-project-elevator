// Imports
import {
    gsap
} from "gsap";

// Initial Elements Positions (In %)
const RELATIVE_POSITIONS = {
    floorOptionBtn: {
        x: 0.76,
        y: 0.53
    },
    exitElevatorBtn: {
        x: 0.5,
        y: 0.65
    },
};

const stageTwoScene = document.getElementById("stage-two-scene");
const sceneFiveBackground = document.getElementById("scenefive-background");

let progress = 0;
let progressInterval = null;


// Update positions
function updatePositions() {
    const video = document.getElementById("stage-one-first");
    if (!video || !video.videoWidth) return;
    const floorButton = document.getElementById("floor-option-btn");
    const exitElevatorBtn = document.getElementById("exit-elevator");
    const containerAspect = window.innerWidth / window.innerHeight;
    const videoAspect = video.videoWidth / video.videoHeight;
    let videoWidth, videoHeight, offsetX, offsetY;

    if (containerAspect > videoAspect) {
        videoWidth = window.innerWidth;
        videoHeight = window.innerWidth / videoAspect;
        offsetX = 0;
        offsetY = (window.innerHeight - videoHeight) / 2;
    } else {
        videoHeight = window.innerHeight;
        videoWidth = window.innerHeight * videoAspect;
        offsetY = 0;
        offsetX = (window.innerWidth - videoWidth) / 2;
    }

    const placeElement = (el, rel) => {
        if (!el) return;
        const x = offsetX + rel.x * videoWidth;
        const y = offsetY + rel.y * videoHeight;
        el.style.position = "absolute";
        el.style.left = `${x - el.offsetWidth / 2}px`;
        el.style.top = `${y - el.offsetHeight / 2}px`;
    };

    placeElement(floorButton, RELATIVE_POSITIONS.floorOptionBtn);
    placeElement(exitElevatorBtn, RELATIVE_POSITIONS.exitElevatorBtn);
}



function triggerNextStage() {
    const closeDoors = document.getElementById("close-doors");
    if (closeDoors) {
        closeDoors.style.display = "block";
        closeDoors.style.position = "fixed";
        closeDoors.style.top = "0";
        closeDoors.style.left = "0";
        closeDoors.style.width = "100%";
        closeDoors.style.height = "100%";
        closeDoors.style.objectFit = "cover";
        closeDoors.style.zIndex = "10000";
        closeDoors.currentTime = 0;
        closeDoors.play();
        closeDoors.onended = () => {
            window.location.href = "end.html";
        };
    }
}

// Bar Progression
function startProgression() {
    const container = document.getElementById("progress-container");
    const fillEl = document.getElementById("progress-fill");
    container.style.display = "block";
    progress = 0;
    fillEl.style.width = "0%";

    // Lose Points
    if (progressInterval) clearInterval(progressInterval);
    progressInterval = setInterval(() => {
        progress = Math.max(0, progress - 10);
        updateProgressUI(fillEl);
    }, 1000);

    // Add Points
    document.body.addEventListener("click", () => {
        progress = Math.min(100, progress + 5);
        updateProgressUI(fillEl);
        if (progress >= 100) {
            clearInterval(progressInterval);
            gsap.to(container, {
                opacity: 0,
                duration: 1,
                onComplete: () => {
                    container.style.display = "none";
                    triggerNextStage();
                }
            });

        }
    });
}

function updateProgressUI(fillEl) {
    fillEl.style.width = `${progress}%`;
}

document.addEventListener("DOMContentLoaded", () => {
    const firstVideo = document.getElementById("stage-one-first");
    const secondVideo = document.getElementById("stage-one-second");
    const floorBtn = document.getElementById("floor-option-btn");
    const exitBtn = document.getElementById("exit-elevator");
    firstVideo.addEventListener("loadedmetadata", updatePositions);
    window.addEventListener("resize", updatePositions);
    updatePositions();

    floorBtn.addEventListener("click", () => {
        floorBtn.style.display = "none";
        firstVideo.style.display = "none";
        secondVideo.style.display = "block";
        secondVideo.currentTime = 0;
        secondVideo.play();

        secondVideo.onended = () => {
            exitBtn.style.display = "block";
            updatePositions();
            gsap.fromTo(exitBtn, {
                opacity: 0,
                scale: 0.5
            }, {
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: "back.out(1.7)"
            });
        };
    });



    // Exit Elevator Button
    exitBtn.addEventListener("click", () => {
        gsap.to(exitBtn, {
            opacity: 0,
            scale: 0.5,
            duration: 0.5,
            ease: "back.in(1.7)",
            onComplete: () => {
                exitBtn.style.display = "none";
                gsap.fromTo(secondVideo, {
                    scale: 1,
                    opacity: 1,
                    transformOrigin: "center center"
                }, {
                    scale: 1.2,
                    opacity: 0,
                    duration: 1.5,
                    ease: "power2.inOut",
                    onComplete: () => {
                        firstVideo.style.display = "none";
                        secondVideo.style.display = "none";
                        stageTwoScene.style.display = "block";
                        stageTwoScene.currentTime = 0;
                        stageTwoScene.play();
                        
                        stageTwoScene.addEventListener("loadedmetadata", () => {
                            updatePositions();
                        });
                        stageTwoScene.onended = () => {
                            stageTwoScene.style.display = "none";
                            sceneFiveBackground.style.display = "block";
                            sceneFiveBackground.play();
                            startProgression();
                        };
                    }
                });
            }
        });
    });
});