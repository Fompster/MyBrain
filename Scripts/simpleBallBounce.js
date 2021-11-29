var context;
    var xPos, yPos, maxX, maxY;
    var dx = 2;
    var dy = 2;
    var motionTrailLength = 30;
    var positions = [];

    function init() {
        context= canvas1.getContext('2d');
        maxX = canvas1.width;
        maxY = canvas1.height;
        xPos = maxX / 2;
        yPos = maxY / 2;
        setInterval(draw,10);
    }

    function storePosition(xPos, yPos) {
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

    function draw() {
        context.clearRect(0,0, maxX, maxY);

        // Boundary Logic
        if( xPos<0 || xPos>maxX) dx=-dx; 
        if( yPos<0 || yPos>maxY) dy=-dy; 
        xPos +=dx; 
        yPos +=dy;

        // Trail Logic
        context.lineWidth = 3;
        var radius = 26 - context.lineWidth;
        
        for (var i = positions.length - 1; i >= 0; i--) {
            var ratio = (i + 1) / positions.length;
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

        storePosition(xPos, yPos);
}