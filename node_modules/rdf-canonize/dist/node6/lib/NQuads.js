/*
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const TERMS = ['subject', 'predicate', 'object', 'graph'];
const RDF = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
const RDF_LANGSTRING = RDF + 'langString';
const XSD_STRING = 'http://www.w3.org/2001/XMLSchema#string'; // build regexes

const REGEX = {};

(() => {
  const iri = '(?:<([^:]+:[^>]*)>)'; // https://www.w3.org/TR/turtle/#grammar-production-BLANK_NODE_LABEL

  const PN_CHARS_BASE = 'A-Z' + 'a-z' + '\u00C0-\u00D6' + '\u00D8-\u00F6' + '\u00F8-\u02FF' + '\u0370-\u037D' + '\u037F-\u1FFF' + '\u200C-\u200D' + '\u2070-\u218F' + '\u2C00-\u2FEF' + '\u3001-\uD7FF' + '\uF900-\uFDCF' + '\uFDF0-\uFFFD'; // TODO:
  //'\u10000-\uEFFFF';

  const PN_CHARS_U = PN_CHARS_BASE + '_';
  const PN_CHARS = PN_CHARS_U + '0-9' + '-' + '\u00B7' + '\u0300-\u036F' + '\u203F-\u2040';
  const BLANK_NODE_LABEL = '(_:' + '(?:[' + PN_CHARS_U + '0-9])' + '(?:(?:[' + PN_CHARS + '.])*(?:[' + PN_CHARS + ']))?' + ')';
  const bnode = BLANK_NODE_LABEL;
  const plain = '"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"';
  const datatype = '(?:\\^\\^' + iri + ')';
  const language = '(?:@([a-zA-Z]+(?:-[a-zA-Z0-9]+)*))';
  const literal = '(?:' + plain + '(?:' + datatype + '|' + language + ')?)';
  const ws = '[ \\t]+';
  const wso = '[ \\t]*'; // define quad part regexes

  const subject = '(?:' + iri + '|' + bnode + ')' + ws;
  const property = iri + ws;
  const object = '(?:' + iri + '|' + bnode + '|' + literal + ')' + wso;
  const graphName = '(?:\\.|(?:(?:' + iri + '|' + bnode + ')' + wso + '\\.))'; // end of line and empty regexes

  REGEX.eoln = /(?:\r\n)|(?:\n)|(?:\r)/g;
  REGEX.empty = new RegExp('^' + wso + '$'); // full quad regex

  REGEX.quad = new RegExp('^' + wso + subject + property + object + graphName + wso + '$');
})();

module.exports = class NQuads {
  /**
   * Parses RDF in the form of N-Quads.
   *
   * @param input the N-Quads input to parse.
   *
   * @return an RDF dataset (an array of quads per http://rdf.js.org/).
   */
  static parse(input) {
    // build RDF dataset
    const dataset = [];
    const graphs = {}; // split N-Quad input into lines

    const lines = input.split(REGEX.eoln);
    let lineNumber = 0;

    for (const line of lines) {
      lineNumber++; // skip empty lines

      if (REGEX.empty.test(line)) {
        continue;
      } // parse quad


      const match = line.match(REGEX.quad);

      if (match === null) {
        throw new Error('N-Quads parse error on line ' + lineNumber + '.');
      } // create RDF quad


      const quad = {}; // get subject

      if (match[1] !== undefined) {
        quad.subject = {
          termType: 'NamedNode',
          value: match[1]
        };
      } else {
        quad.subject = {
          termType: 'BlankNode',
          value: match[2]
        };
      } // get predicate


      quad.predicate = {
        termType: 'NamedNode',
        value: match[3]
      }; // get object

      if (match[4] !== undefined) {
        quad.object = {
          termType: 'NamedNode',
          value: match[4]
        };
      } else if (match[5] !== undefined) {
        quad.object = {
          termType: 'BlankNode',
          value: match[5]
        };
      } else {
        quad.object = {
          termType: 'Literal',
          value: undefined,
          datatype: {
            termType: 'NamedNode'
          }
        };

        if (match[7] !== undefined) {
          quad.object.datatype.value = match[7];
        } else if (match[8] !== undefined) {
          quad.object.datatype.value = RDF_LANGSTRING;
          quad.object.language = match[8];
        } else {
          quad.object.datatype.value = XSD_STRING;
        }

        quad.object.value = _unescape(match[6]);
      } // get graph


      if (match[9] !== undefined) {
        quad.graph = {
          termType: 'NamedNode',
          value: match[9]
        };
      } else if (match[10] !== undefined) {
        quad.graph = {
          termType: 'BlankNode',
          value: match[10]
        };
      } else {
        quad.graph = {
          termType: 'DefaultGraph',
          value: ''
        };
      } // only add quad if it is unique in its graph


      if (!(quad.graph.value in graphs)) {
        graphs[quad.graph.value] = [quad];
        dataset.push(quad);
      } else {
        let unique = true;
        const quads = graphs[quad.graph.value];

        for (const q of quads) {
          if (_compareTriples(q, quad)) {
            unique = false;
            break;
          }
        }

        if (unique) {
          quads.push(quad);
          dataset.push(quad);
        }
      }
    }

    return dataset;
  }
  /**
   * Converts an RDF dataset to N-Quads.
   *
   * @param dataset (array of quads) the RDF dataset to convert.
   *
   * @return the N-Quads string.
   */


  static serialize(dataset) {
    if (!Array.isArray(dataset)) {
      dataset = NQuads.legacyDatasetToQuads(dataset);
    }

    const quads = [];

    for (const quad of dataset) {
      quads.push(NQuads.serializeQuad(quad));
    }

    return quads.sort().join('');
  }
  /**
   * Converts an RDF quad to an N-Quad string (a single quad).
   *
   * @param quad the RDF quad convert.
   *
   * @return the N-Quad string.
   */


  static serializeQuad(quad) {
    const s = quad.subject;
    const p = quad.predicate;
    const o = quad.object;
    const g = quad.graph;
    let nquad = ''; // subject and predicate can only be NamedNode or BlankNode

    [s, p].forEach(term => {
      if (term.termType === 'NamedNode') {
        nquad += '<' + term.value + '>';
      } else {
        nquad += term.value;
      }

      nquad += ' ';
    }); // object is NamedNode, BlankNode, or Literal

    if (o.termType === 'NamedNode') {
      nquad += '<' + o.value + '>';
    } else if (o.termType === 'BlankNode') {
      nquad += o.value;
    } else {
      nquad += '"' + _escape(o.value) + '"';

      if (o.datatype.value === RDF_LANGSTRING) {
        if (o.language) {
          nquad += '@' + o.language;
        }
      } else if (o.datatype.value !== XSD_STRING) {
        nquad += '^^<' + o.datatype.value + '>';
      }
    } // graph can only be NamedNode or BlankNode (or DefaultGraph, but that
    // does not add to `nquad`)


    if (g.termType === 'NamedNode') {
      nquad += ' <' + g.value + '>';
    } else if (g.termType === 'BlankNode') {
      nquad += ' ' + g.value;
    }

    nquad += ' .\n';
    return nquad;
  }
  /**
   * Converts a legacy-formatted dataset to an array of quads dataset per
   * http://rdf.js.org/.
   *
   * @param dataset the legacy dataset to convert.
   *
   * @return the array of quads dataset.
   */


  static legacyDatasetToQuads(dataset) {
    const quads = [];
    const termTypeMap = {
      'blank node': 'BlankNode',
      'IRI': 'NamedNode',
      'literal': 'Literal'
    };

    for (const graphName in dataset) {
      const triples = dataset[graphName];
      triples.forEach(triple => {
        const quad = {};

        for (const componentName in triple) {
          const oldComponent = triple[componentName];
          const newComponent = {
            termType: termTypeMap[oldComponent.type],
            value: oldComponent.value
          };

          if (newComponent.termType === 'Literal') {
            newComponent.datatype = {
              termType: 'NamedNode'
            };

            if ('datatype' in oldComponent) {
              newComponent.datatype.value = oldComponent.datatype;
            }

            if ('language' in oldComponent) {
              if (!('datatype' in oldComponent)) {
                newComponent.datatype.value = RDF_LANGSTRING;
              }

              newComponent.language = oldComponent.language;
            } else if (!('datatype' in oldComponent)) {
              newComponent.datatype.value = XSD_STRING;
            }
          }

          quad[componentName] = newComponent;
        }

        if (graphName === '@default') {
          quad.graph = {
            termType: 'DefaultGraph',
            value: ''
          };
        } else {
          quad.graph = {
            termType: graphName.startsWith('_:') ? 'BlankNode' : 'NamedNode',
            value: graphName
          };
        }

        quads.push(quad);
      });
    }

    return quads;
  }

};
/**
 * Compares two RDF triples for equality.
 *
 * @param t1 the first triple.
 * @param t2 the second triple.
 *
 * @return true if the triples are the same, false if not.
 */

