import * as React from 'react';
import logo from '../assets/burung_nusatrip.png';
import Hamburger from './humberger';
import { Toolbar, AppBar } from '@mui/material';
import { useMediaQuery } from 'react-responsive';


const Appbar = () => {
  const isMobileDevice = useMediaQuery({
    query: "(max-device-width: 480px) and (min-device-width: 320px)",
  });

  const isTablet = useMediaQuery({
    query : "(max-device-width: 768px) and (min-device-width: 481px)",
  });

  const isLaptop = useMediaQuery({
    query: "(max-device-width: 1024px) and (min-device-width: 769px)",
  });

  const isDesktop = useMediaQuery({
    query: "(min-device-width: 1025px)",
  });


  return (
    <>
      <AppBar sx={{ bgcolor: '#004360', boxShadow: 'none', paddingX:"50px" }}>

      {isMobileDevice && 
          <Toolbar sx={{ justifyContent: 'flex-end' }}>
          <div sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <img
              src={logo}
              alt="logo"
              sx={{ mr: 1, marginTop: 16,maxWidth: 200,
              maxHeight: 200}}
              style={{
                marginTop: '16px',
                width:186 , height: 39,
              }}
            />
          </div>
          <Hamburger />
        </Toolbar>
        }
        {isDesktop &&
          <Toolbar sx={{ justifyContent: 'flex-end' }}>
          <div sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <img
              src={logo}
              alt="logo"
              sx={{ mr: 1, marginTop: 16 }}
              style={{
                marginTop: '16px',
              }}
            />
          </div>
          <Hamburger />
        </Toolbar>
        }
        {isTablet && 
          <Toolbar sx={{ justifyContent: 'flex-end' }}>
          <div sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <img
              src={logo}
              alt="logo"
              sx={{ mr: 1, marginTop: 16 }}
              style={{
                marginTop: '16px',
              }}
            />
          </div>
         
          <Hamburger />
        </Toolbar>
        }
        { isLaptop &&
          <Toolbar sx={{ justifyContent: 'flex-end' }}>
          <div sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <img
              src={logo}
              alt="logo"
              sx={{ mr: 1, marginTop: 16 }}
              style={{
                marginTop: '16px',
              }}
            />
          </div>
          <Hamburger />
        </Toolbar>
        }
        
      </AppBar>
    </>
  );
};

export default Appbar;
