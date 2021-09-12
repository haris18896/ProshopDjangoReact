import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Button, Card } from 'react-bootstrap';
import Rating from '../components/Rating';
// import products from '../products';
import axios from 'axios';

function ProductScreen({ match }) {

    const [product, setProduct] = useState([]);
    // const product = products.find((p) => p._id === match.params.id);

    useEffect (() => {
        // console.log('useEffect is triggered')
        async function fetchProduct(){
            const {data} = await axios.get(`/api/products/${match.params.id}`)
            setProduct(data)
        }

        fetchProduct();
    }, []);

    return (
        <div>
            <Link to="/" className="btn btn-dark my-3">Go Back</Link>
            <Row>
                <Col md={6}>
                    <Image src={product.image} alt={product.name} fluid />
                </Col>

                <Col md={3}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h3><strong>{product.name}</strong></h3>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Rating value={product.rating} text={product.numReviews + ' reviews'} color={`#f8e825`}/>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            Price: $<strong>{product.price}</strong>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            Description: <strong>{product.description}</strong>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>

                <Col md={3}>
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <Row>
                                    <Col>Price: </Col>
                                    <Col>$<strong>{product.price}</strong></Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Status: </Col>
                                    <Col>{product.countInStock > 0 ? "In Stock" : "Out of Stock"}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Button className="btn-block" type="button" disabled={product.countInStock === 0}>Add To Cart</Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default ProductScreen
