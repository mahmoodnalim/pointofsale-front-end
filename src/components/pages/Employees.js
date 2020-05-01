import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import TableBuilder from '../uis/TableBuilder.js';
import { useHistory } from 'react-router-dom';
import { getEmployeeTableHeaders } from '../../utilities/helpers/tableHelpers.js';
import { getEmployeeList } from '../../http/employeeApi';
import { fetchApi } from '../../store/actions/globalAction.js';

const Employees = ({ fetchApi }) => {
  const { location, push } = useHistory();
  const [employeeList, setEmployeeList] = useState([]);

  useEffect(() => {
    const handleGetEmployeeResp = res => {
      fetchApi(false);
      if (Array.isArray(res.data)) {
        const displayEmployeeList = res.data.map(
          ({ id, firstName, lastName, phoneNo, gender, bankAccount }) => {
            return { id, firstName, lastName, phoneNo, gender, bankAccount };
          }
        );
        setEmployeeList(displayEmployeeList);
      }
    };
    const handleGetEmployeeErr = err => {
      fetchApi(false);
    };
    fetchApi(true);
    getEmployeeList()
      .then(handleGetEmployeeResp)
      .catch(handleGetEmployeeErr);
  }, [fetchApi]);

  const handleEdit = employee => {
    const editClick = () => {
      push(`${location.pathname}/edit/${employee.id}`);
    };
    return editClick;
  };

  return (
    <TableBuilder
      tableData={employeeList}
      tableHeaders={getEmployeeTableHeaders}
      handleEdit={handleEdit}
      title={'Employees'}
    />
  );
};

const mapStateToProps = ({ global }) => {
  return { ...global };
};

const mapActionToProps = {
  fetchApi
};

export default connect(mapStateToProps, mapActionToProps)(Employees);
