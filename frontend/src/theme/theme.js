import { createMuiTheme } from '@material-ui/core/styles';
import pink from "@material-ui/core/es/colors/pink";
import grey from "@material-ui/core/es/colors/grey";
import blue from "@material-ui/core/es/colors/blue";

const theme = createMuiTheme({
    palette: {
      primary: {500: '#07284D'},
      secondary: {'A400': '#ffc601'},
    },
  overrides: {
    MuiButton: {
      root: {
        background: '#ffc601',
        borderRadius: 3,
        border: 0,
        color: 'white',
        margin: 5,
      },
    },
    MuiTypography: {
      colorTextPrimary: {
        color:"#FFFFFF"
      },
      colorTextSecondary: {
        color: "#000000",
      }
    }
  },
  typography: {
    useNextVariants: true,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    fontSize: 14,
  }
});

export default theme;
