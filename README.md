# ProshopDjangoReact

## `Section 3: Implementing Redux for state Management`

```shell
npm install redux react-redux redux-thunk redux-devtools-extension
```

after installing the packages we can go and create our `Store`.
```js
// /src/store.js
import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

const reducer = combineReducers({
    // reducers
})

const initialState = {}

const middleware = [thunk]

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;
```

now we are going to import our store in the `index.js` file. and then use `Provider` to wrap our app.
we will change the `React.StrictMode` to `Provider` and pass our store as a prop.

```js
// /src/index.js
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

Now at this point we have a store, and we can create reducers and actions, and then pass those reducers to the combine reducer in the `store.js` file

    steps:
    1. create a file called store.js in the /src folder
    2. import the createStore, combineReducers, applyMiddleware functions from redux
    3. import thunk from redux-thunk
    4. import { composeWithDevTools } from 'redux-devtools-extension'
    5. create an initialState object
    6. create an array of middleware
    7. create a reducer object
    8. create a store variable and assign it to the createStore function with the reducer, initialState, and composeWithDevTools function
    9. export the store variable
    10. import the Provider component from react-redux in index.js
    11. wrap the app in the Provider component and pass the store as a prop

---
---
### `Product List Reducers and Actions`

create a folder by the name of `reducers` in the /src folder.
create a file called `productReducer.js` in the `reducers` folder.

actually reducer is a function that takes in the current state and it's going to take an action of what we want to do to the state.the `Reducer` actually what updates our store.

```js
// /src/reducers/productReducer.js
const productListReducer = (state={products: []}, action) =>{

}
```
we will take the `state` when we first start the `state` is going to have an empty list of products, and we are also going to take an action type, which will be an object.
once we get these 2 values we are going to update only the products list in the state we aren't updating the entire state.

```js
// /src/reducers/productReducer.js
const productListReducer = (state={products: []}, action) =>{
    switch(action.type){
        case 'PRODUCT_LIST_REQUEST':
            return { loading: true, products: [] };
        default:
            return state
    }
}
```

we are updating our state to these values in the return statement.

```js
// /src/reducers/productReducer.js
//...........
//.........
const productListReducer = (state={products: []}, action) =>{
    switch(action.type){
        //.....
        case 'PRODUCT_LIST_SUCCESS':
            return { loading: false, products: action.payload };
        //........
```
so this is when our API call returns back some data, loading will be false, and the products will be the data we get back from the API call. `payload is what we get back from API call`.
```js
// /src/reducers/productReducer.js


const productListReducer = (state={products: []}, action) =>{
    switch(action.type){
        case 'PRODUCT_LIST_REQUEST':
            return { loading: true, products: [] };
        case 'PRODUCT_LIST_SUCCESS':
            return { loading: false, products: action.payload };
        case 'PRODUCT_LIST_FAIL':
                return { loading: false, error: action.payload };
        default:
            return state
    }
}
```

on failure we are going to return the error message.

export the reducer function, then import this reducer in the `store.js` file and pass it to the combine reducers function after that check the Redux dev tool in the browser to see if the reducer is working.

after all this we are going to create constants for our actions and reducers, for that we have to create a directory called 'constants' and in that we will create a file called 'productConstants.js'

```js
// /src/constants/productConstants.js
export const PRODUCT_LIST_REQUEST = 'PRODUCT_LIST_REQUEST';
export const PRODUCT_LIST_SUCCESS = 'PRODUCT_LIST_SUCCESS';
export const PRODUCT_LIST_FAILURE = 'PRODUCT_LIST_FAILURE';
```

after that import these constant in the reducer file.
```js
// /src/reducers/productReducer.js
import { PRODUCT_LIST_REQUEST, PRODUCT_LIST_SUCCESS, PRODUCT_LIST_FAILURE} from '../constants/productConstants'

export const productListReducer = (state={products: []}, action) =>{
    switch(action.type){
        case PRODUCT_LIST_REQUEST:
            return { loading: true, products: [] };
        case PRODUCT_LIST_SUCCESS:
            return { loading: false, products: action.payload };
        case PRODUCT_LIST_FAILURE:
                return { loading: false, error: action.payload };
        default:
            return state
    }
}
```


    steps:
    1. create a file called `productReducer.js` in the `reducers` folder
    2. pass the initial state and action to the reducer function
    3. create a switch statement to handle the different actions
    4. create a case for the action type of PRODUCT_LIST_REQUEST, PRODUCT_LIST_SUCCESS, and PRODUCT_LIST_FAIL
    5. we will be updating the state to these values in the return statement. which are { loading: ____, products:  _____}.
    6. the payload is the data we get back from the API call.
    7. in the default case we are going to return the state.
    8. export the reducer function
    9. import this reducer in the `store.js` file
    10. and pass it to the combine reducers function
    11. check the Redux dev tool in the browser to see if the reducer is working.
    12. Now create a file called 'productContants.js' in the `constants` folder
    13. import those constants in the reducer file and use them in the switch statement.

#### `Product List Actions`
create a folder `actions` in that folder `productActions.js` file
Now we are going to create our first Action. this is going to be an arrow function.

after that making an API call `HomeScreen.js` component we are going to make it from `listProduct` action function. 

```js
// /src/actions/productActions.js
import {
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAILURE
} from '../constants/productConstants'

const listProducts = () => {
    
}
```

after making an API call in the action we are going to call this action in the `useEffect` in `HOmeScreen.js` component. so the action will now be incharge of making the API call.

once we actually get back that data we are going to dispatch our `productReducer` and then this reducer will update our state.

```js
// /src/actions/productActions.js
const listProducts = () => async (dispatch) => {

}
```

```js
const listProducts = () => async (dispatch) => {
    try{
        dispatch({ type: PRODUCT_LIST_REQUEST })
    }catch(error){
        console.log('error message', error)
    }
}
```
the dispatch in the try catch block is going fire off our first reducer, because there we are going to pass an object of action type.

after that we want to make an API call to the backend and load up the data and then actually call the 'PRODUCT_LIST_SUCCESS'.
for making an API call we are going to use the `axios` library.

```js
const listProducts = () => async (dispatch) => {
    try{
        dispatch({ type: PRODUCT_LIST_REQUEST })

        const {data} = await axios.get('/api/products/')

    }catch(error){
        console.log('error message', error)
    }
}
```
if anything go wrong with the API call then we are going to trigger that `catch(error)` and then dispatch `PROJECT_LIST_FAILURE` action. but if everything goes well we are going to dispatch `PRODUCT_LIST_SUCCESS` action. and that will be a function with an object of action type and payload.

in the `PRODUCT_LIST_FAILURE` action we are going to pass the error message so if there is a generic message we are going to pass that else we are going to pass the error message.

```js
import axios from 'axios';

import {
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAILURE
} from '../constants/productConstants'

const listProducts = () => async (dispatch) => {
    try{
        dispatch({ type: PRODUCT_LIST_REQUEST })

        const {data} = await axios.get('/api/products/')

        dispatch({ 
            type: PRODUCT_LIST_SUCCESS,
            payload: data
        })

    }catch(error){
        dispatch({
            type: PRODUCT_LIST_FAILURE,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
        })
        console.log('error message', error)
    }
}
```

at this point we are actually not firing off this action yet, we are going to use it in our `HomeScreen` component.


    steps:
    1. create a file `productActions.js` in the actions directory
    2. Make an AP call in the action function
    3. call this action function in the useEffect of the component
    4. dispatch the reducer function
    5. make an API call too the backend and get the data
    6. and then call the PRODUCT_LIST_SUCCESS action type which will trigger the reducer function to update the state.
    7. to make an API call we are going to use the `axios` library.
    8. make an API request to the backend and get the destructured data.
    9. if anything goes wrong with the API call then we are going to trigger that `catch(error)` and then dispatch `PROJECT_LIST_FAILURE` action.
    10. but if everything goes well we are going to dispatch `PRODUCT_LIST_SUCCESS` action. and that will be a function with an object of action type and payload.


#### `Bringing Redux to HomeScreen`
at this point we have created Contants, Reducers, and Actions, Now it's time to fire the action off in the home screen component with the help of `useEffect` and update our redux store. we have to load that data into our component and render it out.

first of all we have to get rid off the local state `const [products, setProducts] = useState([]);` and we also don't need `axios` in the component. also get rid of everything in the `useEffect` becuase we are going to dispatch the `listProducts` action in the useEffect, which is making that API call and it updates the store with the help of reducers. and for that we need to `export` the `listProducts` action function.

at this point we have to import `useDispatch, useSelector` in the `HomeScreen.js` component.
`useSelector` it let us select certian parts of the state and `useDispatch` is a hook that let us dispatch actions.

to call that action in the component we have to import it.`import listProduct from '../actions/productActions`;



```js
// /src/screens/HomeScreen.js
import { useDispatch, useSelector } from 'react-redux';

function HomeScreen() {

    const dispatch = useDispatch();


    useEffect (() => {
        dispatch(listProduct())
    }, []);
```

and that's all we need to call the action but at this point we will get an error , because we are looping through the products array , so we have too select it from the store with the help of `uesSelector`

too check do this `const products = []` and then check the redux dev tool in the browser we will see that the data has been loaded from the database.

at this point we can see that first the `PRODUCT_LIST_REQUEST` action is fired off and then the `PRODUCT_LIST_SUCCESS` action is fired off and loaded the data into the store. here the loading was initially true at the time `PRODUCT_LIST_REQUEST` and when the data loaded the state changed to the false and `PRODUCT_LIST_SUCCESS` action was triggered and loaded the data.

```js
import { useDispatch, useSelector } from 'react-redux';

import { listProducts} from '../actions/productActions';

function HomeScreen() {

    const dispatch = useDispatch();


    useEffect (() => {
        dispatch(listProducts())
    }, []);

    const products = []
```

now we are going to render that data in the store into our site. for that we need to select that part of the state and then we need to map over it and then render it.

inside of the `useSelector` we are going to tell what part of the data we are selecting.for that we will use the arrow function inside the useSelector
```js
// src/screens/HomeScreen.js
    const productList = useSelector(state => state.productList)
```
this `productList` inside the useSelector is the `reducer` in the `store.js` file, in that reducer there are multiple states, so we want to destructure it.
```js
// src/screens/HomeScreen.js
    const {error, loading, products} = productList
```
Rendering the products
```js
            <Row>
                {products.map(product => (
                    <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    {/* <h3>{product.name}</h3> */}
                    <Product product={product}/>
                    </Col>
                ))}
            </Row>
```

Now look at your component, the data has been loaded

```js
// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import { useDispatch, useSelector } from 'react-redux';

import { listProducts} from '../actions/productActions';

function HomeScreen() {

    const dispatch = useDispatch();
    const productList = useSelector(state => state.productList);
    const {error, loading, products} = productList

    useEffect (() => {
        dispatch(listProducts())
    }, [dispatch]);

    // const products = []

    return (
        <div>
            <h2>Latest products</h2>
            {loading ? <div>Loading...</div>
                : error ? <h3>{error}</h3>
                :(
                    <Row>
                        {products.map(product => (
                            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                            <Product product={product}/>
                            </Col>
                        ))}
                    </Row>
                )
                }
        </div>
    )
}

export default HomeScreen
```

after that we are going to make an error and loading component to use whenever needed.

for the loading we are going to use React-bootstrap `spinner` and for error we are going to use `alert`.
```js
// src/components/Loading.js
import React from 'react';
import { Spinner } from 'react-bootstrap';

function Loader() {
    return (
        <Spinner
        animation="grow"
        role="status"
        style={{
            height: '100px',
            width: '100px',
            margin: 'auto',
            display: 'block',
        }}
        >
            <span className="sr-only">Loading...</span>
        </Spinner>
    )
}

export default Loader
```

```js
// /src/components/Message.js
import React from 'react';
import { Alert } from 'react-bootstrap';

function Message({ variant, children}) {
    return (
        <Alert variant={variant}>
            {children}
        </Alert>
    )
}

export default Message
```

here in the Message component we are going to pass `variant and children` as props so that we can use it in the component the way we want.
e.g 
```js
{loading ? <Loader />
    : error ? <Message variant="danger">{error}</Message>
```

here now we can change the Message component variant and children the way we want.

    steps:
    1. get rid of local state and axios library in the component
    2. get rid of everything in the useEffect.
    3. import useDispatch, and useSelector
    4. dispatch the action in the useEffect
    5. select the part of the reducer using useSelector
    6. destructure the part of the reducer we want to use e.g `const {error, loading, products} = productList`
    7. and then render the destructured part of the reducer using `map`
    8. and then render the loading and error message if any.
    9. to check for error, go to the action and change the api call a little bit .
    10. after that make a component for loading and error messages


---
---
### `Product Detail Reducer and actions`
 this is our second reducer and action for `ProductScreen.js`

 here we want to load all the data from our redux store, instead of loading it from component level state.
 and for that we need to add new constants, new actions, new reducers. this process will be repeated every time.

 first of all we have to make constants
 ```js
 // /src/constants/productConstants.js
 export const PRODUCT_DETAILS_REQUEST = 'PRODUCT_DETAILS_REQUEST';
export const PRODUCT_DETAILS_SUCCESS = 'PRODUCT_DETAILS_SUCCESS';
export const PRODUCT_DETAILS_FAILURE = 'PRODUCT_DETAILS_FAILURE';
```

after that we need to create a reducer for the productDetails
```js
// /src/reducers/productReducer.js
export const productDetailsReducer = (state={product: {reviews: []}}, action) =>{
```

here product is going to be an object and inside that object 'reviews' is going to be an array.`state={product: {reviews: []}},`

```js
// /src/reducers/productReducer.js

export const productDetailsReducer = (state={product: {reviews: []}}, action) =>{
    switch(action.type){
        case PRODUCT_DETAILS_REQUEST:
            return { loading: true, ...state };
        case PRODUCT_DETAILS_SUCCESS:
            return { loading: false, product: action.payload };
        case PRODUCT_DETAILS_FAILURE:
                return { loading: false, error: action.payload };
        default:
            return state
    }
}
```

after that we have to register this reducer in the store. the data that has been rendered is still from our component level state. but iif we look into the redux tool, we should get our product state

now we are going to create an action to load the product details
```js
// /src/actions/productActions.js
export const listProductDetails = (id) => async (dispatch) => {
```
here we are passing the `id` as a parameter to the action because we are going to make an API call to get the single product.

```js
// /src/actions/productActions.js
export const listProductDetails = (id) => async (dispatch) => {
    try{
        dispatch({ type: PRODUCT_DETAILS_REQUEST })
        const {data} = await axios.get(`/api/products/${id}`)

        dispatch({ 
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data
        })

    }catch(error){
        dispatch({
            type: PRODUCT_DETAILS_FAILURE,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
        })
        console.log('error message', error)
    }
}
```

now we are going to make a component to load the product details using dispatch, for that we are going to get rid of the `axios` in the component, and import `useDispatch, and useSelector`



    Steps:
    1. make constants for the reducer and actions
    2. create the reducer `productDetailsReducer`
    3. register this reducer in the store
    4. create an action and update that state
    5. call it in the component 'ProductScreen.js`
    6. import the useSelector and useDispatch from react-redux
    6. dispatch the action in the useEffect with the id
    7. 


