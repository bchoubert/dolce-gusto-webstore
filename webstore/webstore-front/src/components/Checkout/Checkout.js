import React from 'react';
import { Link, Redirect } from 'react-router-dom';

import ComponentSafeUpdate from './../ComponentSafeUpdate/ComponentSafeUpdate';

import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import MailIcon from '@material-ui/icons/Mail';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CheckIcon from '@material-ui/icons/Check';
import LocalCafeIcon from '@material-ui/icons/LocalCafe';

import Table from '@material-ui/core/Table';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import CartService from './../../services/cart.service';
import MessageService from './../../services/message.service';
import NetworkService from './../../services/network.service';

import './Checkout.scss';

// Available countries that support shipping
const countries = {
  UK: 'United Kingdom',
  BE: 'Belgium',
  FR: 'France',
  IT: 'Italy',
  SP: 'Spain',
  PT: 'Portugal',
  SW: 'Switzerland',
  DE: 'Germany',
  LX: 'Luxembourg',
  NL: 'Netherlands',
  IR: 'Ireland'
};

/**
 * Checkout
 * 
 * Checkout component with user's details form
 */
class Checkout extends ComponentSafeUpdate {

  constructor(props) {
    super(props);
    this.state = {
      // Cart content
      cart: {},

      // User's details form
      selectedCountry: Object.keys(countries)[0],
      email: '',
      fullname: '',
      city: '',
      address: '',
      postalCode: '',
      
      // Once the user validates the form, we store the created order id here
      orderCreatedId: null
    };
  }

  componentDidMount = () => {
    super.componentDidMount();
    // Initialize the cart service (observer pattern)
    CartService.addObserver(this.onCartUpdate);
    // And we fetch the cart a first time
    this.onCartUpdate();
  };
  
  componentWillUnmount = () => {
    // Remove the cart service observer
    CartService.removeObserver(this.onCartUpdate);
    super.componentWillUnmount();
  };

  shouldComponentUpdate = (_, nextState) => {
    // We update the component only if the cart is changed or if the order was created
    if(Object.keys(this.state.cart).length !== Object.keys(nextState.cart).length) {
      this.setState({cart: nextState.cart});
    }
    if(!!nextState.orderCreatedId && this.state.orderCreatedId !== nextState.orderCreatedId) {
      this.setState({orderCreatedId: nextState.orderCreatedId});
    }
    return true;
  };

  onCartUpdate = () => {
    // Fetch the cart from the Back-End (to get details about products as well as cart content)
    CartService.getLoadedCart()
      .then(cart => this.setState({cart}))
      .catch(MessageService.printMessage);
  };

  // Generic handleChange function util for forms
  handleChange = (value, fieldName) => this.setState({[fieldName]: value});

  // Form validation
  placeOrder = () => {
    if(!this.state.fullname || !this.state.email || !this.state.address || !this.state.postalCode || !this.state.city) {
      MessageService.printMessage('All fields are mandatory!');
      return false;
    }

    // Create the order
    NetworkService.order({
      fullname: this.state.fullname,
      country: this.state.selectedCountry,
      city: this.state.city,
      postalCode: this.state.postalCode,
      address: this.state.address,
      email: this.state.email,
      // Passing along the cart content that is stored in the localStorage
      cart: JSON.stringify(CartService.getCart())
    })
    .then(data => {
      // On creation, set the order id to redirect the user to success page
      this.setState({orderCreatedId: data.orderId});
      // Show a message
      MessageService.printMessage('You placed the order #' + data.orderId);
      // Then empty the user cart (the user just ordered)
      CartService.__emptyCart();
    })
    .catch(MessageService.printMessage);
  };
  
  render() {
    // If the order was created, redirect on success page
    if(!!this.state.orderCreatedId) {
      return <Redirect to={`/checkoutsuccess/${this.state.orderCreatedId}`} />;
    }

    // Compute cart total
    let sum = 0;
    if(!!this.state.cart && !!Object.keys(this.state.cart).length) {
      sum = Object.keys(this.state.cart).map(cartLineKey => this.state.cart[cartLineKey].quantity * parseFloat(this.state.cart[cartLineKey].price)).reduce((total, num) => total + num, 0);
    }

    return <div className="Checkout">
      <h1>
        <ShoppingBasketIcon />
        Checkout
      </h1>
      {!!this.state.cart && !!Object.keys(this.state.cart).length && <TableContainer component={Paper} className="table-container">
        <Table aria-label="Checkout" size="small">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="center">Price</TableCell>
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
                    {this.state.cart[cartLineKey].quantity}
                  </span>
                </TableCell>
                <TableCell align="center">{(this.state.cart[cartLineKey].quantity * parseFloat(this.state.cart[cartLineKey].price)).toFixed(2)} €</TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell></TableCell>
              <TableCell align="center">{sum.toFixed(2)} €</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>}
      {!!this.state.cart && !!Object.keys(this.state.cart).length && <div className="Checkout-form">
        <TextField className="Checkout-form-field Checkout-form-field-50" value={this.state.fullname} onChange={e => this.handleChange(e.target.value, 'fullname')} type="text" label="Full Name" autoComplete="name" required InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircleIcon />
            </InputAdornment>
          )
        }} />
        <TextField className="Checkout-form-field Checkout-form-field-50" value={this.state.email} onChange={e => this.handleChange(e.target.value, 'email')} type="email" label="E-mail Address" autoComplete="email" required />
        <TextField className="Checkout-form-field Checkout-form-field-100" value={this.state.address} onChange={e => this.handleChange(e.target.value, 'address')} type="text" label="Shipping Address" autoComplete="shipping street-address" required InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MailIcon />
            </InputAdornment>
          )
        }} />
        <TextField className="Checkout-form-field Checkout-form-field-25" value={this.state.postalCode} onChange={e => this.handleChange(e.target.value, 'postalCode')} type="text" label="Postal Code" autoComplete="shipping postal-code" required />
        <TextField className="Checkout-form-field Checkout-form-field-50" value={this.state.city} onChange={e => this.handleChange(e.target.value, 'city')} type="text" label="City" autoComplete="shipping address-level2" required />

        <TextField
          select
          label="Country"
          autoComplete="shipping country-name"
          required
          value={this.state.selectedCountry}
          onChange={e => this.handleChange(e.nativeEvent.target.value, 'selectedCountry')}
          SelectProps={{ native: true }}
          helperText="Shipping is not available worldwide"
          className="Checkout-form-field Checkout-form-field-25">
            {Object.keys(countries).map(key => (
              <option key={key} value={key}>{countries[key]}</option>
            ))}
        </TextField>

        <Button variant="contained" color="primary" onClick={this.placeOrder}>
          <CheckIcon />
          Place Order
        </Button>
      </div>}
      <div className="Checkout-actions">
        <Button onClick={() => this.props.toggleDrawer(true)} variant="contained">
          <LocalCafeIcon />
          Continue Shopping
        </Button>
      </div>
    </div>;
  }
}

export default Checkout;
