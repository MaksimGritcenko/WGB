# Technodom_StoreFinderGraphQl

**StoreFinderGraphQl** provides basic types and resolvers for Store Finder page.

### getStores
This endpoint allows to get: 
- a) list of all stores if $storeId and $cityId is empty
- b) list of stores filtered by "allowed countries" per store view scope ($storeId)
- c) list of stores filtered by specific city ($cityId)

```graphql
query {
    getStores(storeId: $storeId, cityId: $cityId) {
        store_name,
        store_external_id,
        address,
        phone_number,
        manager_email,
        store_hours,
        city,
        city_external_id,
        latitude,
        longitude
    }
}
```

### getCityStores
This endpoint allows to get: 
- a) list of all stores grouped by city if $storeId is empty
- b) list of all stores grouped by city and filtered by "allowed countries" per store view scope ($storeId)

```graphql
query {
    getCityStores(storeId: $storeId) {
        name,
        stores {
            store_name,
            store_external_id,
            address,
            phone_number,
            manager_email,
            store_hours,
            city,
            city_external_id,
            latitude,
            longitude
        }
    }
}
```
