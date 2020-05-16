import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import useStyles from '../../../styles/useStyles';
import Button from '@material-ui/core/Button';
import Barcode from 'react-barcode';
import { getItemTotal } from '../../../utilities/helpers/saleHelpers';
import { createSale } from '../../../http/saleApi';
import ConfirmationPopup from '../../uis/ConfirmationPopup';
import { setCartItems } from '../../../store/actions/saleActions';

const Sale = ({ cartItems, setCartItems }) => {
  const classes = useStyles();
  const [revdAmount, setRevdAmount] = useState(parseFloat(0).toFixed(2));
  const handleCashAmountChange = e => {
    if (e.target.value >= 0) {
      setRevdAmount(e.target.value);
    }
  };
  const [openConfirm, setOpenConfirmation] = React.useState(false);
  const handleDiscard = () => {
    setCartItems([]);
  };
  const handleDiscardClick = () => {
    if (cartItems.length) {
      handleOpenConfirmation();
    }
  };
  const handleOpenConfirmation = () => {
    setOpenConfirmation(true);
  };

  const handleCloseConfiramtion = () => {
    setOpenConfirmation(false);
  };
  let cartTotal = 0;
  cartItems.forEach(row => {
    cartTotal = cartTotal + parseFloat(getItemTotal(row));
  });
  cartTotal = parseFloat(cartTotal).toFixed(2);
  const balance =
    revdAmount > 0 ? parseFloat(revdAmount - cartTotal).toFixed(2) : revdAmount;
  const handleFocus = e => e.target.select();
  const handleSaleSubmit = e => {
    e.preventDefault();
    const newSale = {
      customerId: 1,
      total: cartTotal,
      totalDiscount: 0,
      paymentType: 'cash',
      balance,
      revdAmount,
      itemSales: cartItems,
      cashBookDetails: {
        refNo: '25',
        description: 'Desc123455',
        type: 'cash',
        amount: cartTotal,
      },
    };
    createSale(newSale);
    alert('sale submit');
  };

  return (
    <Fragment>
      <form onSubmit={handleSaleSubmit}>
        <div className={classes.customerName}>
          <TextField id='sale-customer-name' label='Customer Name' />
        </div>
        <div style={{ position: 'fixed', bottom: 0 }}>
          <div className={classes.total}>
            <TextField
              id='sale-total-inputs'
              label='Total'
              value={cartTotal}
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
          <div className={classes.cash}>
            <TextField
              id='sale-cash-inputs'
              label='Cash'
              value={revdAmount}
              onChange={handleCashAmountChange}
              onFocus={handleFocus}
            />
          </div>
          <div className={classes.balance}>
            <TextField
              id='sale-balance-inputs'
              label='Balance'
              value={balance}
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
          <div>
            <Button
              className={classes.button}
              variant='contained'
              color='primary'
              type={'submit'}
            >
              Submit
            </Button>
          </div>
          <div>
            <Button
              className={classes.button}
              variant='contained'
              color='secondary'
              onClick={handleDiscardClick}
            >
              Discard
            </Button>
            <div className={classes.barcode}>
              <Barcode value='0000000000001' />
            </div>
          </div>
        </div>
      </form>
      {openConfirm && (
        <ConfirmationPopup
          open={openConfirm}
          close={handleCloseConfiramtion}
          handleAgree={handleDiscard}
          id='deletePopup'
          header='Confirm discard bill'
          content='Are you sure want to discard this bill?'
        />
      )}
    </Fragment>
  );
};

const mapStateToProps = ({ global, sale }) => ({ ...global, ...sale });

const mapActionToProps = { setCartItems };

export default connect(mapStateToProps, mapActionToProps)(Sale);
