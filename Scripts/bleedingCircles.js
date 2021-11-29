
    const dpr = Math.min( window.devicePixelRatio, 2 );
    const body = document.body;
    const status = document.querySelector( '.status' );
    const modes = [
      { id: 'brush', t: 0 },
      { id: 'line', t: 0 },
      { id: 'dash', t: 4 },
      { id: 'worm', t: 4 }
    ];

    let width,
        height,
        canvasWidth,
        canvasHeight;

    const brushDefaults = { x: 0.5, tx: 0.5, ttx: 0.5, y: 0, ty: 0.9, w: 1, tw: 1 };
    const brushCanvas = createCanvas( 'brushes' );
    const brushContext = brushCanvas.getContext( '2d' );

    let mode = 0;

    let canvases = [];
    let brushes = [];

    let scrollTop = 0;
    let currentTop;
    let lastTop;
    let currentMode = modes[0];

    function reset() {

      width = window.innerWidth;
      height = window.innerHeight;
      canvasWidth = width * dpr;
      canvasHeight = height * dpr;

      currentTop = 0;
      lastTop = -1;

      canvases.forEach( o => o.canvas.remove() );
      canvases = [];

      resizeCanvas( brushCanvas );
      brushContext.scale( dpr, dpr );
      brushContext.globalCompositeOperation = 'multiply';

      brushes = [
        { ...brushDefaults, color: 'coral' },
        { ...brushDefaults, color: 'indigo' },
        { ...brushDefaults, color: 'deepskyblue' },
        { ...brushDefaults, color: 'antiquewhite' },
        { ...brushDefaults, color: '#222' }
      ];

      brushes.forEach( brush => brush.points = [] );

      build();

    }

    function update() {

      scrollTop = Math.max( document.documentElement.scrollTop, 0 );

      build();

      if( Math.abs( scrollTop - currentTop ) >= 1 || lastTop === -1 ) {
        step();
        step();
      }

      status.innerHTML = `scroll + click | mode: ${currentMode.id}`;

      paintBrushes();

      requestAnimationFrame( update );

    }

    function build() {

      if( ( body.scrollHeight - scrollTop ) / height < 2 ) {
        let canvasesToAdd = 6;
        while( --canvasesToAdd ) {
          const canvas = createCanvas( 'lines' );
          const context = canvas.getContext( '2d' );
          const top = canvas.offsetTop;

          canvases.push({ canvas, context, top, visibility: 'visible' });

          context.scale( dpr, dpr );

          if( top !== 0 ) {
            context.beginPath();
            context.fillStyle = '#ccc';
            context.strokeStyle = '#ccc';
            context.lineWidth = 1;
            context.moveTo( width - 10, 18 );
            context.lineTo( width - 40, 18 );
            context.stroke();
            context.textAlign = 'right';
            context.font = '12px Monospace';
            context.fillText( top.toLocaleString() + 'px', width - 50, 22 );
          }

          context.translate( 0, -top );
          context.globalCompositeOperation = 'multiply';
        }
      }

    }

    function step() {

      lastTop = currentTop;
      currentTop = Math.round( currentTop + ( scrollTop - currentTop ) * 0.2 );

      const span = width * 0.9;
      const left = width/2 - span/2;

      const velocity = Math.min( Math.abs( currentTop - lastTop ) / 200, 0.1 );

      brushes.forEach( (brush,i) => {
        brush.tx += ( brush.ttx - brush.tx ) * velocity * 1.2;
        brush.x += ( brush.tx - brush.x ) * velocity;
        brush.y += ( brush.ty - brush.y ) * velocity * ( brush.w * 0.25);
        brush.w += ( brush.tw - brush.w ) * velocity * 0.6;

        brush.points.push({
          x: left + ( brush.x * span ),
          y: Math.round( currentTop + brush.y * height ),
          w: 2 + brush.w * Math.min( width * 0.1, 100 )
        });

        let [p1, p2, p3] = brush.points;

        if( p2 && p3 && Math.abs( p2.y - p3.y ) < currentMode.t ) {
          brush.points.pop();
        }

        if( brush.points.length === 3 ) {

          // paint on each canvas that our points touch
          new Set( brush.points.map( point => {
            return canvases.find( o => point.y >= o.top && point.y <= o.top + height );
          } )).forEach( canvas => {

            if( currentMode.id === 'brush' ) {
              canvas.context.beginPath();

              canvas.context.moveTo( p1.x - p1.w/2, p1.y );
              canvas.context.quadraticCurveTo(
                p2.x - p2.w/2, p2.y,
                p3.x - p3.w/2, p3.y
              );
              canvas.context.lineTo( p3.x + p3.w/2, p3.y );
              canvas.context.quadraticCurveTo(
                p2.x + p2.w/2, p2.y,
                p1.x + p1.w/2, p1.y
              );

              canvas.context.fillStyle = brush.color;
              canvas.context.fill();
            }
            else if( currentMode.id === 'line' ) {
              canvas.context.beginPath();

              canvas.context.moveTo( p1.x, p1.y );
              canvas.context.quadraticCurveTo(
                p2.x, p2.y,
                p3.x, p3.y
              );

              canvas.context.strokeStyle = brush.color;
              canvas.context.lineWidth = 4;
              canvas.context.stroke();
            }
            else if( currentMode.id === 'dash' ) {
              canvas.context.beginPath();

              if( p1.x < p3.x ) {
                canvas.context.moveTo( p3.x-p3.w/2, p3.y );
                canvas.context.lineTo( p1.x+p1.w/2, p1.y );
              }
              else {
                canvas.context.moveTo( p3.x+p3.w/2, p3.y );
                canvas.context.lineTo( p1.x-p1.w/2, p1.y );
              }

              canvas.context.strokeStyle = brush.color;
              canvas.context.lineWidth = 2;
              canvas.context.stroke();
            }
            else if( currentMode.id === 'worm' ) {
              canvas.context.beginPath();

              canvas.context.moveTo( p1.x - p1.w/2, p1.y );
              canvas.context.quadraticCurveTo(
                p2.x, p2.y,
                p3.x - p3.w/2, p3.y
              );
              canvas.context.lineTo( p3.x + p3.w/2, p3.y );
              canvas.context.quadraticCurveTo(
                p2.x, p2.y,
                p1.x + p1.w/2, p1.y
              );

              canvas.context.fillStyle = brush.color;
              canvas.context.fill();
            }

          } );

          brush.points = [p3];

        }

        if( Math.abs( brush.ttx - brush.tx ) < 0.05 ) {
          brush.ttx = Math.random();
        }

        if( Math.abs( brush.tw - brush.w ) < 0.1 ) {
          brush.tw = Math.random();
        }

        let oy = 0.2*i/brushes.length;
        brush.ty = currentTop < lastTop ? 0.1 + oy : 0.8 + oy;
      } );

    }

    function paintBrushes() {

      brushCanvas.style.top = scrollTop + 'px';
      brushContext.clearRect( 0, 0, width, height );

      brushes.forEach( brush => {
        let p = brush.points[0];
        brushContext.beginPath();
        brushContext.fillStyle = brush.color;
        brushContext.arc( p.x, p.y-scrollTop, p.w*0.5, 0, 2 * Math.PI );
        brushContext.fill();
      } );

    }

    function createCanvas( className ) {

      let c = document.createElement( 'canvas' );
      c.className = className;
      resizeCanvas( c );
      body.appendChild( c );

      return c;

    }

    function resizeCanvas( c ) {

      c.width = canvasWidth;
      c.height = canvasHeight;
      c.style.width = width + 'px';
      c.style.height = height + 'px';

    }

    window.onresize = () => {
      // ios viewport changes height ever two seconds so
      // only look at the width
      if( window.innerWidth !== width ) {
        reset();
      }
    };

    reset();
    update();

    document.body.onclick = () => {
      currentMode = modes[ (modes.indexOf(currentMode) + 1) % modes.length ];
    };
  