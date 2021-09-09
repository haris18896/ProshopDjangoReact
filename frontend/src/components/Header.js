import React from 'react'
import { Navbar,Nav, Container} from 'react-bootstrap'

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
