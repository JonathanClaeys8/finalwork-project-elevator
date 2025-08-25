// Imports
import {
    gsap
} from "gsap";

import {
    ScrollTrigger
} from "gsap/ScrollTrigger";


// Smooth Scroll Button
document.getElementById("scrollDown").addEventListener("click", () => {
    window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth"
    });
});

gsap.registerPlugin(ScrollTrigger);
document.querySelectorAll(".section").forEach((section, i) => {
    const text = section.querySelector(".section-text");
    const img = section.querySelector("img");
    gsap.from(text, {
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse",
        },
        x: -100,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
    });
    gsap.from(img, {
        scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none reverse",
        },
        x: 100,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        delay: 0.2,
    });
});

gsap.from(".intro-text h1", {
    scrollTrigger: {
        trigger: ".intro-text",
        start: "top 90%",
        toggleActions: "play none none reverse",
    },
    y: 50,
    opacity: 0,
    duration: 1.2,
    ease: "power2.out",
});