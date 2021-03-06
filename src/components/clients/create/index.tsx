/* eslint-disable promise/always-return */
import React from 'react';
import { Card } from 'antd';
import AccountantModule from '@andresmorelos/accountantmodule-sdk';
import RegistrationForm from './form';

interface Props {
  API: AccountantModule;
}
class CreateClientContainer extends React.Component<Props> {
  componentDidMount() {}

  render() {
    const { API } = this.props;
    return (
      <Card style={{ textAlign: 'center' }}>
        <RegistrationForm API={API} />
      </Card>
    );
  }
}

export default CreateClientContainer;
