# ProshopDjangoReact

## `Section 4: Cart`

### `Quantity select and Add to cart`

for adding quantity select to the cart, we don't need redux but a a state in the ProductScreen
```js
// /src/screens/ProductScreen.js
    const [qty, setQty] = useState(1);
```
and then put that select just below the `status` in the product screen.
in that selector we can do something like `<option>` but to make the selector dynamic on the basis of the `countInStock`, for that we have to take our Stock and turn into an Array, and then we will `map` over that array and return the `<option>`

and also add a handler to the `Add to Cart` button , so that on click it should redirect us to the cart page, and that can be done by using `history.push`, which is already available in the props, we just have to destructure it and pass the `/cart` as the path.

```js
// /src/screens/ProductScreen.js
function ProductScreen({ match,  history }) {
    const [qty, setQty] = useState(1);
    //..........

    useEffect (() => {
        dispatch(listProductDetails(match.params.id))
    }, []);

    const addToCartHandler = () => {
        // console.log("Add to Cart", match.params.id)
        history.push(`/cart/${match.params.id}?qty=${qty}`)
    }


//...................
//....................
{product.countInStock > 0 && (
    <ListGroup.Item>
        <Row>
            <Col>Quantity: </Col>
            <Col xs="auto" className="my-1">
                <Form.Control
                    as = "select"
                    value={qty}
                    onChange={e => setQty(e.target.value)}
                >
                    {
                        [...Array(product.countInStock).keys()].map(x =>{
                            return <option key={x + 1} value={x + 1}>{x + 1}</option>
                        })
                    }

                </Form.Control>
            </Col>
        </Row>
    </ListGroup.Item>
)}

<ListGroup.Item>
    <Button
    onClick={addToCartHandler}
    className="btn-block"
    type="button"
    disabled={product.countInStock === 0}
    >
        Add To Cart
    </Button>
</ListGroup.Item>
//.............
//.............
```

```js
// /src/screens/CartScreen.js
import React from 'react'

function CartScreen() {
    return (
        <div>
            Cart
        </div>
    )
}

export default CartScreen
```

```js
// /src/App.js
              <Route exact path="/cart/:id?" component={CartScreen} />
```
the question mark with the `id?` is so that when we want to go to the cart directly we shouldn't always go through the `add to cart` button in the product details page, but can directly go to the cart page.


    Steps:
    1. Add a state to the ProductScreen for quantity
    2. make the <option> dynamic, by converting the Stock into an Array
    3. map through that array
    4. add a handler to the `add to cart` button
    5. use history.push to redirect to the cart page, when clicked.
    6. create a cartScreen
    7. add that screen to the App.js


---
---

### `Cart Reducer`
first of all we have to declare the constants, that we are going to work with.
```js
// /src/constants/cartConstants.js
export const CART_ADD_ITEM = 'CART_ADD_ITEM';
export const CART_REMOVE_ITEM = 'CART_REMOVE_ITEM';
```

create a cartReducer.js file and import the constants.
our state for the cartReducer will be the cartItems, and the cartItems will be an array of objects.
```js
import { CART_ADD_ITEM } from '../constants/cartConstants';


export const cartReducer = (state = { cartItems: [] }, action) => {
    switch(action.type){
        // reducer cases

        default:
            return state;
    }
}
```

now we are going to add our first case, `CART_ADD_ITEM`, here we need to check that if the product that we sent back inside of `action.payload` exist in the cartItems, then we will just add the quantity to the existing product, otherwise we will add the product to the cartItems.

1. `payload` will be the product.
2. x.product is the `data._id` that we will see in the cartActions,
```js
// /src/reducers/cartReducer.js
//................
case CART_ADD_ITEM:
    const item = action.payload;
    const existItem = state.cartItems.find(x => x.product === item.product);
    if(existItem){
        return{
            ...state,
            cartItems: state.cartItems.map(x => x.product === existItem.product ? item : x)
        }
    }else{
        return{
            ...state,
            cartItems: [...state.cartItems, item]
        }
    }
```

    Steps:
    1. declare the constants in the cartContants.js in contants directory
    2. create a cartReducer.js file in the reducers
    3. add cases e.g `case CART_ADD_ITEM:`
    4. add the logic for the case, so if the product already exist in the cartItems, then we will just add the quantity to the existing product, otherwise we will add the product to the cartItems.
    5. Register CartReducer in the store.js


