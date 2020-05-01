import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CustomTextField from './FormComponents/CustomTextField';
import CustomGender from './FormComponents/CustomGender';
import { Button, Container } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import CreateIcon from '@material-ui/icons/Create';
import DatePicker from './FormComponents/DatePicker';
import CssBaseline from '@material-ui/core/CssBaseline';
import DropDown from './FormComponents/DropDown';
import useStyles from '../../styles/useStyles';

const FormBuilder = ({
  title,
  data,
  onClick,
  actor = {},
  handleDelete,
  handleDatePickerChange
}) => {
  const [newActor, setNewActor] = useState(actor);
  const getValue = ({ target: { value, name } }) => {
    setNewActor({ ...newActor, [name]: value });
    console.log({ ...newActor, [name]: value });
  };

  const classes = useStyles();

  return (
    <Container component='main' maxWidth='md'>
      <CssBaseline />
      <Typography component='h1' variant='h5'>
        <Box lineHeight={2}>
          <CreateIcon className={classes.formbuilderMargin} />
          {title}
        </Box>
      </Typography>
      <div>
        <form className={classes.formbuilderForm}>
          <Grid container spacing={3}>
            {data.map(entry => {
              switch (entry.type) {
                case 'text':
                case 'email':
                case 'tel':
                  return (
                    <CustomTextField
                      entry={entry}
                      key={entry.label}
                      getValue={getValue}
                    />
                  );
                case 'date':
                  return (
                    <DatePicker
                      entry={entry}
                      handleDatePickerChange={handleDatePickerChange}
                    />
                  );
                case 'radio':
                  return (
                    <CustomGender
                      entry={entry}
                      key={entry.label}
                      getValue={getValue}
                    />
                  );
                case 'dropDown':
                  return (
                    <DropDown
                      entry={entry}
                      key={entry.label}
                      getValue={getValue}
                    />
                  );
                default:
                  return null;
              }
            })}
          </Grid>
          <Button
            type='submit'
            variant='contained'
            color='primary'
            onClick={onClick(newActor, actor.id)}
            className={classes.formbuilderSubmit}
          >
            Submit
          </Button>
          {actor.id && (
            <Button
              variant='contained'
              color='secondary'
              onClick={handleDelete}
            >
              Delete
            </Button>
          )}
        </form>
      </div>
    </Container>
  );
};

export default FormBuilder;
