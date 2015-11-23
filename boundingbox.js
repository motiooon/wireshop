// Make the paper scope global, by injecting it into window:
paper.install(window);

var display = document.getElementById('display');

var tools = ['Rectangle', 'Cursor', 'Move', 'Image', 'Symbol'];

var RectangleTool = new Tool();
var SelectorTool = new Tool();
var CircleTool = new Tool();
var VectorTool = new Tool();
var ImageTool = new Tool();


function BBHandle(size){
	// return path;
}

// path or shape
function BoundingBox(path){
	//basically draw 8 rectangles
	// 4 lines
	// and attach hanlers to the 8 rects
	// and somehow attach the rect group to the path and show it on click
}

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
					// segm.selected = true;						
				}

			}else{
				delesectAllPaths();
				segm = null;
			}
	}

	SelectorTool.onMouseDrag = function(event) {
		//http://paperjs.org/tutorials/project-items/transforming-items/
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
		// path.selected = true;	
		// path.fullySelected = true;	
		
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

			// this.selected = true;
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

		path.attach('mouseenter', function(e) {
			this.style = {
			    strokeColor: '#4cc1fc',
			    strokeWidth: 2
			};
		});		

		path.attach('mouseleave', function(e) {
			this.style = {
			    strokeWidth: 0
			};
		});			

		// RectangleTool.remove();		
		SelectorTool.activate();
	}
}


// Bounding Box:
//http://sketch.paperjs.org/#S/pVhLc9s2EP4rsA4RaTGM7MSdiRT1kPjSmTrNOO30UPVAiZCEmgI0JCTbTfTfu1g8CJKg7NQ66AHsfrtY7H671LcBz7Z0MBl8vaNyuRkkg6XI1e9DVpJDVuxpRWbk25zP5S6Tm2pCrhL1Y8v4F8G4rBeyB7tw4URus5ztYeXt2MrYlffjOT9OYZErQxsmf9tJJrgzVtH1liKaLPcUtStZijvqLaxYUXg/pShomfEliFz54BUt6FKB38JHxtcFBSN8XxTTvv2vy6ygs6dFPotymxXsX5qfFr4VMlMLVmpZ0kzSLyqeUYx+rvYcVUhjS4dCYZYYtmtayAyc1/eSunCS127JxnxqNXd4KV1NfVkNTb2EmitRkkipM1AaT+HjgxXENICV0cj453vombCekBG5AZUUriYXWzjUuX+aaY2gPW0gGCcNwqoQoozaYN4BYx8NxABLx/NjIRbRgdH7tILbAiUEdiiJ8SgxYD5OwdYbyWmlHGvZfk3G6ZVyYZy+Ax/h3dPb7FWatZ19+9PYyOzwRJDBn0QBwYa0VyoT9ZaQKpP7ElMGqimpfZh47hx9IF0bFmq4KLLl3RAFlNgxkGIYkiWUGC0T4jLJRaBOPRNITu+JSkudsNrqshAVzWFT1WBv3mjEbsbkJicRWclEZnMuC8rXcjMhUZ3i5zrYo/YlnJO2TGJRsPYABIJO3riDnROmBY6xH8Esz004wEZeZ9PRnbbaCuHOX1K4IY7BsQHWtY+0leBGEuINLWCoYisOWOsQhVVWVLTJBYwz+bWDECloDCSBF1tFXSNnSDSxllCvrkhaUmUcT6MksIRpRSW4gqctLWfNxuTVK71WAekxvk4fZrOLzuIjLHpgC7HneTV1XiK4celb7dkSOB94Oy3EOhqizNC6pF4axfrUwFQvXN39AnFiWfGxX/aoPyiE+LQHXJCnnGiaaxpoYGm1CRlCQunvFnQBWHpFlRCHW0jpww4yOroYJxdjK6bfw+3LVGNap8XCqgUum/GKljK6TLxiW6Q63dOHhCxSKXbxSwFeX169GMMBQMqc9eRMAHsnKoY107h9Az49XQgm0duJf1rLZL1VMj/rbOiNgmbqP1mOVX/RH64Ope/psF9aTXEgNh+4PUhkszkfnLCCSz6J90XY9IGa8RxPCX4j9hW9Fvc8ogcIedyY4YxSPXSZBsnkLa32Be6X4h+wlMLa77SSGiVFxk684VBTL1uR6Mxpx5rDNR8jf2oJDbEVOVsxWlZptWEr6fqPknAQqXzcQfAgyMbjoZOby1rKbPrMiW1k2vYAewZvGYn7OKeW8NoRxKQ2zCTdmr0f9f5Ee3AErlOnN3dii+X5H+TOrqEGi9oXuNSNKeM5fSA/z8ilcqtv/8OMvIu7iAHHOs7Zqg66FE7525oYxgGlY3ep7i8/6p7ij3C4wr7h4wc45hVKWu0XssyWMnDjTT6MUz1fvWk29fAZ9d23Dhs+aF3vnQu0tYKapC9/kfGGNjHPZt2DeKmNw7lY2iuq8eyiLZkWD9k+ZMVMbo3UoO2FM3bq3eHPTIVYXoFoz3R9ff/ey6NnMz3EwUlD5Ymb2kIreU6NhL5r+KZvqYHxvHExnHNN4kML3vwauE/1dDN0lG1lzcEs5UPCsgP9NXuEIQBm8E8bVuRRk/viziOM6Tg3yh2/44RAvQ7nZmyvQ6ABEyXlV70a6I2uEIJxPD1wd9GCZ7ous3XjTMrVHgJwF9e4Y3xwfDE39Jj0pyI3AtXzHNpOtAs+m52coJrDU4/4zieroFKHUGEbpu9RH5jvX6t5S0NTgXDZrhCOfbDnPNuJuuH8z7vTjwcj8n78nGB69p439J5WaMdQJy5Sr6Nt28/xZGRkD5p7fwWF6PZJ2vMai3s8nktdqXop2E2skPFOfdXPePZxIuhhX1BPKCmVo/1iebll+Qch+5WePILz5thDQn/sPAoKm7ETiJnpw0LeCGXkjoNksChpdqf/jhlM/vr7+B8=

// Item events:
//https://groups.google.com/forum/#!topic/paperjs/7HSviqolOA8

//Resize rectangle:
//http://stackoverflow.com/questions/29761368/resize-rectangle-in-paper-js
//http://stackoverflow.com/questions/15129584/how-to-change-only-width-of-pathrect-circle-while-mouse-drag-using-paper-js


//http://stackoverflow.com/questions/32540165/how-to-pan-using-paperjs

//http://stackoverflow.com/search?q=paperjs

//http://stackoverflow.com/questions/16889719/re-size-circle-using-paperjs
