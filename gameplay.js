const frameofgame = document.getElementById("gameframe");
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
var mobile = false;
var phase = -1;
var progress = 0;
var select = 0;
const frameGap = 75;

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
    start2: new Image(),
};
var loadTracker = (Object.keys(asset).length + 2) * -1;
asset.mobile.onload = function() {loadTracker += 1;};
asset.start1.onload = function() {loadTracker += 1;};
asset.start2.onload = function() {loadTracker += 1;};
asset.mobile.src = "./Assets/mobilecontroller.png";
asset.start1.src = "./Assets/naturastartscreen.png";
asset.start2.src = "./Assets/naturastartscreen2.png";
document.fonts.load("15px 'Cherry Bomb One'").then(() => {
    loadTracker += 1;
});
document.fonts.load("15px 'Playwrite NZ'").then(() => {
    loadTracker += 1;
});
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


function draw() {
    requestAnimationFrame(draw);
    if (phase === -1) {
        console.log("help im still loading :O");
        if (loadTracker === 0) {
            phase = 0;
            console.log("yay we loaded!");
        }
    } else if (phase === 0) {
        progress += 1
        let textBounce = 1
        if (Math.floor(progress / frameGap) % 2 === 0) {
            ctx.drawImage(asset.start1, 0, 0);
        } else {
            ctx.drawImage(asset.start2, 0, 0);
        }
        if (mobile) {
            ctx.drawImage(asset.mobile, 0, 256);
        }
        ctx.textAlign = 'center';
        ctx.font = '28px "Cherry Bomb One"';
        ctx.fillStyle = '#ffffffc8';
        ctx.fillText('Nueva Naturaleza', 128, 25 + (textBounce * (Math.floor(progress / frameGap / 2) % 2)));
        if (progress <= 400) {
            ctx.fillStyle = '#ffffff00'
        } else if (progress <= 800) {
            let t = ((progress - 600) / 400) * 12
            ctx.fillStyle = `#ffffff${Math.round((1 / (1 + Math.exp(t * -1))) * 200).toString(16).padStart(2, '0')}`;
        }
        ctx.font = '14px "Cherry Bomb One"';
        ctx.fillText('Press [    ]', 128, 50 + (textBounce * (Math.floor(progress / frameGap / 2) % 2)))
        
    }
}
draw();