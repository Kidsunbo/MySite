let mouseX = window.innerWidth;
let mouseY = window.innerHeight;

window.addEventListener('mousemove',ev => {
    mouseX=ev.clientX;
    mouseY=ev.clientY;
});

let canvas = document.getElementById('main');
let g = canvas.getContext('2d');


class MoveCircle{
    constructor(){
        this.minRad = Math.random()*10+2;
        this.radius = this.minRad;
        this.color = `rgba(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*200+55)})`;
        this.moveSpeed = 1.0;
        this.changeSpeed = 5.0;
        this.h = Math.random()>0.5?this.moveSpeed:-this.moveSpeed;
        this.v = Math.random()>0.5?this.moveSpeed:-this.moveSpeed;
        this.x = Math.random()*window.innerWidth;
        this.y = Math.random()*window.innerHeight;
        this.maxRad = Math.random()*10+30+this.minRad;
    }

    draw(g) {
        // Draw
        g.beginPath();
        g.fillStyle = this.color;
        g.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        g.fill();
        g.closePath();

        //Update
        if (Math.abs(this.x - mouseX) <= 100 && Math.abs(this.y - mouseY) <= 100 && this.radius < this.maxRad) {
            this.radius += this.changeSpeed;
        }
        if ((Math.abs(this.x - mouseX) > 100 || Math.abs(this.y - mouseY) > 100) && this.radius > this.minRad) {
            this.radius -= this.changeSpeed;
            this.radius = Math.max(2,this.radius);
        }
        if ((this.x + this.radius) >= window.innerWidth) this.h = -this.moveSpeed;
        else if ((this.x - this.radius) <= 0) this.h = this.moveSpeed;
        if ((this.y + this.radius) >= window.innerHeight) this.v = -this.moveSpeed;
        else if ((this.y - this.radius) <= 0) this.v = this.moveSpeed;
        this.x += this.h;
        this.y += this.v;
    }
}

let circles = ((x)=>{
    let circles = [];
    for(let i =0;i<x;i++){
        circles.push(new MoveCircle());
    }
    return circles;
})(300);

function main() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.getElementById('propagation').style.color = `rgba(${Math.floor(mouseX / canvas.width * 255)},${Math.floor(mouseY / canvas.height * 255)},${Math.floor((mouseX / canvas.width * 255 + mouseY / canvas.height * 255) / 2)},255)`;
    // document.getElementById('propagation').innerText = ;

    g.fillStyle = 'black';
    g.rect(0, 0, canvas.width, canvas.height);
    g.fill();

    for (let circle of circles) {
        circle.draw(g);
    }

    requestAnimationFrame(main);
}
main();