var main= require( "../main")

// try to setup an power strip to monitor watts frequently, and hail back if watt level changes
function setup( nodeId){
	nodeId= nodeId|| 1
	this.setValue(nodeId, 112, 1, 80, "Hail") // hailing notifications
	this.setValue(nodeId, 112, 1, 5, 4) // whole strip watts
	this.setValue(nodeId, 112, 1, 6, 4) // socket 1-6 watts
	this.setValue(nodeId, 112, 1, 7, 4)
	this.setValue(nodeId, 112, 1, 8, 4)
	this.setValue(nodeId, 112, 1, 9, 4)
	this.setValue(nodeId, 112, 1, 10, 4)
	this.setValue(nodeId, 112, 1, 11, 4)
	this.setValue(nodeId, 112, 1, 111, 20) // poll 20s
	this.setValue(nodeId, 112, 1, 101, w) // report group sends watts
}

if( require.main=== module){
	main( setup)
}

