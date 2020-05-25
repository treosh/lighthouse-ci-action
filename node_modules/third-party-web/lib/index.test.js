const fs = require('fs')
const path = require('path')
const JSON5 = require('json5')
const {entities, getRootDomain, getEntity} = require('./index.js')

describe('getRootDomain', () => {
  it('works for IP addresses', () => {
    expect(getRootDomain('8.8.8.8')).toEqual('8.8.8.8')
    expect(getRootDomain('192.168.0.1')).toEqual('192.168.0.1')
  })

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
    expect(getRootDomain('https://foo.bar:433/path/?query=param&two=2')).toEqual('foo.bar')
  })

  it('works for localhost', () => {
    expect(getRootDomain('https://localhost:8080/path/?query=param')).toEqual('localhost')
    expect(getRootDomain('https://localhost/path/?query=param&two=2')).toEqual('localhost')
    expect(getRootDomain('localhost:9000/path/?query=param&two=2')).toEqual('localhost')
    expect(getRootDomain('localhost:1200')).toEqual('localhost')
  })

  it('works for wildcard domains', () => {
    expect(getRootDomain('*.google.com')).toEqual('google.com')
    expect(getRootDomain('*.yahoo.co.jp')).toEqual('yahoo.co.jp')
    expect(getRootDomain('*.hulce.photography')).toEqual('hulce.photography')
  })

  it('runs on *massive* inputs', () => {
    const massiveInput = '123456789'.repeat(100e3)
    expect(getRootDomain(massiveInput)).toEqual(null)
  })

  it('throws on invalid inputs', () => {
    expect(() => getRootDomain('this is not a domain')).toThrow()
    expect(() => getRootDomain('neither-is-this')).toThrow()
    expect(() => getRootDomain('http://nor this')).toThrow()
  })
})

describe('getEntity', () => {
  it('works for direct domain usage', () => {
    expect(getEntity('https://js.connect.facebook.net/lib.js')).toMatchInlineSnapshot(`
      Object {
        "averageExecutionTime": 222.95578518974813,
        "categories": Array [
          "social",
        ],
        "company": "Facebook",
        "domains": Array [
          "*.atlassbx.com",
          "*.facebook.com",
          "*.fbsbx.com",
          "fbcdn-photos-e-a.akamaihd.net",
          "*.facebook.net",
          "*.fbcdn.net",
        ],
        "examples": Array [
          "www.facebook.com",
          "connect.facebook.net",
          "staticxx.facebook.com",
          "static.xx.fbcdn.net",
          "m.facebook.com",
          "an.facebook.com",
          "platform-lookaside.fbsbx.com",
        ],
        "homepage": "https://www.facebook.com",
        "name": "Facebook",
        "totalExecutionTime": 322128748,
        "totalOccurrences": 1444810,
      }
    `)
  })

  it('works for inferred domain usage', () => {
    expect(getEntity('https://unknown.typekit.net/fonts.css')).toMatchInlineSnapshot(`
      Object {
        "averageExecutionTime": 105.38858905165768,
        "categories": Array [
          "cdn",
        ],
        "company": "Adobe",
        "domains": Array [
          "*.typekit.com",
          "*.typekit.net",
        ],
        "examples": Array [
          "use.typekit.net",
          "p.typekit.net",
        ],
        "homepage": "https://fonts.adobe.com/",
        "name": "Adobe TypeKit",
        "totalExecutionTime": 1230201,
        "totalOccurrences": 11673,
      }
    `)
  })

  it('does not over-infer', () => {
    expect(getEntity('https://unknown.gstatic.com/what')).toEqual(undefined)
  })

  it('only infers as a fallback', () => {
    expect(getEntity('http://fbcdn-photos-e-a.akamaihd.net/1234.jpg').name).toEqual('Facebook')
    expect(getEntity('http://unknown.akamaihd.net/1234.jpg').name).toEqual('Akamai')
  })

  it('runs on *massive* inputs', () => {
    const massiveInput = '123456789'.repeat(100e3)
    expect(getEntity(massiveInput)).toEqual(undefined)
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
