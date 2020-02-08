function valueChanged(type){
    document.getElementById("v"+type).innerText = document.getElementById(type).value;
    document.getElementById("originalNumber").max = document.getElementById("population").value;
    clearInterval(start);
}


let canvas = document.getElementById('main');
let g = canvas.getContext('2d');
let start = undefined;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const DIE_VARIANCE = 1;
const DIE_TIME = 100;
let worldTime = 0;
let hospital = null;
let personList = [];

function startTheWorld() {
    init();
    start = setInterval(update,100);
}

function update(){
    for(let person of personList){
        person.update();
    }
    worldTime++;

}

function init(){
    worldTime = 0;
    hospital = new Hospital();
    initPersonList();
    draw();
}

function getValue(type){
    return parseFloat(document.getElementById(type).value);
}

class Point{
    constructor(x,y) {
        this.x=x;
        this.y=y;
    }

    get X(){return this.x;}
    set X(x){this.x=x;}
    get Y(){return this.y;}
    set Y(y){this.y=y;}

    moveTo(x,y){
        this.x+=x;
        this.y+=y;
    }
}

class Bed extends Point{
    constructor(x,y) {
        super(x,y);
        this.isEmpty = true;
    }
}

class City{
    constructor(centerX,centerY) {
        this.centerX = centerX;
        this.centerY = centerY;
    }
}

class Hospital extends Point{
    constructor() {
        super(Hospital.HOSPITAL_X, Hospital.HOSPITAL_Y + 10);
        this.width = 0;
        this.height = 600;
        if (getValue("bedNumber") === 0) {
            this.height = 0;
        }
        let column = Math.floor(getValue("bedNumber") / 100);
        this.width =column * 6;
        this.beds = [];
        let point = new Point(Hospital.HOSPITAL_X, Hospital.HOSPITAL_Y);
        for (let i = 0; i < column; i++) {
            for (let j = 10; j <= 606; j += 6) {
                this.beds.push(new Bed(point.X+i*6, point.Y+j));
                if(this.beds.length>=getValue("bedNumber")){
                    break;
                }
            }
        }
    }

    pickBed(){
        for(let bed of this.beds){
            if(bed.isEmpty) return bed;
        }
        return null;
    }

    returnBed(bed){
        if(bed!==null){
            bed.isEmpty=true;
        }
        return bed;
    }
}

    Hospital.HOSPITAL_X = window.innerWidth-300;
    Hospital.HOSPITAL_Y = 80;

function stdGaussian(std_dev,mean){
    return (randomNormalDistribution()*std_dev)+mean;
}

function randomNormalDistribution(){
    let sum =0.0;
    for(let i = 0;i<12;i++){
        sum = sum+Math.random();
    }
    return sum-6;
}

class MoveTarget{
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.isArrived = false;
    }
}

State = {
            NORMAL:0,
            SUSPECTED:1,
            SHADOW:2,
            CONFIRMED:3,
            FREEZE:4,
            DEATH:5,
        };


function getPeopleSize(state){
    if(state ===-1){
        return personList.length;
    }
    let i = 0;
    for(let person of personList){
        if(person.state === state){
            i++;
        }
    }
    return i;
}

function initPersonList(){
    personList = [];
    let city = new City(window.innerWidth*0.4,window.innerHeight*0.5);
    for(let i = 0; i<getValue("population");i++){
        let x = Math.floor(randomNormalDistribution()*200+city.centerX);
        let y = Math.floor(randomNormalDistribution()*170+city.centerY);
        personList.push(new Person(city,x,y));
    }

    for(let i = 0;i<getValue("originalNumber");i++){
        personList[i].beInfected();
    }
}

class Person extends Point{
    constructor(city,x,y) {
        super(x,y);
        this.city = city;
        this.targetXU = stdGaussian(100,x);
        this.targetYU = stdGaussian(100,y);
        this.targetSig = 50;
        this.sig = 1;
        this.state = State.NORMAL;
        this.infectedTime = 0;
        this.confirmedTime = 0;
        this.dieMoment = 0;
        this.moveTarget = null;
        this.useBed = null;
        this.SAFE_DIST = 2;

    }
    wantMove(){
        return stdGaussian(this.sig,getValue("moveRate"))>0;
    }
    isInfected(){
        return this.state>=State.SHADOW;
    }
    beInfected(){
        this.state = State.SHADOW;
        this.infectedTime =worldTime;
    }
    distance(person){
        return Math.sqrt(Math.pow(this.x-person.X,2)+Math.pow(this.y-person.Y,2));
    }

    freezy(){
        this.state = State.FREEZE;
    }

    action(){
        if(this.state===State.FREEZE || this.state===State.DEATH) return;
        if(!this.wantMove()) return;
        if(this.moveTarget===null || this.moveTarget.isArrived){
            let targetX = Math.floor(stdGaussian(this.targetSig,this.targetXU));
            let targetY = Math.floor(stdGaussian(this.targetSig,this.targetYU));
            this.moveTarget = new MoveTarget(targetX,targetY);
        }
        let dX = this.moveTarget.x-this.X;
        let dY = this.moveTarget.y-this.Y;
        let length = Math.sqrt(Math.pow(dX,2)+Math.pow(dY,2));
        if(length<1){
            this.moveTarget.isArrived=true;
            return;
        }
        let udX = Math.floor(dX/length);
        if(udX===0 && dX!==0){
            if(dX>0) udX=1;
            else udX=-1;
        }
        let udY = Math.floor(dY/length);
        if(udY===0 && dY!==0){
            if(dY>0) udY=1;
            else udY = -1;
        }
        this.moveTo(udX,udY);
    }

