import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import { useDispatch, useSelector } from 'react-redux';

import { listProducts} from '../actions/productActions';
import Loader from '../components/Loader';
import Message from '../components/Message';

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
            {loading ? <Loader />
                : error ? <Message variant="danger">{error}</Message>
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
