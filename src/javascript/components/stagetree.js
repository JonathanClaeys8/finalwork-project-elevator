import {
    gsap
} from "gsap";

// POSITIONS RELATIVES IN %
const RELATIVE_POSITIONS = {
    floorOptionBtn: {
        x: 0.76,
        y: 0.53
    },
    exitElevatorBtn: {
        x: 0.5,
        y: 0.65
    }
};

// UPDATE POSITIONS
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
        el.style.left = `${x - el.offsetWidth / 2}px`;
        el.style.top = `${y - el.offsetHeight / 2}px`;
    };

    placeElement(floorButton, RELATIVE_POSITIONS.floorOptionBtn);
    placeElement(exitElevatorBtn, RELATIVE_POSITIONS.exitElevatorBtn);
}

// NEXT STAGE
function triggerNextStage() {
    console.log("closing")
    const closeDoors = document.getElementById("close-doors");

    // REMOVE POPUPS
    gsap.to(".popup-img", {
        opacity: 0,
        scale: 0,
        duration: 0.5,
        stagger: 0.05,
        onComplete: () => {
            document.querySelectorAll(".popup-img").forEach(img => img.remove());
        }
    });

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
            window.location.href = "stagefour.html";
        };
    }
}

// RANDOM POSITION
let clickCount = 0;
const popupContainer = document.getElementById("popup-container");

function getRandomPosition(imgWidth = 80, imgHeight = 80) {
    const x = Math.random() * (window.innerWidth - imgWidth);
    const y = Math.random() * (window.innerHeight - imgHeight);
    return {
        x,
        y
    };
}

// CREATE POPUP
function createPopup(delay = 0) {
    const img = document.createElement("img");
    img.src = "/src/assets/images/Scene_03_Popup.png";
    img.classList.add("popup-img");

    const {
        x,
        y
    } = getRandomPosition();

    img.style.left = `${x}px`;
    img.style.top = `${y}px`;

    popupContainer.appendChild(img);

    gsap.fromTo(img, {
        opacity: 0,
        scale: 0
    }, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        delay,
        ease: "back.out(1.7)"
    });

    img.addEventListener("click", () => {
        clickCount++;
        img.remove();
        if (clickCount >= 8) {
            console.log("clicks!");
            triggerNextStage();
        } else {
            createPopup();
            createPopup();
        }
    });
}




// INIT
document.addEventListener("DOMContentLoaded", () => {
    const firstVideo = document.getElementById("stage-one-first");
    const secondVideo = document.getElementById("stage-one-second");
    const floorBtn = document.getElementById("floor-option-btn");
    const exitBtn = document.getElementById("exit-elevator");
    const stageTwoScene = document.getElementById("stage-two-scene");

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

                        let sceneStarted = false;

                        const checkStart = () => {
                            if (sceneStarted) {
                                updatePositions();
                                setTimeout(() => createPopup(0), 2000);
                            }
                        };

                        stageTwoScene.onplay = () => {
                            sceneStarted = true;
                            checkStart();
                        };
                    }
                });
            }
        });
    });
});