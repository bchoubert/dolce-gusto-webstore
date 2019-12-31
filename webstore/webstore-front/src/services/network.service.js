
// Default Back-End URL
const BACK_END_URL = 'http://localhost:8000';

/**
 * NetworkService
 * 
 * Service to interact with the Back-End
 * All calls to the Back-End MUST pass through this service
 */
const NetworkService = {
  // Get the category list
  getAllCategories: () => fetch(BACK_END_URL + '/categories').then(res => res.json()),
  // Get one category details
  getCategoryDetails: categoryId => fetch(BACK_END_URL + '/category/' + categoryId).then(res => res.json()),
  // Get one product details
  getProductDetails: productId => fetch(BACK_END_URL + '/product/' + productId).then(res => res.json()),
  // Get all products types for a producttype id list (productTypes Id are passed as a GET parameter list, like : `?id=1&id=2&id=3`, so the Back-End receives directly [1, 2, 3])
  // So we join the idList with '&', and we start the list with '?'
  getProductTypes: idList => fetch(BACK_END_URL + '/producttype' + (!!idList && '?') + (idList.map(id => 'id='+id)).join('&')).then(res => res.json()),
  // Order (passing a JSON encoded string)
  // This is a form method that returns the orderId (encapsulated into an object)
  order: orderFormData => fetch(BACK_END_URL + '/order', {
    method: 'POST',
    body: JSON.stringify(orderFormData),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
};

export default NetworkService;
