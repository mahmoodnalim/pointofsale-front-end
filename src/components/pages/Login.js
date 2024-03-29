import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { logo } from '../../assets/images';
import {
  authenticate,
  setLoginErrorFalse,
} from '../../store/actions/authActions';
import Button from '@material-ui/core/Button';
import PersonOutlineRoundedIcon from '@material-ui/icons/PersonOutlineRounded';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { getEmployeeList } from '../../http/employeeApi';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@material-ui/core';
import ErrorDisplay from '../uis/ErrorDisplay';
import useStyles from '../../styles/useStyles';
import CustomPassword from '../uis/FormComponents/Password';
import { fetchApi, setFetchApiInfo } from '../../store/actions/globalAction';

const Login = props => {
  const classes = useStyles();
  const {
    loading,
    onLoginClick,
    isAuthenticated,
    loginError = {},
    setLoginErrorFalse,
    fetchApi,
    setFetchApiInfo,
  } = props;

  const [password, setPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [allEmployees, setAllEmployess] = useState(['Admin']);
  const [employee, setEmployee] = useState({});
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    const handleEmployeeResp = resp => {
      fetchApi(false);
      if (resp) {
        if (Array.isArray(resp.data)) {
          setAllEmployess(resp.data.filter(emp => emp.canLogIn));
        }
      }
    };
    const handlegetEmployeeErr = err => {
      fetchApi(false);
      setFetchApiInfo({
        type: 'error',
        message: 'Unable to get login user names',
      });
    };

    fetchApi(true);
    getEmployeeList()
      .then(handleEmployeeResp)
      .catch(handlegetEmployeeErr);
  }, [fetchApi, setFetchApiInfo]);

  const handleClose = () => {
    setErrorMessage();
    setLoginErrorFalse();
  };

  const handleChange = event => {
    setEmployee(event.target.value);
  };

  const handlePwd = e => setPwd(e.target.value);
  const handleConfirmPwd = e => setConfirmPwd(e.target.value);

  const sendAuthValidation = () => {
    if (employee.id && password) {
      if (employee.isFirstTimeLogin) {
        if (password && confirmPwd) {
          if (password === confirmPwd) {
            return true;
          }
          setErrorMessage({ type: 'error', message: 'Password mismatch' });
          return false;
        }
        setErrorMessage({
          type: 'error',
          message: 'Please enter required fields',
        });
        return false;
      }
      return true;
    }
    setErrorMessage({
      type: 'error',
      message: 'Please enter username and password',
    });
    return false;
  };

  const handleLoginClick = e => {
    e.preventDefault();
    if (sendAuthValidation()) {
      onLoginClick({ employeeId: employee.id, password });
    }
  };

  if (isAuthenticated) return <Redirect to='/' />;

  return (
    <React.Fragment>
      <CssBaseline />
      <Container className={classes.main} maxWidth='sm'>
        <div className={classes.loginPaper}>
          <Paper className={classes.loginRoot}>
            <Paper elevation={2} />
            <div className={classes.loginHeading}>
              <Box
                fontFamily='Monospace'
                fontSize='h5.fontSize'
                fontWeight='fontWeightBold'
                m={1}
                mx={8}
                height={40}
                width={263}
                display='inline-block'
              >
                Welcome to EIT POS
              </Box>
            </div>
            <img src={logo} width='100%' height={250} alt={logo.title} />
            <form onSubmit={handleLoginClick}>
              <div
                className={
                  employee.isFirstTimeLogin
                    ? classes.loginPaperForConfirmPwd
                    : classes.loginPaper
                }
              >
                <Grid
                  container
                  spacing={2}
                  className={classes.loginGridField}
                  alignItems='flex-end'
                >
                  <Grid item className={classes.loginFormFieldIcon}>
                    <PersonOutlineRoundedIcon />
                  </Grid>
                  <Grid item className={classes.loginFormField}>
                    <FormControl className={classes.loginFormControl}>
                      <InputLabel id='login-dropdown'>Username</InputLabel>
                      <Select
                        labelId='login-dropdown'
                        id='login-dropdown'
                        value={employee}
                        onChange={handleChange}
                      >
                        {allEmployees.map((employee, index) => (
                          <MenuItem value={employee} key={index}>
                            {' '}
                            {employee.firstName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <CustomPassword
                  onChange={handlePwd}
                  value={password}
                  label='Password'
                />
                {employee.isFirstTimeLogin && (
                  <CustomPassword
                    onChange={handleConfirmPwd}
                    value={confirmPwd}
                    label='Confirm Password'
                  />
                )}
              </div>
              <Box
                display='flex'
                width={475}
                height={80}
                alignItems='center'
                justifyContent='center'
              >
                <Button
                  className={classes.loginSubmit}
                  variant='contained'
                  xs={12}
                  disabled={loading}
                  color='primary'
                  onClick={handleLoginClick}
                  disableElevation
                >
                  {loading ? (
                    <div className={classes.loginProgress}>
                      <CircularProgress />
                    </div>
                  ) : (
                    'Login'
                  )}
                </Button>
              </Box>
            </form>
            <Box
              className={classes.loginForgotPassword}
              display='flex'
              height={50}
              alignItems='left'
              justifyContent='center'
            >
              <Link href='/forgot-password' className={classes.link}>
                Forgot password
              </Link>
            </Box>
          </Paper>
        </div>
      </Container>
      <ErrorDisplay
        handleClose={handleClose}
        info={errorMessage || loginError}
      />
    </React.Fragment>
  );
};

const mapStateToProps = ({ auth }) => ({
  ...auth,
});

const mapActionToProps = {
  onLoginClick: authenticate,
  setLoginErrorFalse,
  setFetchApiInfo,
  fetchApi,
};

export default connect(mapStateToProps, mapActionToProps)(Login);
