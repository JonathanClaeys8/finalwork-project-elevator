console.log("Stageone.js:");

import {
    gsap
} from "gsap";
import {
    Draggable
} from "gsap/Draggable";
import {
    ScrollTrigger
} from "gsap/ScrollTrigger";

gsap.registerPlugin(Draggable, ScrollTrigger);

// POSITIONS RELATIVES IN % //////////////////////////////////////////
const RELATIVE_POSITIONS = {
    floorOptionBtn: {
        x: 0.76,
        y: 0.53
    },
    exitElevatorBtn: {
        x: 0.5,
        y: 0.65
    },
    scroller: {
        x: 0.542,
        y: 0.607
    }
};

// UPDATE POSITIONS /////////////////////////////////////////
function updatePositions() {
    const video = document.getElementById("stage-one-first");
    const floorButton = document.getElementById("floor-option-btn");
    const exitElevatorBtn = document.getElementById("exit-elevator");
    const scroller = document.getElementById("scroller");

    if (!video || !video.videoWidth) return;

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
        el.style.position = "absolute";
        el.style.zIndex = "1000";
        const x = offsetX + rel.x * videoWidth;
        const y = offsetY + rel.y * videoHeight;
        el.style.left = `${x - el.offsetWidth / 2}px`;
        el.style.top = `${y - el.offsetHeight / 2}px`;
    };

    placeElement(floorButton, RELATIVE_POSITIONS.floorOptionBtn);
    placeElement(exitElevatorBtn, RELATIVE_POSITIONS.exitElevatorBtn);
    placeElement(scroller, RELATIVE_POSITIONS.scroller);
}

// SCROLLER INIT /////////////////////////////////////////////////////
function initScroller() {
    const scroller = document.getElementById("scroller");
    if (!scroller) return;

    const cards = document.querySelectorAll("#scroller .card");

    cards.forEach((card, index) => {
        ScrollTrigger.create({
            trigger: card,
            scroller: scroller,
            start: "top center",
            end: "bottom center",
            onEnter: () => {
                if (index === cards.length - 1) {

                    const closeDoors = document.getElementById("close-doors");

                    if (closeDoors) {
                        gsap.to(scroller, {
                            opacity: 0,
                            duration: 1,
                            ease: "power2.out",
                            onComplete: () => {
                                scroller.style.display = "none";
                            }
                        });
                        // CSS ADJUSTMENTS
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
                            window.location.href = "stagetwo.html";
                        };
                    }
                }
            }
        });
    });

    gsap.fromTo(scroller, {
        opacity: 0,
        scale: 0.8
    }, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.5)"
    });
    updatePositions();
}

// INIT EVENTS ///////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
    const videoEl = document.getElementById("stage-one-first");
    videoEl.addEventListener("loadedmetadata", updatePositions);
    window.addEventListener("resize", updatePositions);
    updatePositions();

    const floorBtn = document.getElementById("floor-option-btn");
    const firstVideo = document.getElementById("stage-one-first");
    const secondVideo = document.getElementById("stage-one-second");
    const exitBtn = document.getElementById("exit-elevator");
    const firstScene = document.getElementById("first-scene");

    // FLOOR ELEVATOR TRIGGER
    floorBtn.addEventListener("click", () => {
        floorBtn.style.display = "none";
        firstVideo.style.display = "none";
        secondVideo.style.display = "block";
        secondVideo.currentTime = 0;
        secondVideo.play();
        secondVideo.onended = () => {
            exitBtn.style.display = "block";
            gsap.fromTo(exitBtn, {
                opacity: 0,
                scale: 0.5
            }, {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "back.out(1.7)"
            });
            updatePositions();
        };
    });

    // EXIT ELEVATOR TRIGGER
    exitBtn.addEventListener("click", () => {
        gsap.to(exitBtn, {
            opacity: 0,
            scale: 0.5,
            duration: 0.5,
            ease: "back.in(1.7)",
            onComplete: () => {

                exitBtn.style.display = "none";

                gsap.fromTo(
                    secondVideo, {
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

                            if (firstScene) {
                                firstScene.style.display = "block";
                                firstScene.style.zIndex = "9999";
                                firstScene.currentTime = 0;
                                firstScene.play();

                                firstScene.onended = () => {
                                    firstScene.style.display = "none";

                                    const secondScene = document.getElementById("second-scene");
                                    if (secondScene) {
                                        secondScene.style.display = "block";
                                        secondScene.style.zIndex = "5000";
                                        secondScene.currentTime = 0;
                                        secondScene.play();

                                        const scroller = document.getElementById("scroller");
                                        scroller.style.display = "block";
                                        scroller.style.opacity = "1";
                                        initScroller();
                                    }
                                };
                            }
                        }
                    }
                );
            }
        });
    });
});