import React from 'react';
import { Redirect } from 'react-router-dom';
import { LogoutOutlined } from '@ant-design/icons';
import { Button, Col } from 'antd';

class LogOutContainer extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      navigate: false,
    };
  }

  LogOut = (event: any) => {
    this.props.setUser(null);
    this.setState({
      navigate: true,
    });
  };

  render() {
    const { navigate } = this.state;
    if (navigate) {
      return <Redirect to="/" />;
    }
    return (
      <Col offset={11} style={{ marginTop: '10px' }}>
        <Button
          icon={<LogoutOutlined />}
          onClick={this.LogOut}
          size="large"
          type="primary"
        >
          Cerrar Sesión
        </Button>
      </Col>
    );
  }
}

export default LogOutContainer;
