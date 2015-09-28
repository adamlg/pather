var fs = require('fs')

var input = process.argv[2]
var output = process.argv[3]

//sync is much simpler for this stuff, but a regular node server would use async reads and writes.
var inputText = fs.readFileSync(input,'utf8').split('\n')

//just a helper function to stitch some arrays together.
function concat(a,b){return a.concat(b)}

//these nested map statements give us an array of coordinates, row and column, of each #.  we can then loop over those coordinates and figure out where the asterisks should go.
var coords = inputText.map(function(row,rowNum){
	return row.split('').map(function(item,colNum){
		return item === '#' ? [rowNum,colNum] : ''
	}).filter(function(val){return !!val})
}).reduce(concat)

for(var i = 0; i < coords.length-1; i++){
	var firstCoordY = coords[i][0]
	var firstCoordX = coords[i][1]
	var secondCoordY = coords[i+1][0]
	var secondCoordX = coords[i+1][1]

	//do vertical edit first

	//a truthy statement ends up adding 1 to an expression, and falsy adds 0; this loop only goes one extra row if the two X coordinates are not the same.
	for(var j = firstCoordY+1; j < secondCoordY + (firstCoordX !== secondCoordX); j++) {

		//this just adds a single asterisk in the appropriate column.
		inputText[j] = inputText[j].slice(0,firstCoordX) + '*' + inputText[j].slice(firstCoordX+1)
	}

	//do horizontal edit second

	//this helps avoid any weird negative number stuff.
	var left = Math.min(firstCoordX, secondCoordX)
	var right = Math.max(firstCoordX, secondCoordX)

	//everything to the left of the left-most # stays the same...
	var newRow = inputText[secondCoordY].slice(0,left+1)

	//...this loop goes for each character between two sets of coordinates, and adds an asterisk onto our new row...
	for(var k = left+1; k < right; k++){
		newRow += '*'
	}

	//...and finally we replace the right portion of the row, and put the new row into the inputText array.
	inputText[secondCoordY] = newRow + inputText[secondCoordY].slice(right)

}

//write to output file
var outputText = inputText.join('\n')
fs.writeFileSync(output,outputText)