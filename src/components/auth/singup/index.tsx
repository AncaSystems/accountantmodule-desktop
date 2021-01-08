/* eslint-disable promise/always-return */
import React from 'react';
import { Card } from 'antd';
import RegistrationForm from './form';

class SingUpContainer extends React.Component {
  _isMounted = false;

  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  createUsers = ({ username, password, name, phone, address }) => {
    this.props.API.Auth()
      .SingUp({ username, password, name, phone, address })
      .then((response: any) => {
        console.log(response);
      })
      .catch((error: any) => console.error(error));
  };

  render() {
    return (
      <Card style={{ textAlign: 'center' }}>
        <RegistrationForm onCreate={this.createUsers} />
      </Card>
    );
  }
}

export default SingUpContainer;
