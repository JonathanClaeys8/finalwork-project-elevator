import {
    gsap
} from "gsap";

import {
    Draggable
} from "gsap/Draggable";

gsap.registerPlugin(Draggable);

// POSITIONS RELATIVES IN %
const RELATIVE_POSITIONS = {
    floorOptionBtn: {
        x: 0.76,
        y: 0.53
    },
    exitElevatorBtn: {
        x: 0.5,
        y: 0.65
    },
    symbolZone: {
        x: 0.4,
        y: 0.52
    }
};

// POSITION IN PIXELS OF SYMBOLS
const SYMBOL_POSITIONS = [{
        x: 25,
        y: 35
    },
    {
        x: 130,
        y: 60
    },
    {
        x: 210,
        y: 40
    },
    {
        x: 50,
        y: 120
    },
    {
        x: 160,
        y: 160
    },
    {
        x: 240,
        y: 130
    }
];

let symbolsOut = 0;
const stageTwoScene = document.getElementById("stage-two-scene");

// UPDATE POSITIONS
function updatePositions() {
    const video = document.getElementById("stage-one-first");
    if (!video || !video.videoWidth) return;

    const floorButton = document.getElementById("floor-option-btn");
    const exitElevatorBtn = document.getElementById("exit-elevator");
    const symbolZone = document.getElementById("symbol-zone");

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
    placeElement(symbolZone, RELATIVE_POSITIONS.symbolZone);
}

// CREATION SYMBOLS
function createSymbols() {
    const zone = document.getElementById("symbol-zone");
    if (!zone) return;

    zone.style.display = "block";

    for (let i = 0; i < 6; i++) {
        const video = document.createElement("video");
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.classList.add("symbol-video");

        const source = document.createElement("source");
        source.src = "/src/assets/images/brain-symbol.webm";
        source.type = "video/webm";
        video.appendChild(source);
        video.style.position = "absolute";
        video.style.left = SYMBOL_POSITIONS[i].x + "px";
        video.style.top = SYMBOL_POSITIONS[i].y + "px";

        zone.appendChild(video);

        // FORCE PLAY
        video.load();
        video.play().catch(err => {
            console.warn("Autoplay blocked for symbol video:", err);
        });

        // DRAGGABLE
        Draggable.create(video, {
            type: "x,y",
            bounds: document.body,
            inertia: true,
            onDragEnd: function () {
                const zoneRect = zone.getBoundingClientRect();
                const rect = this.target.getBoundingClientRect();

                // CHECK OUT OF ZONE
                if (
                    rect.right < zoneRect.left ||
                    rect.left > zoneRect.right ||
                    rect.bottom < zoneRect.top ||
                    rect.top > zoneRect.bottom
                ) {
                    if (!this.target.dataset.out) {
                        this.target.dataset.out = "true";
                        symbolsOut++;

                        gsap.to(this.target, {
                            opacity: 0,
                            scale: 0.3,
                            duration: 0.5,
                            onComplete: () => {
                                this.target.remove();
                            }
                        });

                        // TRIGGER
                        if (symbolsOut >= 6) {
                            gsap.to(stageTwoScene, {
                                opacity: 0,
                                duration: 2,
                                ease: "power2.inOut",
                                onComplete: () => {

                                    setTimeout(() => {
                                        triggerNextStage()
                                    }, 2000);
                                }
                            });

                        }
                    }
                }
            }
        });
    }
}


function triggerNextStage() {
    const closeDoors = document.getElementById("close-doors");

    // CLOSING DOORS
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
            window.location.href = "stagefive.html";
        };
    }
}


// INIT
document.addEventListener("DOMContentLoaded", () => {
    const firstVideo = document.getElementById("stage-one-first");
    const secondVideo = document.getElementById("stage-one-second");
    const floorBtn = document.getElementById("floor-option-btn");
    const exitBtn = document.getElementById("exit-elevator");
    const symbolZone = document.getElementById("symbol-zone");

    if (symbolZone) symbolZone.style.display = "none";

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





    // EXIT ELEVATOR BUTTON
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

                        setTimeout(() => {
                            const zone = document.getElementById("symbol-zone");
                            if (zone) {
                                zone.style.display = "block";
                                updatePositions();
                            }
                            createSymbols();
                        }, 200);
                    }
                });
            }
        });
    });
});