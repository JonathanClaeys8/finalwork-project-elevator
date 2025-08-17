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
    gameTimer: {
        x: 0.755,
        y: 0.115
    },
    clickZone: {
        x: 0.36,
        y: 0.52
    }
};

// UPDATE POSITIONS
function updatePositions() {
    const video = document.getElementById("stage-one-first");
    if (!video || !video.videoWidth) return;

    const floorButton = document.getElementById("floor-option-btn");
    const exitElevatorBtn = document.getElementById("exit-elevator");
    const gameTimer = document.getElementById("game-timer");
    const clickZone = document.getElementById("click-zone");

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
        el.style.left = `${x - el.offsetWidth / 2}px`;
        el.style.top = `${y - el.offsetHeight / 2}px`;
    };

    placeElement(floorButton, RELATIVE_POSITIONS.floorOptionBtn);
    placeElement(exitElevatorBtn, RELATIVE_POSITIONS.exitElevatorBtn);
    placeElement(gameTimer, RELATIVE_POSITIONS.gameTimer);
    placeElement(clickZone, RELATIVE_POSITIONS.clickZone);
}







// TIMER
function formatTime(minutes, seconds) {
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

document.addEventListener("DOMContentLoaded", () => {
    const firstVideo = document.getElementById("stage-one-first");
    const secondVideo = document.getElementById("stage-one-second");
    const floorBtn = document.getElementById("floor-option-btn");
    const exitBtn = document.getElementById("exit-elevator");
    const stageTwoScene = document.getElementById("stage-two-scene");
    const handAnimation = document.getElementById("hand-animation");
    const timerEl = document.getElementById("game-timer");
    const clickZone = document.getElementById("click-zone");

    let minutes = 7;
    let seconds = 0;
    let clickCount = 0;
    let clickCooldown = false;
    let inactivityTimer;

    firstVideo.addEventListener("loadedmetadata", updatePositions);
    window.addEventListener("resize", updatePositions);
    updatePositions();

    function updateTimerDisplay() {
        timerEl.textContent = formatTime(minutes, seconds);
    }

    function addTenSeconds() {
        seconds += 10;
        if (seconds >= 60) {
            minutes += Math.floor(seconds / 60);
            seconds %= 60;
        }
        updateTimerDisplay();
        checkNextStageByTimer();
    }

    function startInactivityTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            addTenSeconds();
            startInactivityTimer();
        }, 6000);
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
                window.location.href = "stagetree.html";
            };
        }
    }

    function checkNextStageByTimer() {
        if (minutes >= 8 || clickCount >= 6) {
            triggerNextStage();
        }
    }

    clickZone.addEventListener("click", () => {
        if (clickCooldown) return;
        clickCount++;
        clickCooldown = true;
        setTimeout(() => clickCooldown = false, 2000);

        startInactivityTimer();

        handAnimation.loop = false;
        handAnimation.currentTime = 0;
        handAnimation.play();

        checkNextStageByTimer();
    });

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


    //INIT NEW STAGE BUTTON
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

                        handAnimation.style.display = "block";
                        handAnimation.currentTime = 0;
                        handAnimation.play();

                        let sceneStarted = false;
                        let handStarted = false;

                        const checkStart = () => {
                            if (sceneStarted && handStarted) {
                                timerEl.style.display = "block";
                                clickZone.style.display = "block";
                                updateTimerDisplay();
                                updatePositions();
                                startInactivityTimer();
                            }
                        };

                        stageTwoScene.onplay = () => {
                            sceneStarted = true;
                            checkStart();
                        };
                        handAnimation.onplay = () => {
                            handStarted = true;
                            checkStart();
                        };
                    }
                });
            }
        });
    });

    updateTimerDisplay();
});