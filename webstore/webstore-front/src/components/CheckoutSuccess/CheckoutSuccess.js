import React from 'react';
import Button from '@material-ui/core/Button';
import LocalCafeIcon from '@material-ui/icons/LocalCafe';
import CheckIcon from '@material-ui/icons/Check';

import ComponentSafeUpdate from './../ComponentSafeUpdate/ComponentSafeUpdate';

import './CheckoutSuccess.scss';

/**
 * CheckoutSuccess
 * 
 * Success page once the user ordered
 */
class CheckoutSuccess extends ComponentSafeUpdate {

  componentDidMount = () => {
    super.componentDidMount();
  };
  
  componentWillUnmount = () => {
    super.componentWillUnmount();
  };

  render() {
    return <div className="CheckoutSuccess">
      <h2>
        <CheckIcon />
        You placed the order #{this.props.match.params.orderId}
      </h2>
      <p>You will receive an email soon to track your order.</p>
      <div className="CheckoutSuccess-actions">
        <Button onClick={() => this.props.toggleDrawer(true)} variant="contained" className="fetch-button">
          <LocalCafeIcon />
          Fetch Drinks
        </Button>
      </div>
    </div>;
  }
}

export default CheckoutSuccess;
