console.log("Repair.js:");

import {
    gsap
} from "gsap";
import {
    Draggable
} from "gsap/Draggable";

gsap.registerPlugin(Draggable);

// INITIAL ELEMENT POSITIONS IN % //////////////////////////////////////////////////////////////////////////////////////////
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
    },
    completionFirstTask: {
        x: 0.492,
        y: 0.55
    },
    zonePanel: {
        x: 0.365,
        y: 0.560
    },
    panelWrapper: {
        x: 0.395,
        y: 0.385
    },
    completionRepair: {
        x: 0.519,
        y: 0.8,
    },
};



// RESPONSIF //////////////////////////////////////////////////////////////////////////////////////////
function updatePositions() {
    const video = document.getElementById("main-video");
    const imageA = document.getElementById("image-a");
    const imageB = document.getElementById("image-b");
    const zoneA = document.getElementById("zone-a");
    const zoneB = document.getElementById("zone-b");
    const completionFirstTask = document.getElementById("completion-first-task");
    const zonePanel = document.getElementById("zone-click");
    const panelWrapper = document.getElementById("panel-wrapper");
    const completionRepair = document.getElementById("completion-repair");

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
        const x = offsetX + rel.x * videoWidth;
        const y = offsetY + rel.y * videoHeight;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
    };

    placeElement(imageA, RELATIVE_POSITIONS.imageA);
    placeElement(imageB, RELATIVE_POSITIONS.imageB);
    placeElement(zoneA, RELATIVE_POSITIONS.zoneA);
    placeElement(zoneB, RELATIVE_POSITIONS.zoneB);
    placeElement(completionFirstTask, RELATIVE_POSITIONS.completionFirstTask);
    placeElement(zonePanel, RELATIVE_POSITIONS.zonePanel);
    if (panelWrapper) placeElement(panelWrapper, RELATIVE_POSITIONS.panelWrapper);
    placeElement(completionRepair, RELATIVE_POSITIONS.completionRepair);
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




