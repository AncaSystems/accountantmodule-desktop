/* eslint-disable promise/always-return */
import React from 'react';
import { Card } from 'antd';
import AccountantModule from '@andresmorelos/accountantmodule-sdk';
import RegistrationForm from './form';

interface Props {
  API: AccountantModule;
  user: any;
}
class CreateFeeContainer extends React.Component<Props> {
  componentDidMount() {}

  render() {
    const { API, user } = this.props;
    return (
      <Card style={{ textAlign: 'center' }}>
        <RegistrationForm API={API} user={user} />
      </Card>
    );
  }
}

export default CreateFeeContainer;
