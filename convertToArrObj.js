export const convertToArrObj = arr => {
  var newArrObj = [];
  for (const [key, value] of Object.entries(arr)) {
    newArrObj.push({
    	'name' : key,
      'frequency': value
    })
	}
  
  return newArrObj
}
