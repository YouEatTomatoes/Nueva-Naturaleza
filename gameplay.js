//declaring variables
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
var mobile = false;
var phase = -1;
var animPhase = 0;
var progress = 0;
//var animProgress = 0;
var progressBench = 0;
var tBench = 0;
var select = 0;
var keyState = {
    up: false,
    down: false,
    left: false,
    right: false,
    action: false,
    menu: false,
    space: false,
};
const frameGap = 30;
const textBounce = 1;
var player = {
    x: 128,
    y: 128,
    dx: 0,
    dy: 0,
    speed: 2,
    bench: 0,
}


//initialize canvas based on device
if (/Android|Mobi|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/.test(navigator.userAgent)) {
    canvas.width = "256";
    canvas.height = "384"; 
    mobile = true;
} else {
    canvas.width = "256";
    canvas.height = "256"; 
    mobile = false;
}
//stop weird mobile vibrations
canvas.addEventListener('contextmenu', (event) => {
  event.preventDefault();
});


//initialize, load, and store images
const asset = {
    mobile: new Image(),
    mobileLeft: new Image(),
    mobileUp: new Image(),
    mobileRight: new Image(),
    mobileDown: new Image(),
    mobileSpace: new Image(),
    mobileX: new Image(),
    mobileO: new Image(),
    start1: new Image(),
    start2: new Image(),
    character: new Image(),
    testenv: new Image(),
};
var loadTracker = (Object.keys(asset).length + 2) * -1;
asset.mobile.onload = function() {loadTracker += 1;};
asset.mobileLeft.onload = function() {loadTracker += 1;};
asset.mobileUp.onload = function() {loadTracker += 1;};
asset.mobileRight.onload = function() {loadTracker += 1;};
asset.mobileDown.onload = function() {loadTracker += 1;};
asset.mobileSpace.onload = function() {loadTracker += 1;};
asset.mobileX.onload = function() {loadTracker += 1;};
asset.mobileO.onload = function() {loadTracker += 1;};
asset.start1.onload = function() {loadTracker += 1;};
asset.start2.onload = function() {loadTracker += 1;};
asset.character.onload = function() {loadTracker += 1;};
asset.testenv.onload = function() {loadTracker += 1;};
asset.mobile.src = "./Assets/mobilecontroller.png";
asset.mobileLeft.src = "./Assets/mobileleft.png";
asset.mobileUp.src = "./Assets/mobileup.png";
asset.mobileRight.src = "./Assets/mobileright.png";
asset.mobileDown.src = "./Assets/mobiledown.png";
asset.mobileSpace.src = "./Assets/mobilespace.png";
asset.mobileX.src = "./Assets/mobilex.png";
asset.mobileO.src = "./Assets/mobileo.png";
asset.start1.src = "./Assets/startscreen.png";
asset.start2.src = "./Assets/startscreen2.png";
asset.character.src = "./Assets/character.png";
asset.testenv.src = "./Assets/testenv.png";

//initialize, load, and store images
document.fonts.load("15px 'Cherry Bomb One'").then(() => {
    loadTracker += 1;
});
document.fonts.load("15px 'Playwrite NZ'").then(() => {
    loadTracker += 1;
});

const data = {
    "0,0": {
        "imgbase": [asset.testenv,],
        "imgtop": [],
        "walls": [],
        "discover": []
    }
}

function drawText(text, font, x, y) {
    const temp_canvas = document.createElement('canvas');
    const temp_context = temp_canvas.getContext('2d', { willReadFrequently: true });

    temp_context.font = font;
    const rendered_text_size = temp_context.measureText(text);
    const font_size = parseInt(font, 10);

    temp_canvas.width = Math.ceil(rendered_text_size.width) + 2;
    temp_canvas.height = Math.ceil(font_size * 1.5);
    const baseline_y = Math.ceil(font_size);

    temp_context.font = font;
    temp_context.fillStyle = 'black';
    temp_context.textRendering = 'geometricPrecision';
    temp_context.fillText(text, 1, baseline_y);

    const image_data = temp_context.getImageData(0, 0, temp_canvas.width, temp_canvas.height);
    const pixels = image_data.data;

    for (let i = 0; i < pixels.length; i += 4)
    {
        const alpha = pixels[i + 3];

        if (alpha < 128)
        {
            pixels[i + 3] = 0;
        }
        
        else
        {
            pixels[i] = 0;
            pixels[i + 1] = 0;
            pixels[i + 2] = 0;
            pixels[i + 3] = 255;
        }   
    }

    const final_x = x - 1;
    const final_y = y - baseline_y;

    temp_context.putImageData(image_data, 0, 0)
    ctx.drawImage(temp_canvas, final_x, final_y)
    temp_canvas.remove()
}

//manage progress variable for animation sequences
function resetProgress() {
    progressBench = Math.floor((Date.now()) / (1000 / 60));
}

