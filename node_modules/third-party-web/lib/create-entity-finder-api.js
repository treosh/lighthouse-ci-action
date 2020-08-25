const DOMAIN_IN_URL_REGEX = /:\/\/(\S*?)(:\d+)?(\/|$)/
const DOMAIN_CHARACTERS = /([a-z0-9.-]+\.[a-z0-9]+|localhost)/i
const IP_REGEX = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/
const ROOT_DOMAIN_REGEX = /[^.]+\.([^.]+|(gov|com|co|ne)\.\w{2})$/i

function getDomainFromOriginOrURL(originOrURL) {
  if (typeof originOrURL !== 'string') return null
  if (originOrURL.length > 10000 || originOrURL.startsWith('data:')) return null
  if (DOMAIN_IN_URL_REGEX.test(originOrURL)) return originOrURL.match(DOMAIN_IN_URL_REGEX)[1]
  if (DOMAIN_CHARACTERS.test(originOrURL)) return originOrURL.match(DOMAIN_CHARACTERS)[0]
  return null
}

function getRootDomain(originOrURL) {
  const domain = getDomainFromOriginOrURL(originOrURL)
  if (!domain) return null
  if (IP_REGEX.test(domain)) return domain
  const match = domain.match(ROOT_DOMAIN_REGEX)
  return (match && match[0]) || domain
}

function getEntityInDataset(entityByDomain, entityByRootDomain, originOrURL) {
  const domain = getDomainFromOriginOrURL(originOrURL)
  const rootDomain = getRootDomain(domain)
  if (!domain || !rootDomain) return undefined
  if (entityByDomain.has(domain)) return entityByDomain.get(domain)
  if (entityByRootDomain.has(rootDomain)) return entityByRootDomain.get(rootDomain)
  return undefined
}

function getProductInDataset(entityByDomain, entityByRootDomain, originOrURL) {
  const entity = getEntityInDataset(entityByDomain, entityByRootDomain, originOrURL)
  const products = entity && entity.products
  if (!products) return undefined
  if (typeof originOrURL !== 'string') return undefined

  for (const product of products) {
    for (const pattern of product.urlPatterns) {
      if (pattern instanceof RegExp && pattern.test(originOrURL)) return product
      if (typeof pattern === 'string' && originOrURL.includes(pattern)) return product
    }
  }
  return undefined
}

function cloneEntities(entities) {
  return entities.map(entity_ => {
    const entity = {
      company: entity_.name,
      ...entity_,
    }

    const products = (entity_.products || []).map(product => ({
      company: entity.company,
      categories: entity.categories,
      facades: [],
      ...product,
      urlPatterns: (product.urlPatterns || []).map(s =>
        s.startsWith('REGEXP:') ? new RegExp(s.slice('REGEXP:'.length)) : s
      ),
    }))

    entity.products = products
    return entity
  })
}

function createAPIFromDataset(entities_) {
  const entities = cloneEntities(entities_)
  const entityByDomain = new Map()
  const entityByRootDomain = new Map()

  for (const entity of entities) {
    entity.totalExecutionTime = Number(entity.totalExecutionTime) || 0
    entity.totalOccurrences = Number(entity.totalOccurrences) || 0
    entity.averageExecutionTime = entity.totalExecutionTime / entity.totalOccurrences

    for (const domain of entity.domains) {
      if (entityByDomain.has(domain)) {
        const duplicate = entityByDomain.get(domain)
        throw new Error(`Duplicate domain ${domain} (${entity.name} and ${duplicate.name})`)
      }

      entityByDomain.set(domain, entity)

      const rootDomain = getRootDomain(domain)
      if (domain.startsWith('*.')) {
        entityByRootDomain.set(rootDomain, entity)
      }
    }
  }

  for (const [rootDomain, entity] of entityByRootDomain.entries()) {
    if (!entity) entityByRootDomain.delete(rootDomain)
  }

  const getEntity = getEntityInDataset.bind(null, entityByDomain, entityByRootDomain)
  const getProduct = getProductInDataset.bind(null, entityByDomain, entityByRootDomain)
  return {getEntity, getProduct, getRootDomain, entities}
}

module.exports = {createAPIFromDataset}
