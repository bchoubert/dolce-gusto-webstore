import React from 'react';
import { Link } from 'react-router-dom';

import ComponentSafeUpdate from './../ComponentSafeUpdate/ComponentSafeUpdate';

import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import NetworkService from './../../services/network.service';
import MessageService from './../../services/message.service';
import CartService from './../../services/cart.service';

import Pod from './../Pod/Pod';

import './Product.scss';

class Product extends ComponentSafeUpdate {

  constructor(props) {
    super(props);
    this.state = {
      productId: props.match.params.productId,
      productDetails: null,

      selectedProductType: ''
    };
  }

  componentDidMount = () => {
    super.componentDidMount();
    this.getProductDetails();
  };
  
  componentWillUnmount = () => {
    super.componentWillUnmount();
  };

  getProductDetails = () => {
    NetworkService.getProductDetails(this.state.productId)
      .then(productDetails => this.setState({productDetails}))
      .catch(MessageService.printMessage);
  };

  addToCart = () => {
    CartService.addItem(this.state.selectedProductType);
    MessageService.printMessage('Product added to Cart');
  };

  handleChange = e => this.setState({selectedProductType: e.target.value});

  render() {
    if(!this.state.productDetails) {
      return null;
    }
    return <div className="Product">
      <div className="Product-actions">
        <Button variant="contained" component={Link} to={`/category/${this.state.productDetails.category.id}`}>
          <NavigateBeforeIcon />
          Back to {this.state.productDetails.category.label}
        </Button>
      </div>
      <div className="Product-images">
        {!!this.state.productDetails.category.isDrinkCategory && <Pod {...this.state.productDetails} /> }

        <span className="Product-image" style={{ backgroundImage: `url("${require(`./../../resources/products/${this.state.productDetails.id}p.png`)}")` }}></span>
      </div>

      <div className="Product-line" style={{ borderColor: this.state.productDetails.color }}>
        <div className="Product-top" style={{ backgroundColor: this.state.productDetails.color }}>
          <h2 className={'Product-top-name ' + (!!this.state.productDetails.isLightColor ? 'Product-top-name-light' : '')}>
            <i className={'icon icon-' + this.state.productDetails.category.id}></i>
            {this.state.productDetails.name}
            {!!this.state.productDetails.type && <span className="Product-top-type" style={{ 
                color: (!!this.state.productDetails.typeColor ? '#FFFFFF' : this.state.productDetails.color), 
                backgroundColor: (this.state.productDetails.typeColor || '#FFFFFF') }}>
              {this.state.productDetails.type}
            </span>}
          </h2>
        </div>

        <div className="Product-details">
          <span className="Product-details-image" style={{ backgroundImage: `url("${require(`./../../resources/products/${this.state.productDetails.id}.png`)}")` }}></span>
          <span className="Product-details-text">
            {this.state.productDetails.description}
          </span>
        </div>

        <div className="Product-order" style={{ backgroundColor: this.state.productDetails.color }}>
          <FormControl className={'form-control ' + (!!this.state.productDetails.isLightColor ? 'form-control-light' : '')}>
            <InputLabel htmlFor="type-select">Selection</InputLabel>
            <Select
              className="product-type-select"
              value={this.state.selectedProductType}
              onChange={this.handleChange} >

              {!this.state.productDetails.category.isDrinkCategory && this.state.productDetails.types.map(type => 
                <MenuItem key={type.id} value={type.id}>
                  <span className="Product-type-color" style={{ backgroundColor: type.color }}></span>
                  {type.name} - {type.price} €
                </MenuItem>
              )}
              {!!this.state.productDetails.category.isDrinkCategory && this.state.productDetails.types.map(type => 
                <MenuItem key={type.id} value={type.id}>
                  <i className="icon icon-pod"></i>
                  {type.number} pods - {type.price} €
                </MenuItem>
              )}
            </Select>
          </FormControl>
          {!!this.state.selectedProductType && <Button onClick={this.addToCart} variant="contained"><AddShoppingCartIcon /> Add to cart</Button>}
          {!this.state.selectedProductType && <Button variant="contained" disabled><AddShoppingCartIcon /> Add to cart</Button>}
        </div>
      </div>
      
    </div>;
  }
}

export default Product;
