import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import ComponentSafeUpdate from './../ComponentSafeUpdate/ComponentSafeUpdate';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import ListItem from '@material-ui/core/ListItem';
import Snackbar from '@material-ui/core/Snackbar';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import Badge from '@material-ui/core/Badge';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import { ReactComponent as NescafeLogo } from './../../resources/nescafe-dolce-gusto-dark.svg';

import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';

import NetworkService from './../../services/network.service';
import MessageService from './../../services/message.service';
import CartService from './../../services/cart.service';

import Splash from './../Splash/Splash';
import Category from './../Category/Category';
import Product from './../Product/Product';
import Cart from './../Cart/Cart';
import Checkout from './../Checkout/Checkout';
import CheckoutSuccess from './../CheckoutSuccess/CheckoutSuccess';

import './App.scss';

// Custom app theme
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#663700',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#FFFFFF',
      contrastText: '#663700',
    },
  },
});

/**
 * App
 * 
 * Global application component
 */
class App extends ComponentSafeUpdate {

  constructor(props) {
    super(props);
    this.state = {
      // Is drawer opened?
      sideDrawerOpen: false,
      // Fetched categories from Back-End are stored here, to be shown in the drawer
      categories: [],

      // Number of cart items, to be shown in the topbar
      nbCartItems: 0,

      // Snackbar messages
      snackBarOpen: false,
      snackBarMessage: ''
    };
  }

  componentDidMount = () => {
    super.componentDidMount();
    // At start, fetch all categories
    this.fetchCategories();

    // Also initialize the cart service (observer pattern)
    CartService.addObserver(this.onCartUpdate);
    // And initialize the cart content
    this.onCartUpdate(CartService.getCart());

    // Also initialize the message service (observer pattern as well)
    MessageService.addObserver(this.handleMessage);
  };
  
  componentWillUnmount = () => {
    // Remove cart service observer
    CartService.removeObserver(this.onCartUpdate);
    MessageService.removeObserver(this.handleMessage);
    super.componentWillUnmount();
  };

  fetchCategories = () => {
    // Fetch all categories from the Back-End
    NetworkService.getAllCategories()
      .then(categories => this.setState({categories}))
      .catch(MessageService.printMessage);
  };

  // Update the number of items in the cart if the cart got updated (reducer permits to add every quantity)
  onCartUpdate = cart => this.setState({nbCartItems: Object.values(cart).reduce((total, num) => total + num, 0)});

  // Toggle the drawer
  toggleDrawer = toggle => this.setState({sideDrawerOpen: toggle});

  // SnackBar handlers
  handleClose = _ => this.setState({snackBarOpen: false});
  handleMessage = message => this.setState({snackBarMessage: message, snackBarOpen: true});

  render() {
    return <div className="App">
      {/* Theme is applied application-wide */}
      <ThemeProvider theme={theme}>
        <Router>
          {/* Application-wide top navbar */}
          <AppBar position="fixed">
            <Toolbar>
              <IconButton aria-label="menu" color="inherit" aria-controls="category-menu" aria-haspopup="true" onClick={() => this.toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component={Link} to="/" className="white">
                <i className="icon icon-bean"></i>
                Nescafe Dolce Gusto Webstore
              </Typography>
              <Drawer className="drawer" open={this.state.sideDrawerOpen} onClose={() => this.toggleDrawer(false)}>
                <div role="presentation" onClick={() => this.toggleDrawer(false)} onKeyDown={() => this.toggleDrawer(false)}>
                  <Link to={`/`}>
                    <NescafeLogo />
                  </Link>
                  <List>
                    {this.state.categories.map(category => 
                      <ListItem button key={category.id} component={Link} to={`/category/${category.id}`}>
                        <ListItemText primary={<span>
                          <i className={`icon icon-${category.id}`}></i>
                          {category.label}
                        </span>} />
                      </ListItem>
                    )}
                  </List>
                </div>
              </Drawer>
              <div style={{ flexGrow: 1 }}></div>
              <IconButton aria-label="Cart" component={Link} to="/cart" className="white">
                <Badge badgeContent={this.state.nbCartItems} color="secondary">
                  <ShoppingBasketIcon />
                </Badge>
              </IconButton>
            </Toolbar>
          </AppBar>

          {/* Snackbar is opened only if a message should be printed */}
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={this.state.snackBarOpen}
            autoHideDuration={6000}
            onClose={this.handleClose}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{this.state.snackBarMessage}</span>}
            action={[
              <IconButton
                key="close"
                aria-label="close"
                color="inherit"
                onClick={this.handleClose} >

                <CloseIcon />
              </IconButton>,
            ]} />

          {/* Route Switch */}
          <Switch>
            <Route exact path="/" component={props => <Splash {...props} toggleDrawer={this.toggleDrawer} />} />
            <Route path="/category/:categoryId" component={props => <Category {...props} toggleDrawer={this.toggleDrawer} />} />
            <Route path="/product/:productId" component={props => <Product {...props} />} />
            <Route path="/cart" component={props => <Cart {...props} toggleDrawer={this.toggleDrawer} />} />
            <Route path="/checkout" component={props => <Checkout {...props} toggleDrawer={this.toggleDrawer} />} />
            <Route path="/checkoutsuccess/:orderId" component={props => <CheckoutSuccess {...props} toggleDrawer={this.toggleDrawer} />} />
          </Switch>
        </Router>
      </ThemeProvider>
    </div>;
  }
}

export default App;
