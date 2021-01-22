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
    const { API } = this.props;
    return (
      <Card style={{ textAlign: 'center' }}>
        <RegistrationForm API={API} permissions={permissions} />
      </Card>
    );
  }
}

export default SingUpContainer;
