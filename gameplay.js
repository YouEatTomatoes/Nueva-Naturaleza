const frameofgame = document.getElementById("gameframe");
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
var mobile = false;

function resizeTheGame() {
    if (/Android|Mobi|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/.test(navigator.userAgent)) {
        canvas.width = "400";
        canvas.height = "600"; 
        mobile = true;
    } else {
        canvas.width = "400";
        canvas.height = "400"; 
        mobile = false;
        if (window.innerWidth > window.innerHeight) {
            console.log("ITS TOO BIG!!");
            //frameofgame.style.maxWidth = "${window.innerHeight}px";
            //frameofgame.style.width = "auto";
        }
    }
    ctx.fillStyle = "blue";
    ctx.fillRect(100, 100, 200, 200);
}
resizeTheGame();
window.addEventListener("resize", resizeTheGame);

