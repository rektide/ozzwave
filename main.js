var Ozz= require( "./ozz")

function main( extra){
	var
	  verbose= parseInt( process.env.V) > 99,
	  options= {
		ConsoleOutput: verbose
	  },
	  ozz= new Ozz( process.argv[ 2], options)
	ozz.debugLog()
	ozz.connect()
	if( extra){
		extra.call( ozz)
	}
	return ozz
}

module.exports= main
if( require.main=== module){
	process.nextTick(()=> module.exports())
}
