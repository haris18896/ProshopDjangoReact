import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Button, Card, Form } from 'react-bootstrap';
import Rating from '../components/Rating';
import { useSelector, useDispatch } from 'react-redux';
import { listProductDetails } from '../actions/productActions'; 
import Loader from '../components/Loader';
import Message from '../components/Message';

function ProductScreen({ match,  history }) {

    const [qty, setQty] = useState(1);

    const dispatch = useDispatch();

    const productDetails = useSelector(state => state.productDetails);
    const { product, loading, error } = productDetails;

    useEffect (() => {
        dispatch(listProductDetails(match.params.id))
    }, []);

    const addToCartHandler = () => {
        console.log("Add to Cart", match.params.id)
        history.push(`/cart/${match.params.id}?qty=${qty}`);
    }


    return (
        <div>
            <Link to="/" className="btn btn-dark my-3">Go Back</Link>
            {loading ?
                 <Loader />
                    : error ?
                         <Message variant="danger">{error}</Message> 
                         :(
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
                                        </ListGroup>
                                    </Card>
                                </Col>
                            </Row>
                    )
            }
         </div>
)
        }
export default ProductScreen;