---
---
### `Cart Actions`
we have completed the cart Reducer, it's added to the store.js, now we need to add the actions to the cartActions.js file.

here first of all we have to import `axios` and constants.in the action as a parameter we want to add in the `id` and the `qty` of the product, also we have to make this an `async` function, and in the async function we are going to pass `(dispatch, getState)`, getState is like a useSelector but it will return the entire state.

```js
// /src/actions/cartActions.js
import axios from 'axios';
import {
    CART_ADD_ITEM
 } from '../constants/cartConstants';


export const addToCart = (id, qty) => async (dispatch, getState) => {}
```
after that we have to make a call and dispatch the action, as we said payload is the product data, and the `product` in the reducer is the `data._id`.
```js
// /src/actions/cartActions.js
const { data } = await axios.get(`/api/products/${id}`);

    dispatch({
        type: CART_ADD_ITEM,
        payload:{
            product: data._id,
            name: data.name,
            image: data.image,
            price: data.price,
            countInStock: data.countInStock,
            qty
        }
    })
```

Now we are going to load this data into localStorage.and there we will use our `getState` function to get the cartItems. here we will be convert the object to the string and in the store we have to `parse` it again to the object. and then add it to the `initialState`.
```js
// /src/actions/cartActions.js
///...............
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));

    //...
    default:
        //......
```
```js
// /src/store.js
//.......
const cartItemsFromStorage = localStorage.getItem('cartItems') ?
    JSON.parse(localStorage.getItem('cartItems')) : [];

const initialState = {
    cart: {cartItems : cartItemsFromStorage}
}
//.........
```


    Steps:
    1. import Axios and then constants
    2. add a cart action function `addToCart`, pass `id,qty` as parameters
    3. make this function an async function and pass `dispatch, getState`
    4. make a call to the api and get the product data
    5. dispatch the action with type and payload
    6. load this data into localStorage
    7. use the getState function to get the cartItems in the localStorage
    8. parse the cartItems from the localStorage to the object in store.js
    9. add the cartItems to the initialState


---
---
### `Add To Cart Functionality`
```js
// /src/screens/CartScreen.js
import React from 'react'

function CartScreen() {
    return (
        <div>
            Cart
        </div>
    )
}

export default CartScreen
```

import these things useEffect, Link, useSelector, useDispatch , Row, Col, ListGroup, Image, Form, Button, Card, Message and also the addToCart action from cartActions.js

we are also going to need id, soo for that we are going to destructure the product from the props.
```js
import React,{ useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap';
import Message from '../../components/Message';
import { addToCart } from '../actions/cartActions';

function CartScreen({ match, location,  history }) {
    return (
        <div>
            Cart
        </div>
    )
}

export default CartScreen
```

we are going to get our data id form the URL by using `match.params.id` and the quantity from the URL by using `location.search`

before rendering our data we are going to use `useSelector` to get the cartItems from the store.

```js
// /src/screens/CartScreen.js
function CartScreen({ match, location, history }) {

    const productId = match.params.id;
    const qty = location.search ? Number(location.search.split("=")[1]) : 1;
    console.log('qty', qty);

    const dispatch = useDispatch();

    const cart = useSelector(state => state.cart);
    const { cartItems } = cart;
    console.log("CartItems: ", cartItems)

    useEffect(()=>{
        if(productId){
            dispatch(addToCart(productId, qty));
        }
    },[dispatch, productId, qty]);
```




    Steps:
    1. import useEffect, Link, useSelector, useDispatch , Row, Col, ListGroup, Image, Form, Button, Card, Message
    2. import addToCart action from cartActions.js
    3. destructure the props, { match, location,  history }
    4. get the quantity of the product from the URL using location.search
    5. dispatch the action in useEffect if the productId is not null
    6. use useSelector to get the cartItems from the store
    7. destructure the cartItems from the cart

---
---
### `Cart Screen`
in the cart screen we are going to render our `cartItems` in a list group.
we are going to `map` through all of our cartItems.

