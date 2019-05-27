{
    // here we define a variable for record keeping
    distances : [],    
    // optional function called at the beginning of the simulation
    setupSimulation: function() {
	this.startPos = this.getRobot().getCoreComponent().getRootPosition();
	this.startOr = this.getRobot().getCoreComponent().getRootAttitude();
	this.intermFitnessTheta = 1.0;
	this.intermFitnessPhi = 1.0;
	this.intermFitnessPsi = 1.0;

	this.startTheta = Math.atan2(2*(this.startOr.w*this.startOr.x + this.startOr.y*this.startOr.z), 1 - 2*(this.startOr.x*this.startOr.x + this.startOr.y*this.startOr.y));
	this.startPhi = Math.asin(2*(this.startOr.w*this.startOr.y - this.startOr.z*this.startOr.x));
	this.startPsi = Math.atan2(2*(this.startOr.w*this.startOr.z + this.startOr.x*this.startOr.y), 1 - 2*(this.startOr.y*this.startOr.y + this.startOr.z*this.startOr.z));

	//console.log("Last angles - Theta:" + this.startTheta + ", Phi:" + this.startPhi + ", Psi:" + this.startPsi);

	return true;
    },

    // optional function called after each step of simulation
    afterSimulationStep: function() {
		var currentOr =  this.getRobot().getCoreComponent().getRootAttitude();
		var currentTheta = Math.atan2(2*(currentOr.w*currentOr.x + currentOr.y*currentOr.z), 1 - 2*(currentOr.x*currentOr.x + currentOr.y*currentOr.y));
		var currentPhi = Math.asin(2*(currentOr.w*currentOr.y - currentOr.z*currentOr.x));
		var currentPsi = Math.atan2(2*(currentOr.w*currentOr.z + currentOr.x*currentOr.y), 1 - 2*(currentOr.y*currentOr.y + currentOr.z*currentOr.z));

		//console.log("Phi : " + currentPhi + ", Theta : " + currentTheta);

		var diffPhi = Math.abs(currentPhi - this.startPhi);
		if(diffPhi >= 3.14159) {
			diffPhi =  diffPhi - 2.0 * 3.14159;
		}

		var diffTheta = Math.abs(currentTheta - this.startTheta);
		if(diffTheta >= 3.14159) {
			diffTheta =  diffTheta - 2.0 * 3.14159;
		}

		var diffPsi = Math.abs(currentPsi - this.startPsi);
		if(diffPsi >= 3.14159) {
			diffPsi =  diffPsi - 2.0 * 3.14159;
		}

		//console.log("Phi : " + Math.abs(diffPhi/3.14159) + ", Theta : " + Math.abs(diffTheta/3.14159));

		this.intermFitnessTheta = this.intermFitnessTheta + (1 - 2 * Math.abs(diffTheta/3.14159));
		this.intermFitnessPhi = this.intermFitnessPhi + (1 - 2 * Math.abs(diffPhi/3.14159));
		this.intermFitnessPsi = this.intermFitnessPsi + (1 - 2 * Math.abs(diffPsi/3.14159));

		this.lastTheta = currentTheta * 180 / 3.14159;
		this.lastPhi = currentPhi * 180 / 3.14159;
		this.lastPsi = currentPsi * 180 / 3.14159;

		return true;
    },

    // optional function called at the end of the simulation
    endSimulation: function() {

		// Compute robot ending position from its closest part to the origin
		var minDistance = Number.MAX_VALUE;
		        
		bodyParts = this.getRobot().getBodyParts();
		console.log(bodyParts.length + " body parts");
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
		fitness = this.distances[0];
	        for (var i=1; i<this.distances.length; i++) {
			if (this.distances[i] < fitness)
				fitness = this.distances[i];
		}

		this.intermFitnessTheta = this.intermFitnessTheta / 10 * 0.02;
		this.intermFitnessPhi = this.intermFitnessPhi / 10 * 0.02;
		this.intermFitnessPsi = this.intermFitnessPsi / 10 * 0.02;
		
		console.log("Angle fitness - Theta:" + this.intermFitnessTheta + ", Phi:" + this.intermFitnessPhi + ", Psi:" + this.intermFitnessPsi);

		//console.log("Last angles - Theta:" + this.lastTheta + ", Phi:" + this.lastPhi + ", Psi:" + this.lastPsi);

		console.log("Distance fitness : " + fitness);
		var angle_fit = this.intermFitnessTheta * this.intermFitnessPsi;

		if(angle_fit > 0.75) {
			angle_fit = -3.0 * (1.0 - angle_fit) + 1.0;
		}
		else {
			angle_fit = -1.0/3.0 * (1.0 - angle_fit) + 1.0/3.0;
		}

		console.log("Total fitness : " + fitness * angle_fit);
	    return fitness * this.intermFitnessTheta * this.intermFitnessPsi;
    },

}
