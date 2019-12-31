import { Component } from 'react';

/**
 * ComponentSafeUpdate
 * 
 * Generic component to handle React Lifecycle
 * Goal here is to provide an overwrite of the setState React method that set the state only if the component is mounted
 */
class ComponentSafeUpdate extends Component {

  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  setState = (obj, callback) => {
    !!this._isMounted && super.setState(obj, callback);
  }
}

export default ComponentSafeUpdate;