```js
// /src/screens/CartScreen.js
 return (
        <Row>
            <Col md={8}>
                <h1>Shopping Cart</h1>
                {cartItems.length === 0 ? (
                    <Message variant="info">
                        Your Cart is empty <Link to="/">Go Back</Link>
                    </Message>
                ):(
                    <ListGroup variant='flush'>
                        {cartItems.map(item => (
                            <ListGroup.Item key={item.product}>
                                <Row>
                                    <Col md={2}>
                                        <Image src={item.image} alt={item.name} fluid rounded/>
                                    </Col>

                                    <Col md={3}>
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    </Col>

                                    <Col md={2}>
                                        ${item.price}
                                    </Col>

                                    <Col md={3}>
                                        <Form.Control
                                            as = "select"
                                            value={item.qty}
                                            onChange={e => dispatch(addToCart(item.product, Number(e.target.value)))}
                                        >
                                            {
                                                [...Array(item.countInStock).keys()].map(x =>{
                                                    return <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                })
                                            }

                                        </Form.Control>
                                    </Col>
```

after that we are going to add a `Button` to the cart screen. which will delete the item from the cart.
```js
// /src/screens/CartScreen.js
///......................
//.......................
                                    <Col md={1}>
                                        <Button
                                         type="button"
                                         bsStyle="danger"
                                        variant="light"
                                        style={{color: "red"}}
                                        onClick={() =>removeFromCartHandler(item.product)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </Button>
                                    </Col>
```

and then now define the `removeFromCartHandler` function bellow the useEffect.
```js
// /src/screens/CartScreen.js
//.......................
useEffect(()=>{
    //....
});

 const removeFromCartHandler = (id) => {
        console.log('remove:', id)
    }
```

Now going to the second `Column`, which will be the Cart summary
```js
// /src/screens/CartScreen.js
            <Col md={4}>
                <Card>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>Sub-Total ({cartItems.reduce((acc, item)=> acc + item.qty, 0)}) items</h2>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>

```

```js
// /src/screens/CartScreen.js
            <Col md={4}>
                <Card>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>Sub-Total ({cartItems.reduce((acc, item)=> acc + item.qty, 0)}) items</h2>
                            ${cartItems.reduce((acc, item)=> acc + item.qty * item.price, 0).toFixed(2)}
                        </ListGroup.Item>
                        
                        <ListGroup.Item>
                            <Button
                             type="button"
                             className="btn-block"
                             disabled={cartItems.length === 0}
                             onClick={checkoutHandler}
                            >
                                Proceed to Check Out
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
```



after that we are going to add a logic to the `checkoutHandler` function, that if the user is not logged in, then he will be redirected to the login screen. else if the user is logged in, then he will be redirected to the `shipping` screen.
```js
// /src/screens/CartScreen.js
const checkoutHandler = () => {
        history.push('/login?redirect=shipping');
    }
```

    Steps:
    0. rendering the components
    1. check for the cartItems length if it is 0 then show the message else map through the cartItems products and render the list group
    2. add a selector from ProductScreen.js e.g <Form.Control>
    3. add a button to delete the item from the cart and pass it the handler
    4. use High Order Function to add the the item numbers
    5. add a `Proceed to Checkout` button, this button will be disabled if the cartItems length is 0
    6. if logged in then redirect to the shipping screen if not logged in then redirect to the login screen

---
---

### `Remove Items from Cart`
in the above topic we have added a delete button in the cart, so that item can be deleted, now we are going to make that function working.

Reducer:
to make the reducer for the remove item from cart, we are going to use filter method. as we are maping through that and check if the product id is not equal to the action.payload, so action.payload is going to be the `id` that we want to remove, so filter is going to keep every product that doesn't match that id, so this will give us an array with the item removed and we can  update the cartItems.
```js
// /src/reducers/cartReducer.js

//.....
        case CART_REMOVE_ITEM:
            return{
                ...state,
                cartItems: state.cartItems.filter(x => x.product !== action.payload)
            }
```

after that we are going to create an action for removing item from cart.
```js
// /src/constant/cartAction.js
export const removeFromCart = (id) => async (dispatch, getState) => {
    dispatch({
        type: CART_REMOVE_ITEM,
        payload: id
    })
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
}
```

after creating action we are going to dispatch this action in the CartScreen.js in the removeFromCartHandler function.
```js
// /src/screens/CartScreen.js
    const removeFromCartHandler = (id) => {
        // console.log('remove:', id)
        dispatch(removeFromCart(id));
    }
```

    Steps:
    1. declare the constant for removig the item from the cart `CART_REMOVE_ITEM`
    2. import that constant in the Reducer and write a new case.
    3. add new action for removing the item from the cart.