function _compareTriples(t1, t2) {
  for (const k in t1) {
    if (t1[k].termType !== t2[k].termType || t1[k].value !== t2[k].value) {
      return false;
    }
  }

  if (t1.object.termType !== 'Literal') {
    return true;
  }

  return t1.object.datatype.termType === t2.object.datatype.termType && t1.object.datatype.value === t2.object.datatype.value && t1.object.language === t2.object.language;
}

const _escapeRegex = /["\\\n\r]/g;
/**
 * Escape string to N-Quads literal
 */

function _escape(s) {
  return s.replace(_escapeRegex, function (match) {
    switch (match) {
      case '"':
        return '\\"';

      case '\\':
        return '\\\\';

      case '\n':
        return '\\n';

      case '\r':
        return '\\r';
    }
  });
}

const _unescapeRegex = /(?:\\([tbnrf"'\\]))|(?:\\u([0-9A-Fa-f]{4}))|(?:\\U([0-9A-Fa-f]{8}))/g;
/**
 * Unescape N-Quads literal to string
 */

function _unescape(s) {
  return s.replace(_unescapeRegex, function (match, code, u, U) {
    if (code) {
      switch (code) {
        case 't':
          return '\t';

        case 'b':
          return '\b';

        case 'n':
          return '\n';

        case 'r':
          return '\r';

        case 'f':
          return '\f';

        case '"':
          return '"';

        case '\'':
          return '\'';

        case '\\':
          return '\\';
      }
    }

    if (u) {
      return String.fromCharCode(parseInt(u, 16));
    }

    if (U) {
      // FIXME: support larger values
      throw new Error('Unsupported U escape');
    }
  });
}