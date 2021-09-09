# ProshopDjangoReact

## `Section 1: FrontEnd`
`make branches`

```
npx create-react-app frontend
```

1. Clean your code.
2. create the components directory and in that the we will create components. e.g Header, Footer, and Body components
3. create another directory for screens which are also components. e.g Home page, Product page, Contact page, etc.
4. create a directory for the reducers.
5. create a directory for the actions.

```
npm install react-bootstrap@next bootstrap@5.1.0
```

* download theme from `bootswatch` and then paste that file in `/src/`, and then import that file in the `index.js` file.

#### `Header.js`
```js
// /src/components/Header.js
import React from 'react'
import { Navbar,Nav, Container, Row } from 'react-bootstrap'

function Header() {
    return (
        <header>
            <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
                <Container>
                    <Navbar.Brand href="/">ProShop</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                        className="mr-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                        >
                        <Nav.Link href="/cart"><i className="fas fa-shopping-cart">&nbsp;</i>Cart</Nav.Link>
                        <Nav.Link href="/login"><i className="fas fa-user">&nbsp;</i>Login</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header

```

#### `Footer.js`
```js
// /src/components/Footer.js
import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

function Footer() {
    return (
        <footer>
            <Container>
                <Row>
                    <Col className="text-center py-3">Copyright &copy; E-Commerce</Col>
                </Row>
            </Container>
        </footer>
    )
}

export default Footer
```

---
---

### `Home Screen Product Listing`
1. drag the product.js file from resources folder to the src folder.
2. drag the images folder from resources folder to the public folder.
3. Create a directory for Screens

in the Home screen we are going to the product listings, for now we will be using a dummy data but latter on we will make an API and will do this task with Redux.

* `Right now we are going to loop through the dummy data in Products.js file. and show that in the Home screen.`

```js
// /src/screens/HomeScreen.js
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import products from '../products';

function HomeScreen() {
    return (
        <div>
            <h2>Latest products</h2>
            <Row>
                {products.map(product => (
                    <Col sm={12} md={6} lg={4} xl={3}>
                        <h3>{product.name}</h3>
                    </Col>
                ))}
            </Row>
        </div>
    )
}

export default HomeScreen
```
* Know we are going to add this screen to the App.js file
* * Warning: Each child in a list should have a unique "key" prop. to remove this warning we have to add a unique to the looping.
```js
// /src/screens/HomeScreen.js

//.....
<Col key={product._id} sm={12} md={6} lg={4} xl={3}>
    <h3>{product.name}</h3>
</Col>
//.....
```

```js
**** instead of using the `{product.name}` we are going to use a component called `Product` and to the `Product` component we are going to pass the products data (which is a `json object`) as a prop.****

in short to the `Product` component as a Prop, we want to pass in the product object.

we want to this so that we can access the product name, price, image, and description in the `Product` component.

```
```js
// /src/screens/HomeScreen.js

//.....
<Col key={product._id} sm={12} md={6} lg={4} xl={3}>
    <Product product={product} />
</Col>
```
```js
// src/components/Product.js
import React from 'react';
import { Card } from 'react-bootstrap'

function Product() {
    return (
        <Card className="my-3 p-3 rounded">
            Product
        </Card>
    )
}

export default Product

```
at this point we have to destructure the props in the `Product` component so that we don't need to write `props.product.name`.
```js
// src/components/Product.js
//........
//........
<Card className="my-3 p-3 rounded">
    <a href={`/product/${product._id}`}>
        <Card.Img src={product.image} />
    </a>
</Card>
//.......
```
```js
// /src/screens/Product.js
import React from 'react';
import { Card } from 'react-bootstrap'

function Product({ product }) {
    return (
        <Card className="my-3 p-3 rounded">
            <a href={`/product/${product._id}`}>
                <Card.Img src={product.image} />
            </a>

            <Card.Body>
                <a href={`/product/${product._id}`}>
                    <Card.Title as="div">
                        <strong>{product.name}</strong>
                    </Card.Title>
                </a>

                <Card.Text as="div">
                    <div className="my-3">
                        {product.rating} from {product.numReviews} reviews
                    </div>
                </Card.Text>

                <Card.Text as="h3">
                    ${product.price}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Product
```

Now we are going to make a Rating Component.

---
---

### `Rating Component`
 we are going to make a Rating component so that we can use it other pages.
 The Rating component will thak `value` and `text` and `color` as `{Props}`, here value is the rating value and text is the number of reviews that rating from and color is the colour of the stars of rating.

```js
// /src/components/Product.js
<Card.Text as="div">
    <div className="my-3">
        {/* {product.rating} from {product.numReviews} reviews */}
        <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'} />
    </div>
</Card.Text>

```
* Now we are going to make `Rating` component and destructure the props. here we will pass 3 props which are `value, text, and color`.
```js
// src/components/Rating.js

import React from 'react'

function Rating({ value, text, color }) {
    return (
        <div className="">
            <span>
                <i style={{color}} className={
                    value >= 1
                    ? 'fas fa-star'
                    : value >= 0.5
                        ? 'fas fa-star-half-alt'
                        : 'far fa-star
                }>

                </i>
            </span>
        </div>
    )
}

export default Rating
```
* in the above code we passing our first prop to the style which is the `color` prop and the `value` prop to the className. so automatically everywhere we call the Rating component we can pass different color in that call.

* the third prop is the `text` prop. which we will use at the end of the `Rating` component so that if the `text` existed which is the `number of reviews`

```js
 <Rating value={product.rating} text={`${product.numReviews} reviews`} color={{'#f8e825'}} /> 
```
* then we are going to add the `text` prop to the `Rating` component other wise that prop will be empty
<span> {text && text} </span>


```js
// /src/components/Rating.js
import React from 'react'

function Rating({ value, text, color }) {
    return (
        <div className="">
            <span>
                <i style={{color}} className={
                    value >= 1
                        ? 'fas fa-star'
                        : value >= 0.5
                            ? 'fas fa-star-half-alt'
                            : 'far fa-star'
                }>

                    </i>
            </span>
            <span>
                <i style={{color}} className={
                    value >= 2
                        ? 'fas fa-star'
                        : value >= 1.5
                            ? 'fas fa-star-half-alt'
                            : 'far fa-star'
                }>

                    </i>
            </span>
            <span>
                <i style={{color}} className={
                    value >= 3
                        ? 'fas fa-star'
                        : value >= 2.5
                            ? 'fas fa-star-half-alt'
                            : 'far fa-star'
                }>

                    </i>
            </span>
            <span>
                <i style={{color}} className={
                    value >= 4
                        ? 'fas fa-star'
                        : value >= 3.5
                            ? 'fas fa-star-half-alt'
                            : 'far fa-star'
                }>

                    </i>
            </span>
            <span>
                <i style={{color}} className={
                    value >= 5
                        ? 'fas fa-star'
                        : value >= 4.5
                            ? 'fas fa-star-half-alt'
                            : 'far fa-star'
                }>

                    </i>
            </span>
            <span>{text && text}</span>
        </div>
    )
}

export default Rating
```

---
---

### `Routing`
`npm install react-router-dom`


