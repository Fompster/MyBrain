// Used in the first project page

function sparks(canvas){
  const radius = 15;
  var maxX = canvas.width;
  var maxY = canvas.height;
  var x = maxX / 2;
  var y = maxY / 2;
  let context = canvas.getContext('2d');

  canvas.onmousemove = function mouseCoords(event){
    var canvasPosition = getPosition(canvas);
    x = event.clientX - canvasPosition.x;
    y = event.clientY - canvasPosition.y;
  };

  // Get a div's exact position on the page
  function getPosition(div) {
      var xPos = 0;
      var yPos = 0;
    
      while (div) {
        if (div.tagName == "BODY") {
          // deal with browser quirks with body/window/document and page scroll
          var xScroll = div.scrollLeft || document.documentElement.scrollLeft;
          var yScroll = div.scrollTop || document.documentElement.scrollTop;
    
          xPos += (div.offsetLeft - xScroll + div.clientLeft);
          yPos += (div.offsetTop - yScroll + div.clientTop);

        } else {
          // for all other non-BODY elements
          xPos += (div.offsetLeft - div.scrollLeft + div.clientLeft);
          yPos += (div.offsetTop - div.scrollTop + div.clientTop);
        }
    
        div = div.offsetParent;
      }
      return {
        x: xPos,
        y: yPos
      };
    }

  function draw() {
      context.clearRect(0,0, maxX, maxY);
      
      // glow
      context.filter = 'blur(4px)';
      context.beginPath();
      context.arc(x, y, radius, 0, 2 * Math.PI, true);
      context.fillStyle = "rgba(255, 255, 0, 0.8)" ;
      context.fill();
      context.closePath();
      
      // light
      context.beginPath();
      context.arc(x, y, radius - 4, 0, 2 * Math.PI, true);
      context.fillStyle = "#ffffff" ;
      context.fill();
      context.closePath();
  }
  setInterval(draw, 10);
}