//handle keystrokes and mobile keypresses
window.addEventListener("keydown", function(event) {
    if (event.code === 'Space') {
        spacePress();
    }
    if (event.code === 'KeyZ' || event.code === 'KeyE') {
        actionPress();
    }
    if (event.code === 'KeyX' || event.code === 'KeyQ') {
        menuPress();
    }
    if (event.code === 'KeyZ' || event.code === 'KeyE') {
        actionPress();
    }
    if (event.code === 'ArrowUp' || event.code === 'KeyW') {
        upPress();
    }
    if (event.code === 'ArrowRight' || event.code === 'KeyD') {
        rightPress();
    }
    if (event.code === 'ArrowDown' || event.code === 'KeyS') {
        downPress();
    }
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
        leftPress();
    }
});
window.addEventListener("keyup", function(event) {
    if (event.code === 'Space') {
        spaceRelease();
    }
    if (event.code === 'KeyZ' || event.code === 'KeyE') {
        actionRelease();
    }
    if (event.code === 'KeyX' || event.code === 'KeyQ') {
        menuRelease();
    }
    if (event.code === 'KeyZ' || event.code === 'KeyE') {
        actionRelease();
    }
    if (event.code === 'ArrowUp' || event.code === 'KeyW') {
        upRelease();
    }
    if (event.code === 'ArrowRight' || event.code === 'KeyD') {
        rightRelease();
    }
    if (event.code === 'ArrowDown' || event.code === 'KeyS') {
        downRelease();
    }
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
        leftRelease();
    }
});
if (mobile) {
    function updateMobileStates() {
        let triggeredList = []
        for (let i = 0; i < event.touches.length; i++) {
            let rect = canvas.getBoundingClientRect();
            let x = Math.round((event.touches[i].clientX - rect.left) * (canvas.width / canvas.clientWidth));
            let y = Math.round((event.touches[i].clientY - rect.top) * (canvas.height / canvas.clientHeight));
            if ((x < 41 && y > 256 && y < 384)  || (Math.abs(x - 35) + Math.abs(y - 320) <= 29)) {
                if (!keyState.left) {
                    leftPress()
                }
                triggeredList.push('left')
            }
            if ((x > 87 && x < 128 && y > 256 && y < 384)  || (Math.abs(x - 93) + Math.abs(y - 320) <= 29)) {
                if (!keyState.right) {
                    rightPress()
                }
                triggeredList.push('right')
            }
            if ((x > 0 && x < 128 && y > 256 && y < 296)  || (Math.abs(x - 64) + Math.abs(y - 290) <= 29)) {
                if (!keyState.up) {
                    upPress()
                }
                triggeredList.push('up')
            }
            if ((x > 0 && x < 128 && y > 343 && y < 384)  || (Math.abs(x - 64) + Math.abs(y - 350) <= 29)) {
                if (!keyState.down) {
                    downPress()
                }
                triggeredList.push('down')
            }
            if ((x > 130 && x < 256 && y > 320 && y < 384)) {
                if (!keyState.space) {
                    spacePress()
                }
                triggeredList.push('space')
            }
            if ((x > 193 && x < 256 && y > 256 && y < 320)) {
                if (!keyState.action) {
                    actionPress()
                }
                triggeredList.push('action')
            }
            if ((x > 130 && x < 193 && y > 256 && y < 320)) {
                if (!keyState.menu) {
                    menuPress()
                }
                triggeredList.push('menu')
            }
        }
    if (!triggeredList.includes('left') && keyState.left) {
        leftRelease()
    }
    if (!triggeredList.includes('right') && keyState.right) {
        rightRelease()
    }
    if (!triggeredList.includes('up') && keyState.up) {
        upRelease()
    }
    if (!triggeredList.includes('down') && keyState.down) {
        downRelease()
    }
    if (!triggeredList.includes('space') && keyState.space) {
        spaceRelease()
    }
    if (!triggeredList.includes('action') && keyState.action) {
        actionRelease()
    }
    if (!triggeredList.includes('menu') && keyState.menu) {
        menuRelease()
    }
}
    canvas.addEventListener("touchstart", updateMobileStates);
    canvas.addEventListener('touchmove', updateMobileStates);
    canvas.addEventListener("touchend", updateMobileStates);
}
if ("keyispressed" === "keyispressed") {
function spacePress() {
    keyState.space = true;
}
function actionPress() {
    keyState.action = true;
}
function menuPress() {
    keyState.menu = true;
}
function leftPress() {
    keyState.left = true;
}
function rightPress() {
    keyState.right = true;
}
function upPress() {
    keyState.up = true;
}
function downPress() {
    keyState.down = true;
}
function spaceRelease() {
    keyState.space = false;
    if (phase === 0 && animPhase === 0) {
        animPhase = 1;
        tBench = Math.floor((Date.now()) / (1000 / 60));
    }
}
function actionRelease() {
    keyState.action = false;
}
function menuRelease() {
    keyState.menu = false;
}
function leftRelease() {
    keyState.left = false;
}
function rightRelease() {
    keyState.right = false;
}
function upRelease() {
    keyState.up = false;
}
function downRelease() {
    keyState.down = false;
}
}





