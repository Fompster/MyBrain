// Used in the first project page

function bounceBall(canvas){
    const radius = 23;
    const motionTrailLength = 30;
    let maxX = canvas.width;
    let maxY = canvas.height;
    var xPos = maxX / 2;
    var yPos = maxY / 2;
    var context = canvas.getContext('2d');
    let positions = [];
    var dx = 3;
    var dy = 3;
    var ratio;

    draw();
  
    function draw() {
        context.clearRect(0,0, maxX, maxY);
        context.lineWidth = 3;
    
        // Boundary Logic
        if( xPos<=0+radius || xPos>=maxX-radius) dx=-dx; 
        if( yPos<=0+radius || yPos>=maxY-radius) dy=-dy; 
        xPos +=dx; 
        yPos +=dy;
    
        // Trail Logic
        for (var i = positions.length - 1; i >= 0; i--) {
            ratio = (i + 1) / positions.length;
            context.beginPath();
            context.arc(positions[i].x, positions[i].y, radius * ratio, 0, 2 * Math.PI, true);
            context.fillStyle = "rgba(204, 102, 153, " + ratio / 2 + ")";
            context.fill();
        }
    
        context.strokeStyle = "#ffffff";
        context.beginPath();
        context.arc(xPos, yPos, 20, 0, 2 * Math.PI, false); 
        context.closePath();
        context.stroke();
    
        storePosition();
        window.requestAnimationFrame(draw);
    }

    function storePosition() {
        // Add positions for the trail
        positions.push({
            x: xPos,
            y: yPos
        });
        //get rid of first item
        if (positions.length > motionTrailLength) {
            positions.shift();
        }
    }
}