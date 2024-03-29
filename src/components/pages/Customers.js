import React, { useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import TableBuilder from '../uis/TableBuilder.js';
import { useHistory } from 'react-router-dom';
import {
  getCustomerTableHeaders,
  getDueCustomerTableHeaders,
} from '../../utilities/helpers/tableHelpers.js';
import { getCustomerList, searchCustomer } from '../../http/customerApi';
import { fetchApi, setFetchApiInfo } from '../../store/actions/globalAction.js';
import useStyles from '../../styles/useStyles.js';
import {
  TextField,
  CircularProgress,
  Switch,
  FormControlLabel,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CreateNew from '../uis/CreateNew.js';

const Customers = ({ fetchApi, setFetchApiInfo }) => {
  const { location, push } = useHistory();
  const [customerList, setCustomerList] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [fetchCustomers, setFetchCustomers] = useState(false);
  const [isCreditCustomers, setIsCreditCustomers] = useState(false);
  const [allCustomerList, setAllCustomerList] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    const handleGetCustomerResp = res => {
      fetchApi(false);
      if (Array.isArray(res.data)) {
        const displayCustomerList = getFormattedList(res.data);
        setCustomerList(displayCustomerList);
        setAllCustomerList(displayCustomerList);
      }
    };
    const handleGetCustomerErr = _err => {
      setFetchApiInfo({ type: 'error', message: 'Unable to get customers' });
      fetchApi(false);
    };
    fetchApi(true);
    getCustomerList()
      .then(handleGetCustomerResp)
      .catch(handleGetCustomerErr);
  }, [fetchApi, setFetchApiInfo]);

  const handleEdit = customer => {
    const editClick = () => {
      push(`${location.pathname}/edit/${customer.id}`);
    };
    return editClick;
  };

  const handleSearchSubmit = (_e, value) => {
    const handleGetCustomerByIdSuccess = res => {
      fetchApi(false);
      if (Array.isArray(res.data)) {
        const displayCustomerList = getFormattedList(res.data);
        setCustomerList(displayCustomerList);
      }
    };
    const handleGetCustomerByIdErr = _err => {
      setFetchApiInfo({
        type: 'error',
        message: 'Unable to filter customer detail',
      });
      fetchApi(false);
    };
    searchCustomer(value.id)
      .then(handleGetCustomerByIdSuccess)
      .catch(handleGetCustomerByIdErr);
  };
  const handleCreditCustomersToggler = e => {
    setIsCreditCustomers(e.target.checked);
  };

  const handleSearchChange = e => {
    const searchSuccess = res => {
      setFetchCustomers(false);
      console.log(res.data);
      if (Array.isArray(res.data)) {
        setSuggestions(res.data);
        const displayCustomerList = getFormattedList(res.data);
        setCustomerList(displayCustomerList);
      }
    };

    const searchErr = () => {
      setFetchApiInfo({ type: 'error', message: 'Unable to search customers' });
      setFetchCustomers(false);
    };
    setFetchCustomers(true);
    if (e.target.value.length) {
      searchCustomer(e.target.value)
        .then(searchSuccess)
        .catch(searchErr);
    } else {
      setCustomerList(allCustomerList);
    }
  };

  const searchComponent = (
    <div className={classes.inputsTop}>
      <div className={classes.searchTab}>
        <Autocomplete
          id='customer search-item-search'
          getOptionLabel={option => `${option.firstName}-${option.lastName}`}
          options={suggestions}
          onChange={handleSearchSubmit}
          loading={fetchCustomers}
          renderInput={params => (
            <TextField
              autoFocus
              {...params}
              label='Enter a Customer name or Id'
              noOptionsText={'No customers found'}
              variant='outlined'
              onChange={handleSearchChange}
              InputProps={{
                ...params.InputProps,
                startAdornment: <SearchIcon />,
                endAdornment: (
                  <Fragment>
                    {fetchCustomers && (
                      <CircularProgress color='inherit' size={20} />
                    )}
                    {params.InputProps.endAdornment}
                  </Fragment>
                ),
              }}
            />
          )}
        />
      </div>
    </div>
  );
  let customerTableData;
  if (isCreditCustomers) {
    customerTableData = customerList.filter(({ dueTotal }) => dueTotal > 0);
    customerTableData = customerTableData.map(
      ({ id, firstName, lastName, phoneNo, dueTotal }, index) => {
        return { id, firstName, lastName, phoneNo, dueTotal };
      }
    );
  } else {
    customerTableData = customerList.map(
      ({ id, firstName, lastName, phoneNo }, index) => {
        return { id, firstName, lastName, phoneNo };
      }
    );
  }
  const handlePayButttonClick = customer => {
    const handlePayClick = () => {
      push(`/cashbooks/payCustomerDue/${customer.id}`);
    };
    return handlePayClick;
  };

  return (
    <Fragment>
      <div className={classes.pageContainer}>
        <CreateNew type='customers' />
        {searchComponent}
        <div>
          <FormControlLabel
            control={
              <Switch
                checked={isCreditCustomers}
                onChange={handleCreditCustomersToggler}
                name='credit-customer-toggler'
              />
            }
            value={isCreditCustomers}
            label='Show Credit Customers'
            labelPlacement='start'
          />
        </div>

        <TableBuilder
          tableData={customerTableData}
          tableHeaders={
            isCreditCustomers
              ? getDueCustomerTableHeaders
              : getCustomerTableHeaders
          }
          handleEdit={handleEdit}
          title={'Customers'}
          payButton={isCreditCustomers}
          payButtonClick={handlePayButttonClick}
        />
      </div>
    </Fragment>
  );
};

const mapStateToProps = ({ global }) => {
  return { ...global };
};

const mapActionToProps = {
  fetchApi,
  setFetchApiInfo,
};

export default connect(mapStateToProps, mapActionToProps)(Customers);

const getFormattedList = data =>
  data.map(({ id, firstName, lastName, phoneNo, dueTotal }) => {
    return { id, firstName, lastName, phoneNo, dueTotal };
  });
