/* eslint-disable promise/always-return */
import AccountantModule from '@andresmorelos/accountantmodule-sdk';
import React from 'react';
import LoginForm from './form';

interface Props {
  API: AccountantModule;
  setUser(user: any): void;
}
class SingUpContainer extends React.Component<Props> {
  componentDidMount() {}

  render() {
    const { API, setUser } = this.props;
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <LoginForm API={API} setUser={setUser} />
      </div>
    );
  }
}

export default SingUpContainer;
