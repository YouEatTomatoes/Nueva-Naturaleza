const frameofgame = document.getElementById("gameframe");
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
var mobile = false;

if (/Android|Mobi|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/.test(navigator.userAgent)) {
    canvas.width = "400";
    canvas.height = "600"; 
    mobile = true;
} else {
    canvas.width = "400";
    canvas.height = "400"; 
    mobile = false;
}
ctx.fillStyle = "gray";
ctx.fillRect(0, 0, 400, 400);
ctx.fillStyle = "blue";
ctx.fillRect(100, 100, 200, 200);
if (mobile) {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 400, 400, 200)
}
