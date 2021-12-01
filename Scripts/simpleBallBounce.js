// Used in the first project page
function bounceBall(canvas){
    const radius = 23;
    const motionTrailLength = 30;
    var maxX, maxY, xPos, yPos;
    var context = canvas.getContext('2d');
    let positions = [];
    var dx = 2;
    var dy = 2;
    var ratio;

    function init() {
        maxX = canvas.width;
        maxY = canvas.height;
        xPos = maxX / 2;
        yPos = maxY / 2;
        setInterval(draw, 10);
    }
    
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
    init();
}