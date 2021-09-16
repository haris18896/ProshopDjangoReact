# ProshopDjangoReact

## `Section 6:FrontEnd User Authentication`

### `User Login Reducer and Action`
In the last section we have created a `login` and `registration` functionality along with the our `user Detail` API.
so to get that `user detail`, we serialize that data and then we now have a routes for everything.

so here in the frontend we are now going to apply that logic to the `login` and `registration` and `logOut` functionality.

in the last section we created a custom error handler for the `registration` functionality that if the user email is already registered you cannot register it again.

so to use that error handler in the front end we have to fix the error payload change the given `message` to `detail`.
```js
// src/actions/productActions.js
// #  not correct
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
```

```js
// src/actions/productActions.js
// #  correct
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
```

##### `User Login constants`
Now we can get started with our UserActions, userReducers.
```js
// /src/constants/userConstants.js
export const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST';
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
export const USER_LOGIN_FAILURE = 'USER_LOGIN_FAILURE';

export const USER_LOGOUT = "USER_LOGOUT"
```

##### `User Login Reducer`
```js
// /src/reducers/userReducer.js
import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILURE,

    USER_LOGOUT,
} from '../constants/userConstants.js'


export const userLoginReducer = (state={ }, action) =>{
    switch(action.type){
        case USER_LOGIN_REQUEST:
            return { loading: true };
        case USER_LOGIN_SUCCESS:
            return { loading: false, userInfo: action.payload };
        case USER_LOGIN_FAILURE:
                return { loading: false, error: action.payload };

        case USER_LOGOUT:
            return { };
        default:
            return state
    }
}
```
after that we are going to register the userLoginReducer in the store.js with the `combineReducers`

then go the redux devtools and check the state of the reducer. there will be a `userLogin` empty state

#### `user Login Actions`
in the userLoginActions.js file we are going to create a `login` action which will take `email` and `password` as props.

in the axios method we are going to use `post` request because we are submitting a `login` request.

with the `axios post` request method, we also want to send some data.
```js
// /src/actions/userLoginActions.js
dispatch({
            type: USER_LOGIN_REQUEST,
        })

        const config = {
            headers : {
                'Content-Type': 'application/json',
            }
        }

        const { data } = await axios.post(
            '/api/users/login/',
            {'username': email, 'password': password},
            config
            );
```

so if this dispatch request is successful, we will get the `userInfo` in the payload.

add the userInfo to the `localStorage`    `localStorage.setItem('userInfo', JSON.stringify(data));`

so to access this data now we set it in our localStorage, but we also have to go to our store and 

```js
// /src/actions/userActions.js
import axios from 'axios'

import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILURE,

    USER_LOGOUT,
} from '../constants/userConstants';

export const login = (email, password) => async (dispatch) => {
    try{
        dispatch({
            type: USER_LOGIN_REQUEST,
        })

        const config = {
            headers : {
                'Content-Type': 'application/json',
            }
        }

        const { data } = await axios.post(
            '/api/users/login/',
            {'username': email, 'password': password},
            config
            );

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
        })

        localStorage.setItem('userInfo', JSON.stringify(data));



    }catch(error){
        dispatch({
            type: USER_LOGIN_FAILURE,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        })
        // console.log('error message', error)
    }
}
```

```js
// src/store.js
// .............
const userInfoFromStorage = localStorage.getItem('userInfo') ?
    JSON.parse(localStorage.getItem('userInfo')) : null;

const initialState = {
    cart: {cartItems : cartItemsFromStorage},
    userLogin: {userInfo : userInfoFromStorage}
}
//..............
```

