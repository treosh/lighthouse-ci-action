const fs = require('fs')
const path = require('path')
const JSON5 = require('json5')
const {entities, getRootDomain, getEntity} = require('./index.js')

describe('getRootDomain', () => {
  it('works for basic domains', () => {
    expect(getRootDomain('cdn.cnn.com')).toEqual('cnn.com')
    expect(getRootDomain('www.hulce.photography')).toEqual('hulce.photography')
    expect(getRootDomain('api.supercool.io')).toEqual('supercool.io')
  })

  it('works for country-tlds', () => {
    expect(getRootDomain('content.yahoo.co.jp')).toEqual('yahoo.co.jp')
    expect(getRootDomain('go.visit.gov.in')).toEqual('visit.gov.in')
  })

  it('works for URLs', () => {
    expect(getRootDomain('https://content.yahoo.co.jp/path/?query=param')).toEqual('yahoo.co.jp')
    expect(getRootDomain('https://a.b.c.it/path/?query=param&two=2')).toEqual('c.it')
  })
})

describe('getEntity', () => {
  it('works for direct domain usage', () => {
    expect(getEntity('https://js.connect.facebook.net/lib.js')).toMatchInlineSnapshot(`
Object {
  "averageExecutionTime": 143.90937560613312,
  "categories": Array [
    "social",
  ],
  "company": "Facebook",
  "domains": Array [
    "www.facebook.com",
    "connect.facebook.net",
    "staticxx.facebook.com",
    "static.xx.fbcdn.net",
    "m.facebook.com",
    "atlassbx.com",
    "fbcdn-photos-e-a.akamaihd.net",
    "23.62.3.183",
    "akamai.net",
    "akamaiedge.net",
    "akamaitechnologies.com",
    "akamaitechnologies.fr",
    "akamaized.net",
    "edgefcs.net",
    "edgekey.net",
    "edgesuite.net",
    "srip.net",
    "cquotient.com",
    "demandware.net",
    "platform-lookaside.fbsbx.com",
  ],
  "homepage": "https://www.facebook.com",
  "name": "Facebook",
  "totalExecutionTime": 147646846,
  "totalOccurrences": 1025971,
}
`)
  })

  it('works for inferred domain usage', () => {
    expect(getEntity('https://unknown.typekit.net/fonts.css')).toMatchInlineSnapshot(`
Object {
  "averageExecutionTime": 91.44604519774012,
  "categories": Array [
    "library",
  ],
  "company": "Adobe",
  "domains": Array [
    "use.typekit.net",
    "typekit.com",
    "p.typekit.net",
  ],
  "homepage": "https://fonts.adobe.com/",
  "name": "Adobe TypeKit",
  "totalExecutionTime": 971157,
  "totalOccurrences": 10620,
}
`)
  })

  it('does not over-infer', () => {
    expect(getEntity('https://unknown.gstatic.com/what')).toEqual(undefined)
  })
})

describe('build state', () => {
  it('should use the complete entities set', () => {
    const json = fs.readFileSync(path.join(__dirname, '../data/entities.json5'), 'utf8')
    const sourceOfTruthEntities = JSON5.parse(json)
    expect(entities).toHaveLength(sourceOfTruthEntities.length)
  })

  it('should have all the same subsets in root as lib', () => {
    const srcSizes = fs.readdirSync(path.join(__dirname, 'subsets'))
    const dstSizes = fs.readdirSync(path.join(__dirname, '../')).filter(f => f.includes('-subset'))
    expect(dstSizes).toHaveLength(srcSizes.length) // run `yarn build` if this fails

    for (const file of dstSizes) {
      if (file.endsWith('.js')) require(path.join(__dirname, '../', file))
    }
  })
})
