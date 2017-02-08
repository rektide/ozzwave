"use strict"
var
  camelCase= require( "./camelCase")

/**
 * Table for demarshalling zwave events from their 
 * [compact node-openzwave-shared form](https://github.com/OpenZWave/node-openzwave-shared/blob/master/README-events.md).
 */
var eventMap= {
	"driver ready":{ name:"ready", category: "driver", args:[  "homeId"]},
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
	"value added":{ name: "added", category:"value", args:[ "nodeId", "classId", "valueId"]},
	"value changed":{ name: "changed", category:"value", args:[ "nodeId", "classId", "valueId"]},
	"value refreshed":{ name: "refreshed", category:"value", args:[ "nodeId", "classId", "valueId"]},
	"value removed":{ name: "removed", category:"value", args:[ "nodeId", "classId", "instance", "index"]},
	"controller command":{ name:"command", category:"driver", args:[ "nodeId", "state", "error", "help"]},
	"notification":{ name:"notification", category:"node", args:["nodeId", "notification"]}
}

/*
 * Generate a `become` property, identifying an arg to use as the event, with other args attached onto it.
 * For example "node available" has a nodeAvailableInfo that is the main payload of the event. Rather than
 * leave this payload as a nested object, the become property signals that this should be the base object
 * and have the other fields added to it, as opposed to being added to a blank object.
 */
for( var eventType in eventMap){
	var t= eventMap[eventType]
	t.eventName= camelCase( t.category+ '_'+ t.name)
	
	if( !t.become){
		var info= new RegExp(t.category+ ".*"+ "Info")
		var id= new RegExp(t.category+ ".*"+ "Id")
		for( var key of t.args){
			if( info.test( key)){
				t.become= key
			}else if( !t.become&& id.test( key)){
				t.become= key
			}
		}
	}
}

module.exports= eventMap
