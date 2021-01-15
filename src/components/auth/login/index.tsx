/* eslint-disable promise/always-return */
import React from 'react';
import LoginForm from './form';

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

  Login = (username, password) => {
    this.props.API.Auth()
      .Login(username, password)
      .then((response: any) => {
        this.props.setUser(response);
      })
      .catch((error: any) => {
        return error;
      });
  };

  render() {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <LoginForm action={this.Login} />
      </div>
    );
  }
}

export default SingUpContainer;
