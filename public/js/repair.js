/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/javascript/components/repair.js":
/*!*********************************************!*\
  !*** ./src/javascript/components/repair.js ***!
  \*********************************************/
/***/ (() => {

eval("{ console.log(\"JS-repair.js :\");\r\n\r\n document.addEventListener(\"DOMContentLoaded\", () => {\r\n     const video = document.getElementById(\"main-video\");\r\n     const button = document.getElementById(\"yellow-circle-button\");\r\n\r\n     // BUTTON POSITION\r\n     const RELATIVE_X = 0.65;\r\n     const RELATIVE_Y = 0.55;\r\n\r\n     function updateButtonPosition() {\r\n         const containerAspect = window.innerWidth / window.innerHeight;\r\n         const videoAspect = video.videoWidth / video.videoHeight;\r\n\r\n         let videoWidth, videoHeight, offsetX, offsetY;\r\n\r\n         if (containerAspect > videoAspect) {\r\n             // WIDER\r\n             videoWidth = window.innerWidth;\r\n             videoHeight = window.innerWidth / videoAspect;\r\n             offsetX = 0;\r\n             offsetY = (window.innerHeight - videoHeight) / 2;\r\n         } else {\r\n             // TALLER\r\n             videoHeight = window.innerHeight;\r\n             videoWidth = window.innerHeight * videoAspect;\r\n             offsetY = 0;\r\n             offsetX = (window.innerWidth - videoWidth) / 2;\r\n         }\r\n\r\n         // UPDATE\r\n         const x = offsetX + RELATIVE_X * videoWidth;\r\n         const y = offsetY + RELATIVE_Y * videoHeight;\r\n\r\n         button.style.left = `${x}px`;\r\n         button.style.top = `${y}px`;\r\n     }\r\n\r\n     // LOAD & RESIZE\r\n     window.addEventListener(\"resize\", updateButtonPosition);\r\n     video.addEventListener(\"loadedmetadata\", updateButtonPosition);\r\n     updateButtonPosition();\r\n });\n\n//# sourceURL=webpack:///./src/javascript/components/repair.js?\n}");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/javascript/components/repair.js"]();
/******/ 	
/******/ })()
;