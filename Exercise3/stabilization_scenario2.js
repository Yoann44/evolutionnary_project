{
    // here we define a variable for record keeping
    distances : [],    
    // optional function called at the beginning of the simulation
    setupSimulation: function() {
	this.startPos = this.getRobot().getCoreComponent().getRootPosition();
	this.startOr = this.getRobot().getCoreComponent().getRootAttitude();
	this.intermFitness = 0;

	return true;
    },

    // optional function called after each step of simulation
    afterSimulationStep: function() {
	//this.intermFitness = 3.14159 - Math.acos(this.getRobot().getCoreComponent().getRootAttitude().x);

	//this.quatx = this.getRobot().getCoreComponent().getRootAttitude().x;
	//this.quaty = this.getRobot().getCoreComponent().getRootAttitude().y;
	//this.quatz = this.getRobot().getCoreComponent().getRootAttitude().z;
	//this.quatw = this.getRobot().getCoreComponent().getRootAttitude().w;

	q0 = this.getRobot().getCoreComponent().getRootAttitude().x;
	q1 = this.getRobot().getCoreComponent().getRootAttitude().y;
	q2 = this.getRobot().getCoreComponent().getRootAttitude().z;
	q3 = this.getRobot().getCoreComponent().getRootAttitude().w;
	
	this.eulerZ = Math.abs(Math.asin(2*(q0*q2-q3*q1))*180/3.14159);	
	
	this.intermFitness = this.intermFitness + Math.exp(-this.eulerZ);
	//console.log("euler intermfitness: " + this.intermFitness);

	return true;
    },

    // optional function called at the end of the simulation
    endSimulation: function() {

	// Compute robot ending position from its closest part to the origin
	var minDistance = Number.MAX_VALUE;
	
	bodyParts = this.getRobot().getBodyParts();
	//console.log(this.startOr.x + "quat");
	//console.log(this.getRobot().getCoreComponent().getRootPosition().x + " quat");
	//console.log(bodyParts.length + " body parts");
	for (var i = 0; i < bodyParts.length; i++) {
		var xDiff = (bodyParts[i].getRootPosition().x - this.startPos.x);
		var yDiff = (bodyParts[i].getRootPosition().y - this.startPos.y);
		var dist = Math.sqrt(Math.pow(xDiff,2) + Math.pow(yDiff,2));
                
		if (dist < minDistance) {
			minDistance = dist;
		}
	}
	
	this.distances.push(minDistance);
	return true;
    },
    // the one required method... return the fitness!
    // here we return minimum distance travelled across evaluations
    getFitness: function() {

	//console.log("distance " + this.distances[0]);
	//console.log("stabilite " + this.intermFitness);

        for (var i=1; i<this.distances.length; i++) {
		if (this.distances[i] < fitness)
			fitness = this.distances[i];
	}
	
	console.log("Distance fitness :" + this.distances[0] + "; Angle fitness : "+ this.intermFitness/400);
	fitness = this.distances[0] - this.intermFitness/400;
        return fitness;
    },

}
