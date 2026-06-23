const frameofgame = document.getElementById("gameframe");
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
var mobile = false;
var phase = -1;

if (/Android|Mobi|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/.test(navigator.userAgent)) {
    canvas.width = "256";
    canvas.height = "384"; 
    mobile = true;
} else {
    canvas.width = "256";
    canvas.height = "256"; 
    mobile = false;
}

const asset = {
    mobile: new Image(),
    start1: new Image(),
    //start2: new Image(),
};
var loadTracker = Object.keys(asset).length * -1;
asset.mobile.onload = function() {loadTracker += 1;}
asset.start1.onload = function() {loadTracker += 1;}
//asset.somethin.onload = function() {loadTracker += 1;}
asset.mobile.src = "./Assets/mobilecontroller.png"
asset.start1.src = "./Assets/naturastartscreen.png"

function draw() {
    requestAnimationFrame(draw);
    if (phase === -1) {
        console.log("help im still loading :O");
        if (loadTracker === 0) {
            phase = 0
        }
    } else if (phase === 0) {
        console.log("yay we loaded!!!")
        ctx.drawImage(asset.start1, 0, 0);
        if (mobile) {
            ctx.drawImage(asset.mobile, 0, 256)
        }
    }
}
draw();