    update(){
        if(this.state===State.FREEZE || this.state===State.DEATH) return;
        if(this.state === State.CONFIRMED && this.dieMoment ===0){
            let destiny = Math.floor(Math.random()*10000)+1;
            if(1<=destiny&&destiny<=getValue("fatalityRate")*10000){
                let dieTime = Math.floor(stdGaussian(DIE_VARIANCE,DIE_TIME));
                this.dieMoment = this.confirmedTime+dieTime;
            }else this.dieMoment = -1;
        }
        if(this.state === State.CONFIRMED
        &&worldTime-this.confirmedTime>=getValue("receiveTime")*10){
            let bed = hospital.pickBed();
            if(bed !==null){
                this.useBed = bed;
                this.state = State.FREEZE;
                this.X = bed.X;
                this.Y = bed.Y;
                bed.isEmpty = false;
            }
        }
        if((this.state===State.CONFIRMED || this.state===State.FREEZE) & worldTime>=this.dieMoment && this.dieMoment>0){
            this.state = State.DEATH;
            hospital.returnBed(this.useBed);
        }

        let randomShadowTime = stdGaussian(10,getValue("shadow")*5);
        if(worldTime-this.infectedTime>randomShadowTime&& this.state===State.SHADOW){
            this.state=State.CONFIRMED;
            this.confirmedTime = worldTime;
        }
        this.action();

        if(this.state >=State.SHADOW){
            return;
        }
        for(let person of personList){
            if(person.state === State.NORMAL){
                continue;
            }
            let random = Math.random();
            if(random<getValue("spreadRate") && this.distance(person)<this.SAFE_DIST){
                this.beInfected();
                break;
            }
        }

    }

}

function paint(){
    g.clearRect(0,0,canvas.width,canvas.height);
    g.beginPath();
    g.strokeStyle = "#00ff00";
    g.rect(hospital.X,hospital.Y,hospital.width,hospital.height);
    g.font = "16px Arial";
    g.fillStyle = "#00ff00";
    g.fillText("医院",hospital.X+hospital.width/4,hospital.Y-16);

    if(personList===null) return;
    for(let person of personList){
        switch (person.state) {
            case State.NORMAL:
                g.fillStyle = "#dddddd";
                break;
            case State.SHADOW:
                g.fillStyle = "#ffee00";
                break;
            case State.CONFIRMED:
                g.fillStyle="#ff0000";
                break;
            case State.FREEZE:
                g.fillStyle="#48fffc";
                break;
            case State.DEATH:
                g.fillStyle="#000000";
                break;
        }
        g.fillRect(person.X,person.Y,3,3);
    }

    let captionStartOffsetX = Hospital.HOSPITAL_X+hospital.width+40;
    let captionStartOffsetY = 40;
    let captionSize = 24;

    g.fillStyle = "#ffffff";
    g.fillText("城市总人数："+getValue("population"),captionStartOffsetX,captionStartOffsetY);
    g.fillStyle = "#dddddd";
    g.fillText("健康者人数："+getPeopleSize(State.NORMAL),captionStartOffsetX,captionStartOffsetY+captionSize);
    g.fillStyle = "#ffee00";
    g.fillText("潜伏期人数：" + getPeopleSize(State.SHADOW), captionStartOffsetX, captionStartOffsetY + 2 * captionSize);
    g.fillStyle="#ff0000";
    g.fillText("发病者人数：" + getPeopleSize(State.CONFIRMED), captionStartOffsetX, captionStartOffsetY + 3 * captionSize);
    g.fillStyle = "#48FFFC";
    g.fillText("已隔离人数：" + getPeopleSize(State.FREEZE), captionStartOffsetX, captionStartOffsetY + 4 * captionSize);
    g.fillStyle = "#00ff00";
    g.fillText("空余病床：" + Math.max(getValue("bedNumber") - getPeopleSize(State.FREEZE), 0), captionStartOffsetX, captionStartOffsetY + 5 * captionSize);
    g.fillStyle = "#E39476";
    let needBed = getPeopleSize(State.CONFIRMED)-getPeopleSize(State.FREEZE);
    g.fillText("急需病床：" + (needBed > 0 ? needBed : 0), captionStartOffsetX, captionStartOffsetY + 6 * captionSize);
    g.fillStyle = "#ccbbcc";
    g.fillText("病死人数：" + getPeopleSize(State.DEATH), captionStartOffsetX, captionStartOffsetY + 7 * captionSize);
    g.fillStyle="#ffffff";
    g.fillText("世界时间（天）：" + Math.floor(worldTime / 10.0), captionStartOffsetX, captionStartOffsetY + 8 * captionSize);

    g.stroke();
    g.closePath();
}


function draw(){
    paint();
    requestAnimationFrame(draw);
}