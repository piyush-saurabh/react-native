import Product from "../../models/product";

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

// Fetch the list of products from the server
export const fetchProducts = () => {
  return async dispatch => {

    //Error handling
    try{

      // Fetch the list of products from the server
      // By default, fetch is GET request
      const response = await fetch('https://rn-shopping-b46a3.firebaseio.com/products.json');

      // true if response code is in range ~200
      if (!response.ok){
        // Go to catch block
        throw new Error('Response is not 200');
      }
    
      // Structure of response
      /*
      Object {
    "-MCaQJZekvfr2LTcrglh": Object {
      "description": "Sample",
      "imageUrl": "",
      "price": 29,
      "title": "Test",
    },
    }
      */
      const responseData = await response.json();

      const loadedProduct = [];

      // Map the response with our product model
      for (const key in responseData){
        loadedProduct.push(new Product(key, 'u1', responseData[key].title, responseData[key].imageUrl, responseData[key].description, responseData[key].price));
      }

      dispatch({
        type: SET_PRODUCTS,
        products: loadedProduct
      });
    }catch (err) {
      // DO something
      // e.g. sent it to analytic server
      throw err;
    }
  };
};

export const deleteProduct = productId => {
  return { type: DELETE_PRODUCT, pid: productId };
};

// dispatch will passed by ReduxThunk
export const createProduct = (title, description, imageUrl, price) => {
  return async dispatch => {
    //any async code
    const response = await fetch('https://rn-shopping-b46a3.firebaseio.com/products.json', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description,
        imageUrl,
        price
      })
    });

    const responseData = await response.json();

    console.log(responseData);

    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: responseData.name,
        title,
        description,
        imageUrl,
        price
      }
    });
  };
  
};

export const updateProduct = (id, title, description, imageUrl) => {
  return {
    type: UPDATE_PRODUCT,
    pid: id,
    productData: {
      title,
      description,
      imageUrl,
    }
  };
};
