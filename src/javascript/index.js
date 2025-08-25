// Imports
import {
    gsap
} from "gsap";

// Bored Button
document.getElementById("bored-btn").addEventListener("click", () => {
    const bgImage = document.getElementById("bg-image-home");
    const bgVideo = document.getElementById("bg-video-home");
    bgVideo.classList.add("active");
    bgVideo.play();
    bgImage.classList.add("fade-out");
    gsap.to(["#bored-btn", ".quote-home"], {
        duration: 1,
        opacity: 0,
        y: 50,
        ease: "power2.out",
        onComplete: () => {
            document.getElementById("bored-btn").style.display = "none";
            document.getElementById("quote-home").style.display = "none";
        }
    });

    // Next Page Trigger
    setTimeout(() => {
        window.location.href = "/public/pages/repair.html";
    }, 6000);
});

// Audio
const volumeBtn = document.getElementById("volume-btn");
let isMuted = false;
volumeBtn.addEventListener("click", () => {
    isMuted = !isMuted;
    const audios = document.querySelectorAll("audio, video");
    audios.forEach(el => {
        el.muted = isMuted;
    });

    if (isMuted) {
        volumeBtn.src = "../src/assets/images/icons/sound-icon-muted.png";
    } else {
        volumeBtn.src = "../src/assets/images/icons/sound-icon.png";
    }
});

// Volume Slider
const slider = document.getElementById("volume-slider");
slider.addEventListener("input", () => {
    const audios = document.querySelectorAll("audio, video");
    audios.forEach(el => {
        el.volume = slider.value;
    });
});