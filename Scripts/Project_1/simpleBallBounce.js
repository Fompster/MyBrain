// Used in the first project page

function spawnBalls() {
    let bouncingBalls = [];
    var ballCanvases = $("[id='bounceBalls']");

    for (var i = 0; i<ballCanvases.length; i++) {
        bouncingBalls.push(new BounceBall(ballCanvases[i]));
        console.log(ballCanvases[i].getContext)
    }
    
    function draw(){
        for (var i = 0; i < bouncingBalls.length; i++) {
            bouncingBalls[i].update();
            bouncingBalls[i].storePosition();
        }
        window.requestAnimationFrame(draw);
    }
    draw();
}

class BounceBall {
    constructor(canvas) {
        this.canvas = canvas;
        this.positions = [];
        this.radius = 23;
        this.motionTrailLength = 30;
        this.maxX = this.canvas.width;
        this.maxY = this.canvas.height;
        this.x = this.maxX / 2;
        this.y = this.maxY / 2;
        this.context = this.canvas.getContext('2d');
        this.dx = (Math.random() + 1)*2;
        this.dy = (Math.random() + 1)*2;
        this.ratio;
    }

    update() { 
        this.context.clearRect(0, 0, this.maxX, this.maxY);
        this.context.lineWidth = 3;

        // Boundary Logic
        if (this.x <= this.radius || this.x >= this.maxX - this.radius)
            this.dx = -this.dx;
        if (this.y <= this.radius || this.y >= this.maxY - this.radius)
            this.dy = -this.dy;
        this.x += this.dx;
        this.y += this.dy;

        // Trail Logic
        for (var i = this.positions.length - 1; i >= 0; i--) {
            this.ratio = (i + 1) / this.positions.length;
            this.context.beginPath();
            this.context.arc(this.positions[i].x, this.positions[i].y, this.radius * this.ratio, 0, 2 * Math.PI, true);
            this.context.fillStyle = "rgba(204, 102, 153, " + this.ratio / 2 + ")";
            this.context.fill();
        }

        this.context.strokeStyle = "#ffffff";
        this.context.beginPath();
        this.context.arc(this.x, this.y, 20, 0, 2 * Math.PI, false);
        this.context.closePath();
        this.context.stroke();
    }

    storePosition() {
        // Add positions for the trail
        this.positions.push({x: this.x,y: this.y});
        //get rid of first item
        if (this.positions.length > this.motionTrailLength) {
            this.positions.shift();
        }
    }
}
