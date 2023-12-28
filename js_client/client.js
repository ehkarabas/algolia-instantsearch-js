// Algolia client'ınızı oluşturun
const searchClient = algoliasearch(config.algoliaAppId, config.algoliaApiKey);

// instantsearch örneğini oluşturun
const search = instantsearch({
  indexName: "hk_Product",
  searchClient,
});

// İlk indeks için widget'ları ekleyin
search.addWidgets([
  instantsearch.widgets.searchBox({
    container: "#searchbox",
  }),
  // İlk indeks için index widget'ı oluşturun ve widget'larını ekleyin
  instantsearch.widgets
    .index({
      indexName: "hk_Product",
    })
    .addWidgets([
      instantsearch.widgets.refinementList({
        // attributesForFaceting
        container: "#user-list-products #refinements",
        attribute: "user",
      }),
      instantsearch.widgets.refinementList({
        // attributesForFaceting
        container: "#user-list-privacy #refinements",
        attribute: "public",
      }),
      instantsearch.widgets.clearRefinements({
        container: "#user-list-products #clear-refinements",
      }),
      instantsearch.widgets.hits({
        container: "#hits-product-index #hits",
        templates: {
          item: `
              <div>
                  <div>{{#helpers.highlight}}{ "attribute": "title" }{{/helpers.highlight}}</div>
                  <div>{{#helpers.highlight}}{ "attribute": "body" }{{/helpers.highlight}}</div>
                  <p>{{ user }}</p>
                  <p>\${{ price }}
              </div>`,
        },
      }),
    ]),
  // İkinci indeks için başka bir index widget'ı oluşturun ve widget'larını ekleyin
  instantsearch.widgets
    .index({
      indexName: "hk_Article", // İkinci indeksinizin adını buraya girin
    })
    .addWidgets([
      instantsearch.widgets.refinementList({
        // attributesForFaceting
        container: "#user-list-articles #refinements",
        attribute: "user",
      }),
      instantsearch.widgets.clearRefinements({
        container: "#user-list-articles #clear-refinements",
      }),
      instantsearch.widgets.hits({
        container: "#hits-article-index #hits",
        templates: {
          item: `
              <div>
                  <div>{{#helpers.highlight}}{ "attribute": "title" }{{/helpers.highlight}}</div>
                  <div>{{#helpers.highlight}}{ "attribute": "body" }{{/helpers.highlight}}</div>
                  <p>{{ user }}</p>
                  <p>{{ formattedDate  }}</p>
              </div>`,
        },
        transformItems(items) {
          return items.map((item) => ({
            ...item,
            formattedDate: new Date(
              item.publish_date * 1000
            ).toLocaleDateString("tr-TR"),
          }));
        },
      }),
      // ... buraya ikinci indekse özel diğer widget'lar eklenebilir
    ]),
  // ... daha fazla indeks widget'ı eklenebilir
]);

// algolia instant search instance'ini baslat
search.start();
