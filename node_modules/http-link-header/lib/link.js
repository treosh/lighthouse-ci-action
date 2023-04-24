'use strict'

var COMPATIBLE_ENCODING_PATTERN = /^utf-?8|ascii|utf-?16-?le|ucs-?2|base-?64|latin-?1$/i
var WS_TRIM_PATTERN = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
var WS_CHAR_PATTERN = /\s|\uFEFF|\xA0/
var WS_FOLD_PATTERN = /\r?\n[\x20\x09]+/g
var DELIMITER_PATTERN = /[;,"]/
var WS_DELIMITER_PATTERN = /[;,"]|\s/

/**
 * Token character pattern
 * @type {RegExp}
 * @see https://tools.ietf.org/html/rfc7230#section-3.2.6
 */
var TOKEN_PATTERN = /^[!#$%&'*+\-\.^_`|~\da-zA-Z]+$/

var STATE = {
  IDLE: 1 << 0,
  URI: 1 << 1,
  ATTR: 1 << 2,
}

function trim( value ) {
  return value.replace( WS_TRIM_PATTERN, '' )
}

function hasWhitespace( value ) {
  return WS_CHAR_PATTERN.test( value )
}

function skipWhitespace( value, offset ) {
  while( hasWhitespace( value[offset] ) ) {
    offset++
  }
  return offset
}

function needsQuotes( value ) {
  return WS_DELIMITER_PATTERN.test( value ) ||
    !TOKEN_PATTERN.test( value )
}

/**
 * Shallow compares two objects to check if their properties match.
 * @param {object} object1 First object to compare.
 * @param {object} object2 Second object to compare.
 * @returns {boolean} Do the objects have matching properties.
 */
function shallowCompareObjects( object1, object2 ) {
  return (
    Object.keys( object1 ).length === Object.keys( object2 ).length &&
    Object.keys( object1 ).every(
      ( key ) => key in object2 && object1[ key ] === object2[ key ]
    )
  );
}

class Link {

  /**
   * Link
   * @constructor
   * @param {String} [value]
   * @returns {Link}
   */
  constructor( value ) {

    /** @type {Array} URI references */
    this.refs = []

    if( value ) {
      this.parse( value )
    }

  }

  /**
   * Get refs with given relation type
   * @param {String} value
   * @returns {Array<Object>}
   */
  rel( value ) {

    var links = []
    var type = value.toLowerCase()

    for( var i = 0; i < this.refs.length; i++ ) {
      if( this.refs[ i ].rel.toLowerCase() === type ) {
        links.push( this.refs[ i ] )
      }
    }

    return links

  }

  /**
   * Get refs where given attribute has a given value
   * @param {String} attr
   * @param {String} value
   * @returns {Array<Object>}
   */
  get( attr, value ) {

    attr = attr.toLowerCase()

    var links = []

    for( var i = 0; i < this.refs.length; i++ ) {
      if( this.refs[ i ][ attr ] === value ) {
        links.push( this.refs[ i ] )
      }
    }

    return links

  }

  /** Sets a reference. */
  set( link ) {
    this.refs.push( link )
    return this
  }

  /**
   * Sets a reference if a reference with similar properties isn’t already set.
   */
  setUnique( link ) {

    if( !this.refs.some(( ref ) => shallowCompareObjects( ref, link )) ) {
      this.refs.push( link )
    }

    return this

  }

  has( attr, value ) {

    attr = attr.toLowerCase()

    for( var i = 0; i < this.refs.length; i++ ) {
      if( this.refs[ i ][ attr ] === value ) {
        return true
      }
    }

    return false

  }

  parse( value, offset ) {

    offset = offset || 0
    value = offset ? value.slice( offset ) : value

    // Trim & unfold folded lines
    value = trim( value ).replace( WS_FOLD_PATTERN, '' )

    var state = STATE.IDLE
    var length = value.length
    var offset = 0
    var ref = null

    while( offset < length ) {
      if( state === STATE.IDLE ) {
        if( hasWhitespace( value[offset] ) ) {
          offset++
          continue
        } else if( value[offset] === '<' ) {
          if( ref != null ) {
            ref.rel != null ?
              this.refs.push( ...Link.expandRelations( ref ) ) :
              this.refs.push( ref )
          }
          var end = value.indexOf( '>', offset )
          if( end === -1 ) throw new Error( 'Expected end of URI delimiter at offset ' + offset )
          ref = { uri: value.slice( offset + 1, end ) }
          // this.refs.push( ref )
          offset = end
          state = STATE.URI
        } else {
          throw new Error( 'Unexpected character "' + value[offset] + '" at offset ' + offset )
        }
        offset++
      } else if( state === STATE.URI ) {
        if( hasWhitespace( value[offset] ) ) {
          offset++
          continue
        } else if( value[offset] === ';' ) {
          state = STATE.ATTR
          offset++
        } else if( value[offset] === ',' ) {
          state = STATE.IDLE
          offset++
        } else {
          throw new Error( 'Unexpected character "' + value[offset] + '" at offset ' + offset )
        }
      } else if( state === STATE.ATTR ) {
        if( value[offset] ===';' || hasWhitespace( value[offset] ) ) {
          offset++
          continue
        }
        var end = value.indexOf( '=', offset )
        if( end === -1 ) end = value.indexOf( ';', offset )
        if( end === -1 ) end = value.length
        var attr = trim( value.slice( offset, end ) ).toLowerCase()
        var attrValue = ''
        offset = end + 1
        offset = skipWhitespace( value, offset )
        if( value[offset] === '"' ) {
          offset++
          while( offset < length ) {
            if( value[offset] === '"' ) {
              offset++; break
            }
            if( value[offset] === '\\' ) {
              offset++
            }
            attrValue += value[offset]
            offset++
          }
        } else {
          var end = offset + 1
          while( !DELIMITER_PATTERN.test( value[end] ) && end < length ) {
            end++
          }
          attrValue = value.slice( offset, end )
          offset = end
        }
        if( ref[ attr ] && Link.isSingleOccurenceAttr( attr ) ) {
          // Ignore multiples of attributes which may only appear once
        } else if( attr[ attr.length - 1 ] === '*' ) {
          ref[ attr ] = Link.parseExtendedValue( attrValue )
        } else {
          attrValue = attr === 'type' ?
            attrValue.toLowerCase() : attrValue
          if( ref[ attr ] != null ) {
            if( Array.isArray( ref[ attr ] ) ) {
              ref[ attr ].push( attrValue )
            } else {
              ref[ attr ] = [ ref[ attr ], attrValue ]
            }
          } else {
            ref[ attr ] = attrValue
          }
        }
        switch( value[offset] ) {
          case ',': state = STATE.IDLE; break
          case ';': state = STATE.ATTR; break
        }
        offset++
      } else {
        throw new Error( 'Unknown parser state "' + state + '"' )
      }
    }

    if( ref != null ) {
      ref.rel != null ?
        this.refs.push( ...Link.expandRelations( ref ) ) :
        this.refs.push( ref )
    }

    ref = null

    return this

  }

  toString() {

    var refs = []
    var link = ''
    var ref = null

    for( var i = 0; i < this.refs.length; i++ ) {
      ref = this.refs[i]
      link = Object.keys( this.refs[i] ).reduce( function( link, attr ) {
        if( attr === 'uri' ) return link
        return link + '; ' + Link.formatAttribute( attr, ref[ attr ] )
      }, '<' + ref.uri + '>' )
      refs.push( link )
    }

    return refs.join( ', ' )

  }

}

/**
 * Determines whether an encoding can be
 * natively handled with a `Buffer`
 * @param {String} value
 * @returns {Boolean}
 */
Link.isCompatibleEncoding = function( value ) {
  return COMPATIBLE_ENCODING_PATTERN.test( value )
}

Link.parse = function( value, offset ) {
  return new Link().parse( value, offset )
}

Link.isSingleOccurenceAttr = function( attr ) {
  return attr === 'rel' || attr === 'type' || attr === 'media' ||
    attr === 'title' || attr === 'title*'
}

Link.isTokenAttr = function( attr ) {
  return attr === 'rel' || attr === 'type' || attr === 'anchor'
}

Link.escapeQuotes = function( value ) {
  return value.replace( /"/g, '\\"' )
}

Link.expandRelations = function( ref ) {
  var rels = ref.rel.split( ' ' )
  return rels.map( function( rel ) {
    var value = Object.assign( {}, ref )
    value.rel = rel
    return value
  })
}

/**
 * Parses an extended value and attempts to decode it
 * @internal
 * @param {String} value
 * @return {Object}
 */
Link.parseExtendedValue = function( value ) {
  var parts = /([^']+)?(?:'([^']*)')?(.+)/.exec( value )
  return {
    language: parts[2].toLowerCase(),
    encoding: Link.isCompatibleEncoding( parts[1] ) ?
      null : parts[1].toLowerCase(),
    value: Link.isCompatibleEncoding( parts[1] ) ?
      decodeURIComponent( parts[3] ) : parts[3]
  }
}

/**
 * Format a given extended attribute and it's value
 * @param {String} attr
 * @param {Object} data
 * @return {String}
 */
Link.formatExtendedAttribute = function( attr, data ) {

  var encoding = ( data.encoding || 'utf-8' ).toUpperCase()
  var language = data.language || 'en'

  var encodedValue = ''

  if( Buffer.isBuffer( data.value ) && Link.isCompatibleEncoding( encoding ) ) {
    encodedValue = data.value.toString( encoding )
  } else if( Buffer.isBuffer( data.value ) ) {
    encodedValue = data.value.toString( 'hex' )
      .replace( /[0-9a-f]{2}/gi, '%$1' )
  } else {
    encodedValue = encodeURIComponent( data.value )
  }

  return attr + '=' + encoding + '\'' +
    language + '\'' + encodedValue

}

/**
 * Format a given attribute and it's value
 * @param {String} attr
 * @param {String|Object} value
 * @return {String}
 */
Link.formatAttribute = function( attr, value ) {

  if( Array.isArray( value ) ) {
    return value.map(( item ) => {
      return Link.formatAttribute( attr, item )
    }).join( '; ' )
  }

  if( attr[ attr.length - 1 ] === '*' || typeof value !== 'string' ) {
    return Link.formatExtendedAttribute( attr, value )
  }

  if( Link.isTokenAttr( attr ) ) {
    value = needsQuotes( value ) ?
      '"' + Link.escapeQuotes( value ) + '"' :
      Link.escapeQuotes( value )
  } else if( needsQuotes( value ) ) {
    value = encodeURIComponent( value )
    // We don't need to escape <SP> <,> <;> within quotes
    value = value
      .replace( /%20/g, ' ' )
      .replace( /%2C/g, ',' )
      .replace( /%3B/g, ';' )

    value = '"' + value + '"'
  }

  return attr + '=' + value

}

module.exports = Link
