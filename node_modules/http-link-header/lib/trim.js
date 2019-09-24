module.exports = function trim( value ) {
  return value.replace( /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '' )
}
