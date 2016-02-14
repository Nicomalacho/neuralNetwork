/**
 * NeuralController
 *
 * @description :: Server-side logic for managing Neurals
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var synaptic = utilService.synaptic;

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
		/*myNetwork.activate([0,0]); // [0.015020775950893527]
		myNetwork.activate([0,1]); // [0.9815816381088985]
		myNetwork.activate([1,0]); // [0.9871822457132193]
		myNetwork.activate([1,1]); // [0.012950087641929467]*/
		var exported = myNetwork.toJSON();
		var conections = exported["connections"]["0"]["weight"];
		var other = myNetwork.layers.input.list;
		console.log(exported);	

		return res.view('separabilidad/double', {
		    myNetwork: exported
		  });
    /*return res.json({    	
        '0-0': myNetwork.activate([0,0]), // [0.015020775950893527]
		'0-1': myNetwork.activate([0,1]), // [0.9815816381088985]
		'1-0': myNetwork.activate([1,0]), // [0.9871822457132193]
		'1-1': myNetwork.activate([1,1]), // [0.012950087641929467]
    });*/

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

