 console.log("JS-repair.js :");

 document.addEventListener("DOMContentLoaded", () => {
     const video = document.getElementById("main-video");
     const button = document.getElementById("yellow-circle-button");

     // BUTTON POSITION
     const RELATIVE_X = 0.65;
     const RELATIVE_Y = 0.55;

     function updateButtonPosition() {
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

         // UPDATE
         const x = offsetX + RELATIVE_X * videoWidth;
         const y = offsetY + RELATIVE_Y * videoHeight;

         button.style.left = `${x}px`;
         button.style.top = `${y}px`;
     }

     // LOAD & RESIZE
     window.addEventListener("resize", updateButtonPosition);
     video.addEventListener("loadedmetadata", updateButtonPosition);
     updateButtonPosition();
 });