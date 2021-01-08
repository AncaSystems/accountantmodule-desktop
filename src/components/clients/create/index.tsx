/* eslint-disable promise/always-return */
import React from 'react';
import { Card } from 'antd';
import RegistrationForm from './form';

class CreateClientContainer extends React.Component {
  createClient = ({
    identification,
    name,
    work,
    address,
    phone,
    CoDebtName,
    CoDebtAddress,
    CoDebtPhone,
    _enabled,
    since,
    tax,
    value,
    loanType,
    month,
    year,
  }) => {
    this.props.API.Clients()
      .createClient({
        identification,
        name,
        work,
        address,
        phone,
        CoDebtName,
        CoDebtAddress,
        CoDebtPhone,
        _enabled,
      })
      .then((response: any) => {
         this.createLoan(response._id, {since, tax, value, loanType, month, year})
      })
      .catch((error: any) => console.error(error));
  };

  createLoan = (client, { since, tax, value, loanType, month, year }) => {
    this.props.API.Clients()
      .createLoan(client, {
        since,
        tax,
        value,
        loanType,
        month,
        year,
      })
      .then((response: any) => {
        console.log(response);
      })
      .catch((error: any) => console.error(error));
  };

  render() {
    return (
      <Card style={{ textAlign: 'center' }}>
        <RegistrationForm onCreate={this.createClient} />
      </Card>
    );
  }
}

export default CreateClientContainer;
