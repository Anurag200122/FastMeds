import React, { useEffect } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { DarkTheme } from './Theme/DarkTheme.js';
import { Routers } from './Routers/Routers.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from './component/State/Authentication/Action.js';
import { findCart } from './component/State/Cart/Action.js';
import { getPharmacyByUserId } from './component/State/Pharmacy/Action.js';
import { LightTheme } from './Theme/LightTheme.js';

function App() {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { auth } = useSelector((store) => store);

  // Fetch user and cart data on component mount or when auth.jwt changes
  useEffect(() => {
    if (auth.jwt || jwt) {
      dispatch(getUser(auth.jwt || jwt));
      dispatch(findCart(jwt));
    }
  }, [auth.jwt]);

  useEffect(()=>{
    dispatch(getPharmacyByUserId(auth.jwt || jwt))

  },[auth.user])

  return (
    <ThemeProvider theme={LightTheme}>
      <CssBaseline />
      <Routers />
    </ThemeProvider>
  );
}

export default App;