let mouseX = window.innerWidth/2;
let mouseY = window.innerHeight/2;

window.addEventListener('mousemove',ev => {
    mouseX=ev.clientX;
    mouseY=ev.clientY;
    init();
});
window.addEventListener('resize',resizeCallback);

let canvas = document.getElementById('main');
let g = canvas.getContext('2d');

class Circle{
    constructor(i){
        this.radius = i*20+20;
        this.circleRadius = 10;
        this.angle = Math.random()*360;
        this.color = `rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`;
    }

    draw(g){
        g.beginPath();
        g.fillStyle=this.color;
        g.arc(mouseX+this.radius*Math.cos(this.angle/180*Math.PI),mouseY+this.radius*Math.sin(this.angle/180*Math.PI),this.circleRadius,0,2*Math.PI,false);
        g.fill();
        g.closePath();
        this.angle+=1;
    }
}

let circles = ((x)=>{
    let circles = [];
    for(let i=0;i<x;i++){
        circles.push(new Circle(i));
    }
    return circles;
})(20);

function resizeCallback(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
}

function init() {
    g.beginPath();
    g.fillStyle = 'rgba(0,0,0,1)';
    g.rect(0, 0, canvas.width, canvas.height);
    g.fill();
    g.closePath();
}




function main() {
    document.getElementById('propagation').style.color = `rgba(${Math.floor(mouseX / canvas.width * 255)},${Math.floor(mouseY / canvas.height * 255)},${Math.floor((mouseX / canvas.width * 255 + mouseY / canvas.height * 255) / 2)},255)`;
    g.beginPath();
    g.fillStyle = 'rgba(0,0,0,0.005)';
    g.rect(0, 0, canvas.width, canvas.height);
    g.fill();
    g.closePath();

    for(let circle of circles){
        circle.draw(g);
    }
    requestAnimationFrame(main);
}

resizeCallback();
init()
main();