import React from 'react';
import { Link } from 'react-router-dom';

import ComponentSafeUpdate from './../ComponentSafeUpdate/ComponentSafeUpdate';

import LocalCafeIcon from '@material-ui/icons/LocalCafe';

import Button from '@material-ui/core/Button';

import NetworkService from './../../services/network.service';
import MessageService from './../../services/message.service';

import './Category.scss';

/**
 * Category
 * 
 * Show a category and its products
 */
class Category extends ComponentSafeUpdate {

  constructor(props) {
    super(props);
    this.state = {
      // Store the category id got from the URL
      categoryId: props.match.params.categoryId,

      // Category Details fetched from the Back-End
      categoryDetails: null
    };
  }

  componentDidMount = () => {
    super.componentDidMount();
    // Get the category that corresponds to the categoryId
    this.getCategoryDetails();
  };
  
  componentWillUnmount = () => {
    super.componentWillUnmount();
  };

  shouldComponentUpdate = (nextProps, _) => {
    // We should update only if the categoryId is modified
    if(!!nextProps.match.params.categoryId && nextProps.match.params.categoryId !== this.state.categoryId) {
      // And if that's the case, we set the new categoryId, and fetch the category again from the Back-End
      this.setState({categoryId: nextProps.match.params.categoryId}, this.getCategoryDetails);
    }
    return true;
  };

  // Get category from the Back-End
  getCategoryDetails = () => {
    NetworkService.getCategoryDetails(this.state.categoryId)
      .then(categoryDetails => this.setState({categoryDetails}))
      .catch(MessageService.printMessage);
  };

  render() {
    if(!this.state.categoryDetails) {
      return null;
    }
    return <div className="Category">
      <h1>
        <i className={`icon icon-${this.state.categoryDetails.id}`}></i>
        {this.state.categoryDetails.label}
      </h1>
      <div className="Category-products">
        {this.state.categoryDetails.products.map(product =>
          <Link to={`/product/${product.id}`} key={product.id} className={'product ' + (!!product.isLightColor ? 'product--light' : '')} style={{ backgroundColor: `${product.color}`, borderColor: `${product.color}` }}>
            <span className="product-preview" style={{ backgroundImage: `url("${require(`./../../resources/products/${product.id}p.png`)}")` }}></span>
            <span className="product-name">
              <h2>{product.name} {!!product.type ? product.type : ''}</h2>
              <span className="product-description">{product.shortDescription}</span>
            </span>
          </Link>  
        )}
      </div>
      <div className="Category-actions">
        <Button onClick={() => this.props.toggleDrawer(true)} variant="contained">
          <LocalCafeIcon />
          Fetch Other {!!this.state.categoryDetails.isDrinkCategory ? 'Drinks' : 'Products'}
        </Button>
      </div>
    </div>;
  }
}

export default Category;
