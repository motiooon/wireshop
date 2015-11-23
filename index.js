// Make the paper scope global, by injecting it into window:
paper.install(window);

var display = document.getElementById('display');

var tools = ['Rectangle', 'Cursor', 'Move', 'Image', 'Symbol'];

var RectangleTool = new Tool();
var SelectorTool = new Tool();
var CircleTool = new Tool();
var VectorTool = new Tool();
var ImageTool = new Tool();

window.onload = function() {

	// Setup directly from canvas id:
	paper.setup('canvas');
	// We start by defining an empty variable that is visible by both
	// mouse handlers.
	var rectangle, path, point;

	var paths = [];

 	window.addEventListener('keypress', handleKeyPress);
    function handleKeyPress(e) { 
		if(Key.isDown('r')){
			console.log('Rectangle activated');
			RectangleTool.activate();
		}
     }	

    var segm;
	var pathsMoving = false;

	SelectorTool.onMouseDown = function(event) {	
			//http://paperjs.org/examples/hit-testing/

			var hitOptions = {
				segments: true,
				stroke: true,
				fill: true,
				tolerance: 5
			};

			var hitResult = project.hitTest(event.point, hitOptions);

			if(hitResult){
				if(hitResult.segment){
					segm = hitResult.segment;
					segm.selected = true;						
				}

			}else{
				delesectAllPaths();
				segm = null;
			}
	}

	SelectorTool.onMouseDrag = function(event) {
		console.log(segm);
		if (segm && !pathsMoving) {
			segm.point = new Point(event.event.x, event.event.y);
		}
	}	

   	SelectorTool.onMouseUp = function(event) {
   		if(segm){
   			segm.selected = false;	
   		}   		
	}

	//onMouseEnter, onMouseLeave, onMouseOver, onClick, onDoubleClick, onMouseDrag

	RectangleTool.onMouseDown = function(event) {	
		point = new Point(event.event.x, event.event.y);
		rectangle = new Rectangle(point,point);	
		path = new Path.Rectangle(rectangle);	
	}

	RectangleTool.onMouseDrag = function(event) {

		point.x = event.event.x;
		point.y = event.event.y;	
		rectangle.bottomRight = point;
		if(path) path.remove();
		path = new Path.Rectangle(rectangle);	
		path.fillColor = '#e9e9ff';	
		path.closed = false;
		path.selected = false;						
	}

	function delesectAllPaths(){
		
		paths.forEach(function(p){
			p.selected = false;
		});
	}

	RectangleTool.onMouseUp = function(event) {
		path.closed = true;
		path.selected = true;	
		path.fullySelected = true;	
		
		delesectAllPaths();
		
		paths.push(path);	

		// console.log(paths);

		var downX, centerX, centerY;
		
		path.attach('mousedown', function(e) {

			downX = e.event.x;
			downY = e.event.y;

			// console.log(downX, downY);

			centerX = this.bounds.x + (this.bounds._width/2);
			centerY = this.bounds.y + (this.bounds._height/2);			

			paths.forEach(function(p){
				p.selected = false;
			});

			this.selected = true;
			this.bringToFront();
		});	

		// width, rectange _x, event.x

		path.attach('mousedrag', function(e) {
			var posX = e.event.x > centerX ? e.event.x + centerX - downX : e.event.x + centerX - downX;
			var posY = e.event.y > centerY ? e.event.y+ centerY - downY : e.event.y + centerY - downY;

			pathsMoving = true;

			this.position = new Point(posX, posY);		
		});	

		path.attach('mouseup', function(e) {
			pathsMoving = false;
		})

		// RectangleTool.remove();		
		SelectorTool.activate();
	}
}


// Item events:
//https://groups.google.com/forum/#!topic/paperjs/7HSviqolOA8

//Resize rectangle:
//http://stackoverflow.com/questions/29761368/resize-rectangle-in-paper-js
//http://stackoverflow.com/questions/15129584/how-to-change-only-width-of-pathrect-circle-while-mouse-drag-using-paper-js


//http://stackoverflow.com/questions/32540165/how-to-pan-using-paperjs

//http://stackoverflow.com/search?q=paperjs

//http://stackoverflow.com/questions/16889719/re-size-circle-using-paperjs
