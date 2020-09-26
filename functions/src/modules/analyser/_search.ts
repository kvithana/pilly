import algoliasearch from 'algoliasearch'
import * as functions from 'firebase-functions'

const client = algoliasearch(functions.config().algolia.id, functions.config().algolia.token)
const index = client.initIndex('medication')

interface AlgoliaData {
  activeIngredient: string
  brandName: string
  id: string
}

/**
 * Search our Algolia database with an array of search terms and receive an
 * array of hits back.
 * @param terms list of search terms
 */
export const algoliaSearch = (terms: string[]) => {
  const results: Promise<AlgoliaData[]>[] = []
  try {
    terms.forEach((term) => {
      results.push(index.search(term).then((res) => (res.hits as unknown) as AlgoliaData[]))
    })
  } catch (e) {
    functions.logger.error('error with algolia search for terms', terms, e)
    throw e
  }
  return Promise.all(results)
}
