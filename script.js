let canvasWrapper = document.querySelector('.canvas-wrapper'),
	canvas = document.querySelector('.stage'),
	ctx = canvas.getContext('2d'),
	trials_sine = document.querySelector('.sine'),
	ctx2 = trials_sine.getContext('2d'),
	trials_cosine = document.querySelector('.cosine'),
	ctx3 = trials_cosine.getContext('2d'),
	speed = 0.05,
	ellipse = 1.3,
	tick = 0, 
	height = 300,
	width = height * ellipse,
	ox = width * .5, 
	oy = height * .5,
	px, 
	py,
	radius = height * .25,
	smallRadius = radius * .1,
	PIx2 = Math.PI * 2,
	mcos = Math.cos,
	msin = Math.sin;

canvas.width = trials_sine.width = trials_cosine.width = width;
canvas.height = trials_sine.height = trials_cosine.height = height;
canvas.style.width = trials_sine.style.width = trials_cosine.style.width = width + 'px';
ctx2.fillStyle = '#aaf';
ctx3.fillStyle = '#afa';

function update(){
	/* Increment counter */
	tick += speed;
	/* Calculate px / py based on cosine/sine 
		Multiply by radius as cosine/sine output in range -1 to 1 */
	px = mcos(tick) * radius * ellipse;
	py = msin(tick) * radius;
}

function draw(){
	ctx.clearRect(0, 0, width, height);
	
	/* Draw circumference path */
	ctx.strokeStyle = '#d63';
	ctx.setLineDash([0]);
	ctx.beginPath();
	// This ellipse method is just for the demonstration
		// The ellipical path is controlled by the ellipse variable 
	ctx.ellipse(ox, oy, radius * ellipse, radius, 0, 0, PIx2, false);
	ctx.stroke();
	
	/* Draw orbiting dot */
	ctx.fillStyle = '#d63';
	ctx.beginPath();
	ctx.arc(px + ox, py + oy, smallRadius-1, 0, PIx2, false);
	ctx.fill();
	
	/* Draw Cosine driven dot: x-axis */
	ctx.strokeStyle = '#afa';
	if(showGuideCircles) {
		// Circle
		ctx.setLineDash([0]);
		ctx.beginPath();
		ctx.arc(px + ox, oy, smallRadius, 0, PIx2, false);
		ctx.stroke(); 
		// Line
		ctx.setLineDash([1, 3]);
		ctx.beginPath();
		ctx.moveTo(px + ox, oy - radius);
		ctx.lineTo(px + ox, oy + radius);
		ctx.stroke(); 
	}
	/* Draw Cosine curve */
	let cosineData = ctx3.getImageData(0, 0, width, height);
	ctx3.putImageData(cosineData, 0, -1);
	ctx3.fillRect(px + ox, oy, 1.5, 1.5);
	
	/* Draw Sine driven dot: y-axis */
	ctx.strokeStyle = '#aaf';
	if(showGuideCircles) { 
		// Circle
		ctx.setLineDash([0]);
		ctx.beginPath();
		ctx.arc(ox, py + oy, smallRadius, 0, PIx2, false);
		ctx.stroke();
		// Line
		ctx.setLineDash([2, 3]);
		ctx.beginPath();
		ctx.moveTo(ox - (radius * ellipse), py + oy);
		ctx.lineTo(ox + (radius * ellipse), py + oy);
		ctx.stroke(); 
	}
	/* Draw Sine curve */
	let sineData = ctx2.getImageData(0, 0, width, height);
	ctx2.putImageData(sineData, -1, 0);
	ctx2.fillRect(ox, py + oy, 1.5, 1.5);
}

function animate(){
	update();
	draw();
	requestAnimationFrame(animate);
}

/*************/
/* UI and interactivity properties & methods */
/*************/
let speedSelect = document.querySelector('#speed'),
	ellipseSelect = document.querySelector('#ellipse'),
	speedLabel = document.querySelector('#speed-label'),
	ellipseLabel = document.querySelector('#ellipse-label'),
	showCurves = true,
	showGuideCircles = true;

function setSpeedLabel(){
	speedLabel.innerHTML = 'Speed (' + (speed * 100).toFixed(1) + ')';
}
function setEllipseLabel(){
	ellipseLabel.innerHTML = 'Ellipse (' + (ellipse).toFixed(1) + ')';
}
function updateCurves(){
	showCurves = !showCurves;
	if(showCurves){
		canvasWrapper.classList.remove('hidden');
	}
	else{
		canvasWrapper.classList.add('hidden');
	}
}

speedSelect.value = speed * 1000;
ellipseSelect.value = ellipse * 100;

speedSelect.oninput = function(e) {
	speed = e.target.valueAsNumber * .001;
	setSpeedLabel();
}
ellipseSelect.oninput = function(e) {
	ellipse = e.target.valueAsNumber * .01;
	setEllipseLabel();
}

document.querySelector('.cross').addEventListener('click', () => { updateCurves() });
document.querySelector('.circle').addEventListener('click', () => showGuideCircles = !showGuideCircles);

setSpeedLabel();
setEllipseLabel();

// Kick it all off
animate();