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
import UpdateClientContainer from './components/clients/update';
import UserContainer from './components/users';
import CreateFeeContainer from './components/fees/create';
import UpdateFeeContainer from './components/fees/update';
import FeeReportContainer from './components/reports/fees';
import FeeByDayReportContainer from './components/reports/feesByDay';
import FeeByDateRangeReportContainer from './components/reports/feesByDateRange';
import FeeByClientsRangeReportContainer from './components/reports/feesByClient';
import ClientsByWorkAddressContainer from './components/reports/ClientsByWorkAddress';
import ClientsOverView from './components/reports/ClientsOverview';
import SingUpContainer from './components/auth/singup';
import LoginContainer from './components/auth/login';
import UpdateUserContainer from './components/users/update';
import TotalBalanceContainer from './components/reports/totalBalance';
import UnderConstructionContainer from './components/UnderConstruction';
import BackupConfigNotifierContainer from './components/Configs/Backup';
import PersonalizeContainer from './components/Configs/Personalize';
import PersonalizeUpateContainer from './components/Configs/Personalize/update';

const API = new AccountantModule({
  baseURL: 'https://fl3ps34j2e.execute-api.us-east-1.amazonaws.com/prod/',
});

const { Content, Header } = Layout;

export default function App() {
  const [theme = 'dark', setTheme] = useState<string>();
  const [user, setUser] = useState<any>();

  const changeTheme = (value: number) => {
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
                <Col offset={1}>
                  <b>Backup En Progreso:</b>{' '}
                  <BackupConfigNotifierContainer API={API} />
                </Col>
                <Col span={6} offset={10}>
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
                <Route exact path="/" component={AboutContainer} />
                <Route exact path="/about" component={AboutContainer} />
                <Route
                  exact
                  path="/report-status-by-month"
                  component={UnderConstructionContainer}
                />
                <Route
                  exact
                  path="/report-balance"
                  component={() => <TotalBalanceContainer API={API} />}
                />
                <Route
                  exact
                  path="/tools-customize"
                  component={() => <PersonalizeContainer API={API} />}
                />
                <Route
                  exact
                  path="/tools-customize/:loanTypeId/:name/:tax/update"
                  component={({ match }) => (
                    <PersonalizeUpateContainer API={API} match={match} />
                  )}
                />

                <Route
                  exact
                  path="/users/:user/update"
                  render={({ match }) => (
                    <UpdateUserContainer API={API} match={match} />
                  )}
                />
                <Route
                  exact
                  path="/clients/:client/update"
                  render={({ match }) => (
                    <UpdateClientContainer API={API} match={match} />
                  )}
                />
                <Route
                  exact
                  path="/clients"
                  component={() => <ClientContainer API={API} />}
                />
                <Route
                  exact
                  path="/clients-register"
                  component={() => <CreateClientContainer API={API} />}
                />
                <Route
                  exact
                  path="/users"
                  component={() => <UserContainer API={API} />}
                />
                <Route
                  exact
                  path="/create-users"
                  component={() => <SingUpContainer API={API} />}
                />
                <Route
                  exact
                  path="/payments/:fee/update"
                  render={({ match }) => (
                    <UpdateFeeContainer API={API} match={match} />
                  )}
                />
                <Route
                  exact
                  path="/payments"
                  component={() => <CreateFeeContainer API={API} user={user} />}
                />
                <Route
                  exact
                  path="/report-payment"
                  component={() => <FeeReportContainer API={API} />}
                />
                <Route
                  exact
                  path="/report-payment-by-day"
                  component={() => <FeeByDayReportContainer API={API} />}
                />
                <Route
                  exact
                  path="/report-payment-by-day-range"
                  component={() => <FeeByDateRangeReportContainer API={API} />}
                />
                <Route
                  exact
                  path="/report-payment-by-client"
                  component={() => (
                    <FeeByClientsRangeReportContainer API={API} />
                  )}
                />
                <Route
                  exact
                  path="/report-clients-list"
                  component={() => <ClientsOverView API={API} />}
                />
                <Route
                  exact
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
  return (
    <Router>
      <LoginContainer API={API} setUser={setUser} />
    </Router>
  );
}
