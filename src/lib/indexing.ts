// Runtime switch: set ALLOW_INDEXING=true in Dokploy's Environment tab to let
// search engines index the site. Anything else (or unset) keeps it hidden.
export const isIndexingAllowed = () => process.env.ALLOW_INDEXING === 'true';
