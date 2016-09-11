var
  OpenZwave= require("openzwave-shared"),
  util= require("util")

function PromZwave( path, options){
	if(!( this instanceof PromZwave)){
		return new PromZwave( path, options)
	}
	if( typeof path=== "object"){
		options= path
		path= undefined
	}
	if( !path){
		path= "/dev/ttyUSB0"
	}
	OpenZwave.call(this, path, options)
	return this
}
util.inherits(PromZwave, OpenZwave)

PromZwave.prototype.eventLog= function(eventNames){
	var logHandler= (eventName)=> {
		return ()=> {
			var args= Array.prototype.slice.call(0, arguments, this.logDepth+1)
		}
	}
	['driver ready',
		'driver failed',
		'scan complete',
		'node added',
		'node available',
		'node event'
	].forEach(function(eventName){
		this.on(eventName, logHandler(eventName))
	})
}

PromZwave.prototype.logDepth= 1

function main(){
	var zwave= PromZwave(process.argv[2])
	zwave.eventLog()
	zwave.connect()
	return zwave
}

module.exports= PromZwave
module.exports.PromZwave= PromZwave
module.exports.main= main

if(require.main=== module){
	main()
}
