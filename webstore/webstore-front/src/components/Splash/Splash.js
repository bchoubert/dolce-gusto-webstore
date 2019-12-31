import React from 'react';
import Button from '@material-ui/core/Button';
import LocalCafeIcon from '@material-ui/icons/LocalCafe';

import ComponentSafeUpdate from './../ComponentSafeUpdate/ComponentSafeUpdate';

import { ReactComponent as NescafeMonoLogo } from './../../resources/nescafe-dolce-gusto-mono.svg';

import CoffeeBean from './../../resources/bean.png';
import CoffeePowder from './../../resources/coffee.png';
import CoffeBeansBg from './../../resources/nescafe-bg-1-min.jpg';

import './Splash.scss';

/**
 * Splash
 * 
 * splash screen of the app
 */
class Splash extends ComponentSafeUpdate {

  componentDidMount = () => {
    super.componentDidMount();
  };
  
  componentWillUnmount = () => {
    super.componentWillUnmount();
  };

  render() {
    return <div className="Splash" style={{backgroundImage: `url("${CoffeBeansBg}")`}}>
      <NescafeMonoLogo />
      <Button onClick={() => this.props.toggleDrawer(true)} variant="contained" className="fetch-button">
        <LocalCafeIcon />
        Fetch Drinks
      </Button>
      <div className="bean">
        <span>
          <h2>Coffee Savoir-Faire</h2>
          Selection, roasting, blending and grinding, go behind the scenes and discover how our experts work to offer you professional quality coffees at home.
          All the aromatic richness of great coffees, created from the best origins in the world.
        </span>
        <img src={CoffeeBean} alt="Coffee Bean" />
      </div>
      <div className="powder">
        <img src={CoffeePowder} alt="Coffee powder" />
        <div className="explanation">
          <span>
            <h2>Extra-fine Grinding</h2>
            Used for the production of our Espressos, it accelerates and concentrates the aromas.
          </span>
          <span className="line"></span>
          <span></span>
          <span>
            <h2>Gross Grinding</h2>
            Adapted to the manufacture of our Grandes, it promotes a slower extraction, with more body and flavors.
          </span>
        </div>
      </div>
    </div>;
  }
}

export default Splash;
