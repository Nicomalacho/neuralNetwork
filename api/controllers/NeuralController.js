/**
 * NeuralController
 *
 * @description :: Server-side logic for managing Neurals
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var synaptic = utilService.synaptic;
var dataRef = utilService.firebase;
	
var refUsers = new Firebase('https://glowing-heat-9839.firebaseio.com/users');
var refTest = new Firebase('https://glowing-heat-9839.firebaseio.com/test');
//var neuralRef = new Firebase('https://glowing-heat-9839.firebaseio.com/neuralNetwork');

module.exports = {

  initial: function (req, res) {		
		// create the network
		var inputLayer = new synaptic.Layer(2);
		var hiddenLayer = new synaptic.Layer(2);
		var outputLayer = new synaptic.Layer(1);

		inputLayer.project(hiddenLayer);
		hiddenLayer.project(outputLayer);

		var myNetwork = new synaptic.Network({
		    input: inputLayer,
		    hidden: [hiddenLayer],
		    output: outputLayer
		});

		// train the network
		var learningRate = .3;
		for (var i = 0; i < 2000000; i++)
		{
		    // 0,0 => 0
		    myNetwork.activate([0,0]);
		    myNetwork.propagate(learningRate, [0]);

		    // 0,1 => 1
		    myNetwork.activate([0,1]);
		    myNetwork.propagate(learningRate, [1]);

		    // 1,0 => 1
		    myNetwork.activate([1,0]);
		    myNetwork.propagate(learningRate, [1]);

		    // 1,1 => 0
		    myNetwork.activate([1,1]);
		    myNetwork.propagate(learningRate, [0]);
		}
		var exported = myNetwork.toJSON();
		var conections = exported["connections"]["0"]["weight"];
		var other = myNetwork.layers.input.list;
		console.log(exported);	

		return res.view('separabilidad/simple', {
		    myNetwork: exported
		  });
  },
  change: function(req,res){
  	var	users = this.getClients();
  	var final = [];
  	users.forEach(function(user){
  		user.Y = user.Y/100;
  		user.out = user.Y;
  		delete user.Y;
  		delete user.k;
  		final.push(user);
  	});
  	return res.json(final);
  	
  },

  double: function(req,res){

  	var impNetwork = synaptic.Network.fromJSON(this.getNeuralNetwork());
  	console.log(impNetwork);
  	var standalone = impNetwork.standalone();
  	var error = this.getError(standalone);


  	// return res.json(error);
  	return res.view('separabilidad/double');
  },
  train: function(req,res){

 	return res.view('separabilidad/train');

  },
  neuralTrainer: function(req,res){

  		hidden = parseInt(req.param("hidden"));
  		// console.log(hidden);
	 	var users = this.getClients(refUsers);
	 	//console.log(users["0"].Bias);
	 	//var hiddenNeurons = hidden;
	 	var erNet=[];
		var inputLayer = new synaptic.Layer(7);
		var hiddenLayer = new synaptic.Layer(hidden);
		var outputLayer = new synaptic.Layer(1);

		inputLayer.project(hiddenLayer);
		hiddenLayer.project(outputLayer);

		var myNetwork = new synaptic.Network({
		    input: inputLayer,
		    hidden: [hiddenLayer],
		    output: outputLayer
		});
		var trainingSet = this.trainStruct(users);
		var trainer = new synaptic.Trainer(myNetwork);	
		trainer.train(trainingSet,{
		    rate: .03,
		    iterations: 200000000000,
		    error: .005,
		    schedule: {
			    every: 500, // repeat this task every 500 iterations
			    do: function(data) {
			    	var e = parseFloat(data.error);
			    	erNet.push(e*100);
			    }

			}
		});

		var exported = myNetwork.toJSON();
		var neuralRef = dataRef.child("neuralNetwork");
		//neuralRef.push(exported);

		var standalone = myNetwork.standalone();
	  	var error = this.getError(standalone);
	  	console.log(hidden);

		return res.json(erNet);
  },
  getError: function(standalone) {
  	var ers = [];
  	var error;

  	tests = this.getClients(refTest);
  	tests.forEach(function(test){
  		var sVal = parseFloat(standalone([test.Bias,test.Edad,test.Egresos,test.Estrato,test.Ingresos,test.Monto,test.Perscargo]));
  		//var ecm = (Math.abs(parseFloat(sVal)-parseFloat(test.out))^2)/2;
  		//console.log("valor objetivo: " + test.out + "\n" + "valor obtenido: " + sVal + "\n");
  		var ecm = Math.abs(parseFloat(sVal)-parseFloat(test.out));
  		var ec2 = (ecm^2)/2;
  		ers.push(ecm);
  	
  	});


  	return ers;
  },
  trainStruct: function(users){
  	var trainingSet = [];
  	users.forEach(function(user){
  		trainingSet.push({
  			input: [user.Bias,user.Edad,user.Egresos,user.Estrato,user.Ingresos,user.Monto,user.Perscargo],
  			output: [user.out]
  		});
  	});
	return trainingSet;
  },
  getClients: function (ref) {
  	
  	var users = [];
    ref.on("value", function(snapshot) {
    	snapshot.forEach(function(childSnapshot) {
	        users.push(childSnapshot.val());
	    });
	});
  	return users;
  },
  getNeuralNetwork: function(){
  	var nw = [];
  	var neuralRef = dataRef.child("neuralNetwork");
  	neuralRef.on("value", function(snapshot) {
	   nw = snapshot.val();	   
	});
	
	return nw["-KFFcqLbGci9HIxWCvX7"]; // 8
	//return nw["-KFDW5JGDfQWeB324ksQ"]; // 5
  	//return nw["-KFDDEVyHWNlCeUIGJbL"]; // 9
  	// return nw["-KFDUvE6_2o56TSKHhDW"]; //10
  	
  	// return nw["-KFDSUDnucJwHQGk-obF"]; // 12
  },
  /**
   * CommentController.create()
   */
  create: function (req, res) {
  	
    return res.json({
      todo: 'Not implemented yet!'
    });
  },

  /**
   * CommentController.destroy()
   */
  destroy: function (req, res) {
    return res.json({
      todo: 'Not implemented yet!'
    });
  },

  /**
   * CommentController.tag()
   */
  tag: function (req, res) {
    return res.json({
      todo: 'Not implemented yet!'
    });
  },

  /**
   * CommentController.like()
   */
  like: function (req, res) {
    return res.json({
      todo: 'Not implemented yet!'
    });
  }	
};

