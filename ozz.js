var
  fs= require("fs"),
  OpenZwave= require("openzwave-shared"),
  util= require("util")

function factory( path, options){
	if(this instanceof factory){
		throw new Error("Invalid use of 'new'")
	}
	if( typeof path=== "object"){
		options= path
		path= undefined
	}
	path= path|| "/dev/ttyACM0"
	options= options|| {}

	var zwave= new OpenZwave(options)
	Object.setPrototypeOf(zwave, Ozz.prototype)
	zwave.path= path
	return zwave
}

function Ozz(){}
util.inherits(Ozz, OpenZwave)

// table for demarshalling zwave event
// https://github.com/OpenZWave/node-openzwave-shared/blob/master/README-events.md
var _type= "a.eldergods.com/ozz"
Ozz.eventMap= {
	"driver ready":{ name:"ready", category: "driver", args:[  "homeid"]},
	"driver failed":{ name:"failed", category: "driver", args:[ ]},
	"scan complete":{ name:"complete", category: "driver", args:[ ]},
	"node added":{ name:"added", category: "node", args:[ "nodeId"]},
	"node removed":{ name: "removed", category: "node", args:[ "nodeId"]},
	"node naming":{ name: "naming", category: "node", args:[ "nodeId", "nodeInfo"]},
	"node available":{ name: "available", category: "node", args:[ "nodeId", "nodeAvailableInfo"]},
	"node ready":{ name: "ready", category: "node", args:[ "nodeId", "nodeInfo"]},
	"polling enabled/disabled":{ name: "polling", category: "node", args:[ "nodeId"]},
	"scene event":{ name: "scene", category: "node", args:[ "nodeId", "eventId"]},
	"node event":{ name:"event", category: "node", args:[ "nodeId", "data"]},
	"value added":{ name: "added", category:"value", args:[ "nodeId", "commandClass", "valueId"]},
	"value changed":{ name: "changed", category:"value", args:[ "nodeId", "commandClass", "valueId"]},
	"value refreshed":{ name: "refreshed", category:"value", args:[ "nodeId", "commandClass", "valueId"]},
	"value removed":{ name: "removed", category:"value", args:[ "nodeId", "commandClass", "instance", "index"]},
	"controller command":{ name:"command", category:"driver", args:[ "nodeId", "state", "error", "help"]},
}

Ozz.prototype.eventLog= function(eventNames){
	var log= fs.createWriteStream("log.ndjson", {flags: "a"})
	log.write(JSON.stringify({"eventType": "ozz startup"}))
	log.write("\n");
	var realizer= (eventType)=> {
		return function( ...args){
			var
			  o= {eventType, timestamp: Date.now()},
			  t= Ozz.eventMap[ eventType]
			for( var i in t.args){
				var key= t.args[ i]
				o[ key]= args[ i]
			}
			if( log){
				log.write(JSON.stringify( o))
				log.write( "\n")
			}
		}
	}

	var listen= (eventType)=> this.on( eventType, realizer( eventType));
	for(var eventType of Object.keys(Ozz.eventMap)){
		listen( eventType)
	}
}

var _connect= OpenZwave.prototype.connect
Ozz.prototype.connect= function(path){
	_connect.call( this, path|| this.path)
}

function main(){
	var zwave= module.exports(process.argv[2], {
		ConsoleOutput: false
	})
	zwave.eventLog()
	zwave.connect()
	return zwave
}

module.exports= factory
module.exports.main= main

if(require.main=== module){
	main()
}
