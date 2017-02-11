"use strict"
var Ozz= require( "./ozzwave")

function main( extra){
	var
	  verbose= parseInt( process.env.V) > 98,
	  options= {
		ConsoleOutput: verbose,
		Logging: false,
		path: process.argv[2]
	  },
	  ozz= new Ozz( options)
	ozz.connect()
	ozz.debugLog()
	if( extra){
		extra.call( ozz)
	}
	return ozz
}

module.exports= main
if( require.main=== module){
	process.nextTick(()=> module.exports())
}
