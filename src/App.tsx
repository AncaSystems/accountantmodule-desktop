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
import CreateFeeContainer from './components/fees/create';
import FeeReportContainer from './components/reports/fees';
import FeeByDayReportContainer from './components/reports/feesByDay';
import FeeByDateRangeReportContainer from './components/reports/feesByDateRange';
import FeeByClientsRangeReportContainer from './components/reports/feesByClient';
import ClientsByWorkAddressContainer from './components/reports/ClientsByWorkAddress';
import ClientsOverView from './components/reports/ClientsOverview';
import SingUpContainer from './components/auth/singup';
import LoginContainer from './components/auth/login';

const API = new AccountantModule({
  baseURL: 'http://localhost:3000/dev',
});

const { Content, Header } = Layout;

export default function App() {
  const [theme = 'dark', setTheme] = useState<string>();
  const [user, setUser] = useState<any>();

  const changeTheme = (value) => {
    setTheme(value ? 'dark' : 'light');
  };

  if (user) {
    return (
      <Router>
        <Layout>
          <Sidebar theme={theme} setUser={setUser} user={user} />
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
                  path="/create-paymets"
                  component={() => <CreateFeeContainer API={API} user={user} />}
                />
                <Route
                  path="/report-payment"
                  component={() => <FeeReportContainer API={API} />}
                />
                <Route
                  path="/report-payment-by-day"
                  component={() => <FeeByDayReportContainer API={API} />}
                />
                <Route
                  path="/report-payment-by-day-range"
                  component={() => <FeeByDateRangeReportContainer API={API} />}
                />
                <Route
                  path="/report-payment-by-client"
                  component={() => (
                    <FeeByClientsRangeReportContainer API={API} />
                  )}
                />
                <Route
                  path="/report-clients-list"
                  component={() => <ClientsOverView API={API} />}
                />
                <Route
                  path="/report-clients-by-work-address"
                  component={() => <ClientsByWorkAddressContainer API={API} />}
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
