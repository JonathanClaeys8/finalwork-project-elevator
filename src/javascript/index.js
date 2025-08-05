import { gsap } from "gsap";



//BORED BUTTON
document.getElementById("bored-btn").addEventListener("click", () => {
    const bgImage = document.getElementById("bg-image-home");
    const bgVideo = document.getElementById("bg-video-home");
    //ANIMATION TRIGER
    bgVideo.classList.add("active");
    bgVideo.play();
    bgImage.classList.add("fade-out");

    //ANIMATION BUTTON
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

    //NEXT PAGE
    setTimeout(() => {
        window.location.href = "/public/pages/repair.html";
    }, 6000);
});