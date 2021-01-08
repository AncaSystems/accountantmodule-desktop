import React, { useState } from 'react';
// Small helpers you might want to keep
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Layout, Row, Col } from 'antd';
// eslint-disable-next-line import/extensions
import './helpers/external_links.ts';
import AccountantModule from '@andresmorelos/accountantmodule-sdk';

import SwitchTheme from './components/SwitchTheme';
import Sidebar from './components/Sidebar';
import AboutContainer from './components/about';
import ClientContainer from './components/clients';
import CreateClientContainer from './components/clients/create';
import UserContainer from './components/users';
import FeeReportContainer from './components/reports/fees';
import SingUpContainer from './components/auth/singup';
import LoginContainer from './components/auth/login';
import LogOutContainer from './components/auth/logout';

const API = new AccountantModule({
  baseURL: 'http://localhost:3000/dev',
});

const { Content, Header } = Layout;

export default function App() {
  const [theme = 'dark', setTheme] = useState();
  const [user, setUser] = useState();


  const changeTheme = (value) => {
    setTheme(value ? 'dark' : 'light');
  };

  if (user) {
    return (
      <Router>
        <Layout>
          <Sidebar theme={theme} />
          <Layout
            className="site-layout"
            style={{ marginLeft: 200, height: '700px' }}
          >
            <Header
              className="site-layout-background"
              style={{ padding: 0, textAlign: 'right' }}
            >
              <Row>
                <Col offset={1}>
                  <h3>DMD Remanufacturados</h3>
                </Col>
                <Col span={6} offset={11}>
                  <SwitchTheme onChange={changeTheme} />
                </Col>
              </Row>
            </Header>
            <Content
              className="site-layout-background"
              style={{
                margin: '24px 16px 0',
                overflow: 'initial',
                height: '100%',
              }}
            >
              <Switch>
                <Route path="/about" component={AboutContainer} />
                <Route
                  path="/clients"
                  component={() => <ClientContainer API={API} />}
                />
                <Route
                  path="/clients-register"
                  component={() => <CreateClientContainer API={API} />}
                />
                <Route
                  path="/users"
                  component={() => <UserContainer API={API} />}
                />
                <Route
                  path="/create-users"
                  component={() => <SingUpContainer API={API} />}
                />
                <Route
                  path="/report-payment"
                  component={() => <FeeReportContainer API={API} />}
                />
                <Route
                  path="/logout"
                  component={() => <LogOutContainer setUser={setUser} />}
                />
              </Switch>
            </Content>
          </Layout>
        </Layout>
      </Router>
    );
  }
  return <LoginContainer API={API} setUser={setUser} />;
}
