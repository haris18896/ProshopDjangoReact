import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Footer from "./components/Footer";
import Header from "./components/Header";
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen'
import LoginScreen from './screens/LoginScreen'


function App() {
  return (
    <Router>
       <div>
        <Header />

        <main className="py-3">
          <Container>
            <Switch>
              <Route exact path="/" component={HomeScreen} />
              <Route exact path="/login" component={LoginScreen} />
              <Route exact path="/product/:id" component={ProductScreen} />
              <Route exact path="/cart/:id?" component={CartScreen} />
            </Switch>
          </Container>
        </main>

        <Footer />
      </div>
    </Router>
   
  );
}

export default App;
