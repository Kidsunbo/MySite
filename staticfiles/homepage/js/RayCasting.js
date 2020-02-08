let mouseX = window.innerWidth;
let mouseY = window.innerHeight;

window.addEventListener('mousemove',ev => {
    mouseX=ev.clientX;
    mouseY=ev.clientY;
});

window.addEventListener('resize',ev => {
    walls = walls.slice(0,4);
    walls.push([0,0,window.innerWidth,0]);
    walls.push([window.innerWidth,0,window.innerWidth,window.innerHeight]);
    walls.push([window.innerWidth,window.innerHeight,0,window.innerHeight]);
    walls.push([0,window.innerHeight,0,0]);
});

let canvas = document.getElementById('main');
let g = canvas.getContext('2d');

function createWalls() {
    let walls = [];
    for(let i of new Array(5)){
        walls.push([Math.random()*window.innerWidth,Math.random()*window.innerHeight,Math.random()*window.innerWidth,Math.random()*window.innerHeight]);
    }
    walls.push([0,0,window.innerWidth,0]);
    walls.push([window.innerWidth,0,window.innerWidth,window.innerHeight]);
    walls.push([window.innerWidth,window.innerHeight,0,window.innerHeight]);
    walls.push([0,window.innerHeight,0,0]);
    return walls;
}
let walls = createWalls();

function drawWalls(g) {
    g.strokeStyle='white';
    g.lineWidth = 3;
    g.beginPath();

    for(let wall of walls){
        wall = wall.map(x=>Math.floor(x));
        g.moveTo(wall[0],wall[1]);
        g.lineTo(wall[2],wall[3]);
    }
    g.stroke();
    g.closePath();
}

function drawLightPoint(g) {
    g.fillStyle='white';
    g.arc(mouseX,mouseY,10,0,2*Math.PI);
    g.fill();
}

function drawLight(g) {
    g.lineWidth=2;
    g.beginPath();
    for(let i=0;i<360;i++){
        let x1 = mouseX;
        let x2 = mouseX+Math.cos(i/180*Math.PI);
        let y1 = mouseY;
        let y2 = mouseY+Math.sin(i/180*Math.PI);
        let px = mouseX;
        let py = mouseY;
        let length = Number.MAX_VALUE;
        for(let wall of walls){
            let x3 = wall[0];
            let y3 = wall[1];
            let x4 = wall[2];
            let y4 = wall[3];
            let den = (x1-x2)*(y3-y4)-(y1-y2)*(x3-x4);
            if(den===0) continue;
            let t = ((x1-x3)*(y3-y4)-(y1-y3)*(x3-x4))/den;
            let u = -((x1-x2)*(y1-y3)-(y1-y2)*(x1-x3))/den;
            if(u>=0 && u<=1 && t>0){
                let _px = x1+t*(x2-x1);
                let _py = y1+t*(y2-y1);
                let _length = Math.pow(_px-mouseX,2)+Math.pow(_py-mouseY,2);
                if(_length<length){
                    length=_length;
                    px=_px;
                    py = _py;
                }
            }
        }
        g.moveTo(mouseX,mouseY);
        g.lineTo(px,py);
    }
    g.stroke();
    g.closePath();
}

function draw() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.getElementById('propagation').style.color=`rgba(${Math.floor(mouseX/canvas.width*255)},${Math.floor(mouseY/canvas.height*255)},${Math.floor((mouseX/canvas.width*255+mouseY/canvas.height*255)/2)},255)`;
    // document.getElementById('propagation').innerText = ;

    g.fillStyle='black';
    g.rect(0,0,canvas.width,canvas.height);
    g.fill();

    //Draw walls
    drawWalls(g);

    //Draw light point
    drawLightPoint(g);

    //Draw light
    drawLight(g);


    requestAnimationFrame(draw);
}

draw();