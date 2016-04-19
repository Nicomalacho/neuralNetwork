var synaptic = require('synaptic');
var Firebase = require('firebase');
var dataRef = new Firebase('https://glowing-heat-9839.firebaseio.com/');

module.exports = {
	synaptic : synaptic,
	firebase : dataRef,

}