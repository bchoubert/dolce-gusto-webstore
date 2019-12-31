import React from 'react';

import ComponentSafeUpdate from './../ComponentSafeUpdate/ComponentSafeUpdate';

import { ReactComponent as NescafeLogo } from './../../resources/nescafe-dolce-gusto.svg';

import './Pod.scss';

/**
 * Pod
 * 
 * Graphic element that represents a Nescafe Dolce Gusto drink pod, along with its types, logo and water indicator
 */
class Pod extends ComponentSafeUpdate {

  componentDidMount = () => {
    super.componentDidMount();
  };
  
  componentWillUnmount = () => {
    super.componentWillUnmount();
  };

  render() {
    return <div className="Pod" style={{ backgroundColor: (!!this.props.color ? this.props.color : 'var(--main)') }}>
      <ul className="Pod-indicator">
        {/* Create the famous 7-part water indicator, and apply data-fill if the drink needs this much water */}
        {([...Array(7).keys()]).map(i => <li key={i} data-indicate={i} data-fill={(7 - i) <= this.props.indicator}></li>)}
      </ul>
      <NescafeLogo/>
      <span className="Pod-name">{this.props.name}</span>
      {!!this.props.type && !!this.props.typeColor && 
        <span className="Pod-type" style={{ color: '#FFFFFF', backgroundColor: this.props.typeColor }}>{this.props.type}</span>}

      {!!this.props.type && !this.props.typeColor && 
        <span className="Pod-type" style={{ color: (!!this.props.color ? this.props.color : 'var(--main)') }}>{this.props.type}</span>}
    </div>;
  }
}

export default Pod;
