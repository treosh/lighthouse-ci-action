const _ = require('lodash')
const {entities, getRootDomain, getEntity} = require('./index.js')

describe('Entities', () => {
  it('should not have duplicate names', () => {
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const nameA = entities[i].name.replace(/\s+/, '').toLowerCase()
        const nameB = entities[j].name.replace(/\s+/, '').toLowerCase()
        if (nameA !== nameB) continue

        expect(entities[i]).toBe(entities[j])
      }
    }
  })
})