//main function!!!
function draw() {
    requestAnimationFrame(draw);
    //animProgress = Math.floor((Date.now()) / (1000 / 60));
    progress = Math.floor((Date.now()) / (1000 / 60)) - progressBench;
    //draw mobile gamepad
    if (mobile && phase >= 0) {
        ctx.drawImage(asset.mobile, 0, 256);
        if (keyState.left) {
            ctx.drawImage(asset.mobileLeft, 0, 256);
        }
        if (keyState.right) {
            ctx.drawImage(asset.mobileRight, 0, 256);
        }
        if (keyState.up) {
            ctx.drawImage(asset.mobileUp, 0, 256);
        }
        if (keyState.down) {
            ctx.drawImage(asset.mobileDown, 0, 256);
        }
        if (keyState.space) {
            ctx.drawImage(asset.mobileSpace, 0, 256);
        }
        if (keyState.action) {
            ctx.drawImage(asset.mobileX, 0, 256);
        }
        if (keyState.menu) {
            ctx.drawImage(asset.mobileO, 0, 256);
        }
    }

    //skeleton frames and loading
    if (phase === -1) {
        console.log("help im still loading :O");
        let quickgradient = ctx.createLinearGradient(0, 0, 0, 256);
        quickgradient.addColorStop(0.23, '#4d6df3');
        quickgradient.addColorStop(1, '#99d9ea');
        ctx.fillStyle = quickgradient;
        ctx.fillRect(0, 0, 256, 256);
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 256, 256, 384)
        if (loadTracker === 0) {
            phase = 1;
            console.log("yay we loaded!");
            resetProgress();
        }

    //start screen
    } else if (Math.round(phase) === 0) {
        if (Math.floor(progress / frameGap) % 2 === 0) {
            ctx.drawImage(asset.start1, 0, 0);
        } else {
            ctx.drawImage(asset.start2, 0, 0);
        }
        ctx.textAlign = 'center';
        ctx.font = '28px "Cherry Bomb One"';
        ctx.fillStyle = '#ffffffc8';
        ctx.fillText('Nueva Naturaleza', 128, 25 + (textBounce * (Math.floor(progress / frameGap / 2) % 2)));
        let t = ((progress - 200) / 400) * 12
        if (progress < 400) {
            ctx.fillStyle = `#ffffff${Math.round((1 / (1 + Math.exp(t * -1))) * 200).toString(16).padStart(2, '0')}`;
        }
        ctx.font = '14px "Cherry Bomb One"';
        ctx.fillText('Press [ \u0332 \u0332 \u0332 ]', 128, 50 + (textBounce * (Math.floor(progress / frameGap / 2) % 2)))  
        
    //start game
    } else if (Math.round(phase) === 1) {
        ctx.drawImage(data[`${Math.floor(player.x/256)},${Math.floor(player.y/256)}`]["imgbase"][Math.floor(progress / frameGap) % data[`${Math.floor(player.x/256)},${Math.floor(player.y/256)}`]["imgbase"].length], 0, 0)
        ctx.drawImage(asset.character, Math.round(player.x - 8), Math.round(player.y - 8))
        //ctx.drawImage(data[`${Math.floor(player.x/256)},${Math.floor(player.y/256)}`]["imgtop"][Math.floor(progress / frameGap) % data[`${Math.floor(player.x/256)},${Math.floor(player.y/256)}`]["imgtop"].length], 0, 0)
        if (progress > player.bench) {
            player.x += Math.sign(player.dx);
            player.y += Math.sign(player.dy);
            player.bench = progress + Math.round(Math.max(Math.abs(player.dx), Math.abs(player.dy)) / player.speed);
            player.dx = 0;
            player.dy = 0;
            if (keyState.right) {
                player.dx += 2
            }
            if (keyState.left) {
                player.dx -= 2
            }
            if (keyState.up) {
                player.dy -= 2
            }
            if (keyState.down) {
                player.dy += 2
            }
            if (Math.abs(player.dx) > 0 && Math.abs(player.dy) > 0) {
                player.dx *= 1.5
                player.dy *= 1.5
            }
        }
    }





    if (animPhase === 1) {
        let t = Math.floor((Date.now()) / (1000 / 60)) - tBench;
        ctx.fillStyle = `#000000${(t * 2).toString(16).padStart(2, '0')}`
        if (t > 127) {
            if (phase !== 1) {
                phase = 1;
            }
            ctx.fillStyle = `#000000${((254 - t) * 2).toString(16).padStart(2, '0')}`
        }
        if (t > 510) {
            animPhase = 0
        }
        ctx.fillRect(0, 0, 256, 256)
    }
}
draw();