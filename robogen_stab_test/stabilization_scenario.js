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
	this.intermFitness = Math.abs(this.startOr.x - this.getRobot().getCoreComponent().getRootAttitude().x) + Math.abs(this.startOr.y - this.getRobot().getCoreComponent().getRootAttitude().y) + Math.abs(this.startOr.z - this.getRobot().getCoreComponent().getRootAttitude().z) + Math.abs(this.startOr.w - this.getRobot().getCoreComponent().getRootAttitude().w);
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
	fitness = 1 - this.intermFitness;
        return fitness;
    },

}