document.addEventListener("DOMContentLoaded", () => {

    // POP-UP //////////////////////////////////////////////////////////////////////////////////////////
    setTimeout(() => {
        const popup = document.getElementById("completion-task");
        popup.style.display = "flex";
        const overlay = popup.querySelector(".completion-overlay");

        gsap.fromTo(
            overlay, {
                opacity: 0,
                scale: 0.4
            }, {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                ease: "power3.out"
            }
        );
    }, 1000);



    // DISAPEAR BUTTON //////////////////////////////////////////////////////////////////////////////////////////
    const taskPopup = document.getElementById("completion-task");
    const proceedBtn = taskPopup.querySelector("#proceed-button-task");
    const overlay = taskPopup.querySelector(".completion-overlay");

    proceedBtn.addEventListener("click", () => {
        gsap.to(overlay, {
            opacity: 0,
            scale: 0.4,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => {
                taskPopup.style.display = "none";
            }
        });
    });



    // TASK COMPLEET ////////////////////////////////////////////////////////////////////////////////////////// 
    function checkIfBothCorrect() {
        if (status.imageA && status.imageB) {
            const screen = document.getElementById("completion-first-task");
            const overlay = screen.querySelector(".completion-overlay");
            const topImage = document.getElementById("top-image-first-task");

            screen.style.display = "flex";

            gsap.fromTo(
                [overlay, topImage], {
                    opacity: 0,
                    scale: 0.4
                }, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.6,
                    ease: "power3.out"
                }
            );



            // BUTTON PROCEED //////////////////////////////////////////////////////////////////////////////////////////
            const nextBtn = document.getElementById("proceed-button-first-task");

            nextBtn.addEventListener("click", () => {
                const mainVideo = document.getElementById("main-video");
                mainVideo.src = "/src/assets/images/reapair_elevator_light_02.webm";
                mainVideo.load();
                mainVideo.play();

                document.getElementById("image-a").style.display = "none";
                document.getElementById("image-b").style.display = "none";

                gsap.to([overlay, topImage], {
                    opacity: 0,
                    scale: 0.4,
                    duration: 0.5,
                    ease: "power2.in",
                    onComplete: () => {
                        screen.style.display = "none";

                        const zoneClick = document.getElementById("zone-click");
                        zoneClick.style.display = "block";
                    }
                });
            }, {
                once: true
            });

        }
    }



    // DRAGABLE BUTTTONS //////////////////////////////////////////////////////////////////////////////////////////
    const zoneA = document.getElementById("zone-a");
    const zoneB = document.getElementById("zone-b");

    const status = {
        imageA: false,
        imageB: false
    };

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

    // PANEL PUZZLE //////////////////////////////////////////////////////////////////////////////////////////
    function initPuzzle() {
        const svg = document.getElementById("cable-layer");
        const colors = ["yellow", "red", "blue"];
        const connected = {
            yellow: false,
            red: false,
            blue: false
        };

        colors.forEach(color => {
            const socket = document.getElementById(`socket-${color}`);
            const anchor = document.getElementById(`anchor-${color}`);
            const cable = document.getElementById(`cable-${color}`);
            let isDragging = false;
            let x1, y1;

            anchor.addEventListener("mousedown", (e) => {
                const svgRect = svg.getBoundingClientRect();
                const anchorRect = anchor.getBoundingClientRect();

                x1 = anchorRect.left + anchorRect.width / 2 - svgRect.left;
                y1 = anchorRect.top + anchorRect.height / 2 - svgRect.top;

                cable.setAttribute("x1", x1);
                cable.setAttribute("y1", y1);
                cable.setAttribute("x2", x1);
                cable.setAttribute("y2", y1);
                cable.setAttribute("visibility", "visible");

                isDragging = true;
            });

            document.addEventListener("mousemove", (e) => {
                if (!isDragging) return;

                const svgRect = svg.getBoundingClientRect();
                const x2 = e.clientX - svgRect.left;
                const y2 = e.clientY - svgRect.top;

                cable.setAttribute("x2", x2);
                cable.setAttribute("y2", y2);
            });

            document.addEventListener("mouseup", (e) => {
                if (!isDragging) return;
                isDragging = false;

                const svgRect = svg.getBoundingClientRect();
                const socketRect = socket.getBoundingClientRect();

                const sx = socketRect.left + socketRect.width / 2 - svgRect.left;
                const sy = socketRect.top + socketRect.height / 2 - svgRect.top;

                const dx = e.clientX - socketRect.left - socketRect.width / 2;
                const dy = e.clientY - socketRect.top - socketRect.height / 2;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 50) {
                    gsap.to(cable, {
                        attr: {
                            x2: sx,
                            y2: sy
                        },
                        duration: 0.3,
                        ease: "power2.out"
                    });
                    connected[color] = true;

                    // CONNECTED CABLE TRIGGER
                    if (Object.values(connected).every(val => val)) {
                        setTimeout(() => {
                            const transitionVideo = document.getElementById("transition-video");
                            const mainVideo = document.getElementById("main-video");

                            // Show and play transition video
                            transitionVideo.style.display = "block";
                            transitionVideo.currentTime = 0;
                            transitionVideo.loop = false;
                            transitionVideo.play();

                            // Hide the panel
                            const panel = document.getElementById("completion-second-task");
                            gsap.to(panel, {
                                opacity: 0,
                                scale: 0.4,
                                duration: 0.5,
                                ease: "power2.in",
                                onComplete: () => {
                                    panel.style.display = "none";
                                }
                            });

                            transitionVideo.onended = () => {
                                transitionVideo.style.display = "none";
                                mainVideo.src = "/src/assets/images/repair_elevator_light_03.webm";
                                mainVideo.load();
                                mainVideo.play();

                                setTimeout(() => {
                                    const completionRepair = document.getElementById("completion-repair");
                                    if (completionRepair) {
                                        completionRepair.style.display = "flex";
                                        gsap.fromTo(completionRepair, {
                                            opacity: 0,
                                            scale: 0.4
                                        }, {
                                            opacity: 1,
                                            scale: 1,
                                            duration: 0.6,
                                            ease: "power3.out"
                                        });
                                    }
                                }, 1000);
                            };
                        }, 300);
                    }
                } else {
                    gsap.to(cable, {
                        attr: {
                            x2: x1,
                            y2: y1
                        },
                        duration: 0.2,
                        ease: "power2.inOut",
                        onComplete: () => {
                            cable.setAttribute("visibility", "hidden");
                        }
                    });
                    connected[color] = false;
                }
            });
        });
    }



    // PANEL TRIGGER //////////////////////////////////////////////////////////////////////////////////////////
    const zonePanel = document.getElementById("zone-click");
    if (zonePanel) {
        zonePanel.addEventListener("click", () => {
            console.log("Zone clicked");
            zonePanel.style.display = "none";
            const secondTask = document.getElementById("completion-second-task");
            secondTask.style.display = "flex";

            const panelWrapper = document.getElementById("panel-wrapper");
            if (panelWrapper) {
                gsap.fromTo(panelWrapper, {
                    opacity: 0,
                    scale: 0.4
                }, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.6,
                    ease: "power3.out"
                });
            }

            initPuzzle();
        });
    }



    // ENTER ELEVATOR TRIGGER //////////////////////////////////////////////////////////////////////////////////////////
    const elevatorButton = document.getElementById("enter-elevator");
    elevatorButton.addEventListener("click", () => {

          gsap.to(elevatorButton, {
        opacity: 0,
        duration: 1,
        onComplete: () => {
            elevatorButton.style.display = "none";
        }
    });
        const animationContainer = document.getElementById("elevator-animation");
        const elevatorVideo = document.getElementById("elevator-video");
        animationContainer.style.display = "block";
        elevatorVideo.currentTime = 0;
        elevatorVideo.play();

        // REDERECT STAGEONE PAGE
        elevatorVideo.onended = () => {
            window.location.href = "stageone.html";
        };
    });


    // UPDATE
    const video = document.getElementById("main-video");
    video.addEventListener("loadedmetadata", updatePositions);
    window.addEventListener("resize", updatePositions);
    updatePositions();
});