import React from 'react';
import { Link } from 'react-router-dom';

import ComponentSafeUpdate from './../ComponentSafeUpdate/ComponentSafeUpdate';

import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import LocalCafeIcon from '@material-ui/icons/LocalCafe';

import Table from '@material-ui/core/Table';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import CartService from './../../services/cart.service';
import MessageService from './../../services/message.service';

import './Cart.scss';

/**
 * Cart
 * 
 * Component that print the user cart (stored in localstorage)
 */
class Cart extends ComponentSafeUpdate {

  constructor(props) {
    super(props);
    this.state = {
      // Fetched cart is stored here
      cart: {}
    };
  }

  componentDidMount = () => {
    super.componentDidMount();
    // Initialize the cart service (observer pattern)
    CartService.addObserver(this.onCartUpdate);
    this.onCartUpdate();
  };
  
  componentWillUnmount = () => {
    // Remove cart service observer
    CartService.removeObserver(this.onCartUpdate);
    super.componentWillUnmount();
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    // Component should only update if the cart is modified
    if(Object.keys(this.state.cart).length !== Object.keys(nextState.cart).length) {
      this.setState({cart: nextState.cart});
    }
    return true;
  };

  onCartUpdate = () => {
    // On cart update, fetch the cart again from the Back-End (to get details about products as well as cart content)
    CartService.getLoadedCart()
      .then(cart => this.setState({cart}))
      .catch(MessageService.printMessage);
  };
  
  render() {
    // Compute cart total
    let sum = 0;
    if(!!this.state.cart && !!Object.keys(this.state.cart).length) {
      sum = Object.keys(this.state.cart).map(cartLineKey => this.state.cart[cartLineKey].quantity * parseFloat(this.state.cart[cartLineKey].price)).reduce((total, num) => total + num, 0);
    }
    return <div className="Cart">
      <h1>
        <ShoppingBasketIcon />
        Cart
      </h1>
      {!!this.state.cart && !!Object.keys(this.state.cart).length && <TableContainer component={Paper} className="table-container">
        <Table aria-label="Cart">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="center">Price</TableCell>
              <TableCell className="delete-cell"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(this.state.cart).map(cartLineKey => 
              <TableRow key={cartLineKey}>
                <TableCell component="th" scope="row">
                  <Link to={`/product/${this.state.cart[cartLineKey].product.id}`} style={{ color: this.state.cart[cartLineKey].product.color }}>
                    <i className={`icon icon-${this.state.cart[cartLineKey].product.category.id}`}></i>
                    {!!this.state.cart[cartLineKey].product.category.isDrinkCategory &&
                      <span>
                        {this.state.cart[cartLineKey].product.name} 
                        {!!this.state.cart[cartLineKey].product.type && <span className="Product-type" style={{ 
                            color: (!!this.state.cart[cartLineKey].product.typeColor ? '#FFFFFF' : this.state.cart[cartLineKey].product.color), 
                            backgroundColor: (this.state.cart[cartLineKey].product.typeColor || '#FFFFFF'),
                            borderColor: (this.state.cart[cartLineKey].product.typeColor ? this.state.cart[cartLineKey].product.typeColor : this.state.cart[cartLineKey].product.color) }}>
                          {this.state.cart[cartLineKey].product.type}
                        </span>} - <i className="icon icon-pod"></i> {this.state.cart[cartLineKey].number}
                      </span>
                    }
                    {!this.state.cart[cartLineKey].product.category.isDrinkCategory &&
                      <span>
                        {this.state.cart[cartLineKey].product.name} - 
                        <span className="Product-type-color" style={{ backgroundColor: this.state.cart[cartLineKey].color }}></span>
                        {this.state.cart[cartLineKey].name}
                      </span>
                    }
                  </Link>
                </TableCell>
                <TableCell align="center" className="quantity-cell">
                  <span className="quantity-cell-inner">
                    <IconButton onClick={() => CartService.modifyQuantity(cartLineKey, (parseInt(this.state.cart[cartLineKey].quantity) - 1))}>
                      <RemoveCircleIcon />
                    </IconButton>
                    {this.state.cart[cartLineKey].quantity}
                    <IconButton onClick={() => CartService.modifyQuantity(cartLineKey, (parseInt(this.state.cart[cartLineKey].quantity) + 1))}>
                      <AddCircleIcon />
                    </IconButton>
                  </span>
                </TableCell>
                <TableCell align="center">{(this.state.cart[cartLineKey].quantity * parseFloat(this.state.cart[cartLineKey].price)).toFixed(2)} €</TableCell>
                <TableCell className="delete-cell">
                  <IconButton onClick={() => CartService.modifyQuantity(cartLineKey, 0)}>
                    <DeleteForeverIcon className="delete-icon" />
                  </IconButton>
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell></TableCell>
              <TableCell align="center">
                <Button variant="contained" color="primary" component={Link} to={`/checkout`} className="white">
                  <ShoppingCartIcon />
                  Checkout - {sum.toFixed(2)} €
                </Button>
              </TableCell>
              <TableCell className="delete-cell"></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>}
      {(!this.state.cart || !Object.keys(this.state.cart).length) && <h4>Your cart is empty :(</h4>}
      <div className="Cart-actions">
        <Button onClick={() => this.props.toggleDrawer(true)} variant="contained">
          <LocalCafeIcon />
          Continue Shopping
        </Button>
      </div>
    </div>;
  }
}

export default Cart;