```js
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { login } from '../actions/userActions'

function LoginScreen({ location, history }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()

    const redirect = location.search ? location.search.split('=')[1] : '/'

    const userLogin = useSelector(state => state.userLogin)
    const { error, loading, userInfo } = userLogin

    useEffect(() => {
        if (userInfo) {
            history.push(redirect)
        }
    }, [history, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(email, password))
    }

    return (
        <FormContainer>
            <h1>Sign In</h1>
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader />}
            <Form onSubmit={submitHandler}>

                <Form.Group controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Enter Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>


                <Form.Group controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Enter Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Button className="my-3" type='submit' variant='primary'>
                    Sign In
                </Button>
            </Form>

            <Row className='py-3'>
                <Col>
                    New Customer? <Link
                        to={redirect ? `/register?redirect=${redirect}` : '/register'}>
                        Register
                        </Link>
                </Col>
            </Row>

        </FormContainer>
    )
}

export default LoginScreen
```


    Steps:
    1. fix the error handler in the front end, because we have defined a custom error handler for the registration functionality.
    2. setup constants in the `userConstants.js` in the `constant` folder.
    3. create a new `userReducer.js` file in the `reducer` folder.
    4. register the `userLoginReducer` in the `store.js` file in the combine reducers.
    5. check it in the redux devtools.
    6.  create a new `uerAction.js` file in the `actions` folder.
    7. send some send data along with the user login request
    8. add the user data into the `localStorage`
    9. access the localStorage in the store.js file

---
---

### `User Login Screen and Functionality`
import these things import these; `useState, useEffect, Link, Form, Button, Row, Col, useDispatch, useSelector ,Message,Loader` `import import login from '../actions/userActions'`;

the 2 states that we are going to need is `email`, and `password`
```js
// src/screens/loginScreens.js
import React,{useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import {useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader'
import login from '../actions/userActions';


function LoginScreen() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div>
            Login Screen
        </div>
    )
}

export default LoginScreen
```
```js
// src/App.js
   <Route exact path="/login" component={LoginScreen} />
```

after that we are going to create a `Login` component.
```js
// src/ components/FormContainer.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function FormContainer({children}) {
    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    {children}
                </Col>
            </Row>
        </Container>
    )
}

export default FormContainer
```

the `children` is used as a prop so that we can call it anytime

```js
// src/screen/LoginScreen.js
import React,{useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import {useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer';
import login from '../actions/userActions';


function LoginScreen() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const submitHandler = (event) => {
        event.preventDefault();
        console.log('submitted ')
    }

    return (
        <FormContainer>
            <h1>Sign In</h1>
            <Form
            onSubmit={submitHandler}
            >
                <Form.Group
                controlId="email"
                >
                    <Form.Label>EmailAddress</Form.Label>
                    <Form.Control
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    >

                    </Form.Control>
                </Form.Group>
                <Form.Group
                controlId="email"
                >
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    >

                    </Form.Control>
                </Form.Group>

                <Button
                type="submit"
                variant="primary"
                className="btn btn-block my-3"
                >
                    Sign In
                </Button>
            </Form>

            
        </FormContainer>
    )
}

export default LoginScreen
```

after this we are going to add a `Sign Up` link to the `LoginScreen` and will make a logic so that if the user doesn't have an account he can create one and will be redirected to the `/register` route.
```js
// src/screens/LoginScreen.js

//............
function LoginScreen({location, history}) {
    const redirect = location.search ? location.search.split('=')[1] : '/'; 

//.............
<FormContainer>
<Form>
        //........
    </Form>

    <Row className="py-3">
        <Col>
            New Customer? <Link 
            to={redirect ? `/register?redirect=${redirect}` : '/register'}
            >
                Register
            </Link>
        </Col>
    </Row>
</FormContainer>

///.........
```
after that we are going to dispatch the actions, but before dispatching any action we are going to select the state from the reducer
```js
// src/screens/LoginScreen.js
    const userLogin = useSelector(state => state.userLogin);
    const {loading, userInfo, error } = userLogin;
```

after that we are going to make sure that a logged in user can't logged in again. 
 so if the user exist then they will be redirected to the `redirect` route.
 ```js
 // src/screens/LoginScreen.js
 //.....
     useEffect(()=>{
        if(userInfo){
            history.push(redirect);
        }
    },[history, userInfo, redirect])

//.......
```

now dispatching our action




    Steps:
    1. import these; `useState, useEffect, Link, Form, Button, Row, Col, useDispatch, useSelector ,Message,Loader`
    2. import import login from '../actions/userActions';
    3. set the route for login page in the `App.js` file.
    4. make a container component for the login page.
    5. make a login form with email and password, add a submit button, and a link to registration page that will redirect to the register page.
    6. select the state form the reducer
    7. make sure a logged in user can't log in again