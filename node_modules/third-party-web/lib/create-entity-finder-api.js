const DOMAIN_IN_URL_REGEX = /:\/\/(.*?)(\/|$)/
const DOMAIN_CHARACTERS = /[a-z0-9.-]+\.[a-z0-9]+/i
const ROOT_DOMAIN_REGEX = /[^.]+\.([^.]+|(gov|com|co|ne)\.\w{2})$/i

function getDomainFromOriginOrURL(originOrURL) {
  if (DOMAIN_IN_URL_REGEX.test(originOrURL)) return originOrURL.match(DOMAIN_IN_URL_REGEX)[1]
  if (DOMAIN_CHARACTERS.test(originOrURL)) return originOrURL.match(DOMAIN_CHARACTERS)[0]
  throw new Error(`Unable to find domain in "${originOrURL}"`)
}

function getRootDomain(originOrURL) {
  const domain = getDomainFromOriginOrURL(originOrURL)
  const match = domain.match(ROOT_DOMAIN_REGEX)
  return (match && match[0]) || domain
}

function getEntityInDataset(entityByDomain, entityByRootDomain, originOrURL) {
  const domain = getDomainFromOriginOrURL(originOrURL)
  const rootDomain = getRootDomain(domain)
  if (entityByDomain.has(domain)) return entityByDomain.get(domain)
  if (entityByRootDomain.has(rootDomain)) return entityByRootDomain.get(rootDomain)
  return undefined
}

function createAPIFromDataset(entities_) {
  const entities = JSON.parse(JSON.stringify(entities_))
  const entityByDomain = new Map()
  const entityByRootDomain = new Map()

  for (const entity of entities) {
    if (!entity.company) entity.company = entity.name
    entity.totalExecutionTime = Number(entity.totalExecutionTime) || 0
    entity.totalOccurrences = Number(entity.totalOccurrences) || 0
    entity.averageExecutionTime = entity.totalExecutionTime / entity.totalOccurrences

    for (const domain of entity.domains) {
      if (entityByDomain.has(domain)) throw new Error(`Duplicate domain ${domain}`)
      entityByDomain.set(domain, entity)
      const rootDomain = getRootDomain(domain)
      if (entityByRootDomain.has(rootDomain) && entityByRootDomain.get(rootDomain) !== entity) {
        entityByRootDomain.set(rootDomain, false)
      } else {
        entityByRootDomain.set(rootDomain, entity)
      }
    }
  }

  for (const [rootDomain, entity] of entityByRootDomain.entries()) {
    if (!entity) entityByRootDomain.delete(rootDomain)
  }

  const getEntity = getEntityInDataset.bind(null, entityByDomain, entityByRootDomain)
  return {getEntity, getRootDomain, entities}
}

module.exports = {createAPIFromDataset}
