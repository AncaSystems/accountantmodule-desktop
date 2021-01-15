/* eslint-disable promise/always-return */
import React from 'react';
import { Card } from 'antd';
import RegistrationForm from './form';

class SingUpContainer extends React.Component {
  _isMounted = false;

  constructor(props: any) {
    super(props);

    this.state = {
      permissions: [],
    };
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.getPermissions();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  createUsers = ({ username, password, name, phone, address, permissions }) => {
    this.props.API.Auth()
      .SingUp({ username, password, name, phone, address, permissions })
      .then((response: any) => {
        console.log(response);
      })
      .catch((error: any) => console.error(error));
  };

  getPermissions = () => {
    this.props.API.Permissions()
      .getPermissions({}, { limit: 20 })
      .then((response: any) => {
        this.setState({
          permissions: response.results,
        });
      })
      .catch((error: any) => console.error(error));
  };

  render() {
    const { permissions } = this.state;
    return (
      <Card style={{ textAlign: 'center' }}>
        <RegistrationForm
          onCreate={this.createUsers}
          permissions={permissions}
        />
      </Card>
    );
  }
}

export default SingUpContainer;
