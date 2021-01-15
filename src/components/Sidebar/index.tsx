import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import {
  UserOutlined,
  UsergroupAddOutlined,
  FilePdfOutlined,
  FileDoneOutlined,
  ReadOutlined,
  ToolOutlined,
  QuestionOutlined,
  LockOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;
const { SubMenu } = Menu;

class Sidebar extends React.Component {
  componentDidMount() {}

  render() {
    const { theme } = this.props;

    return (
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
      >
        <Menu
          mode="inline"
          theme={theme}
          defaultSelectedKeys={['1']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <SubMenu icon={<UserOutlined />} title="Usuarios">
            <Menu.Item key="1">
              <Link to="/users" style={{ fontSize: '0.9em' }}>
                Usuarios
              </Link>
            </Menu.Item>
            <Menu.Item key="15">
              <Link to="/create-users" style={{ fontSize: '0.9em' }}>
                Crear Usuarios
              </Link>
            </Menu.Item>
          </SubMenu>

          <SubMenu icon={<UsergroupAddOutlined />} title="Clientes">
            <Menu.Item key="2">
              <Link to="/clients" style={{ fontSize: '0.9em' }}>
                Clientes
              </Link>
            </Menu.Item>
            <Menu.Item key="16">
              <Link to="/clients-register" style={{ fontSize: '0.9em' }}>
                Registro de clientes
              </Link>
            </Menu.Item>
          </SubMenu>

          <SubMenu icon={<FileDoneOutlined />} title="Cobros">
            <Menu.Item key="3">
              <Link to="/paymets" style={{ fontSize: '0.9em' }}>
                Registro Cobros
              </Link>
            </Menu.Item>
            <Menu.Item key="4">
              <Link to="/paymets" style={{ fontSize: '0.9em' }}>
                Modificar Cobro
              </Link>
            </Menu.Item>
          </SubMenu>

          <SubMenu icon={<ReadOutlined />} title="Consultas">
            <Menu.Item key="5">
              <Link to="/report-payment" style={{ fontSize: '0.9em' }}>
                Recibos de Cobros
              </Link>
            </Menu.Item>
            <Menu.Item key="6">
              <Link to="/report-payment-by-day" style={{ fontSize: '0.9em' }}>
                Cobro por fecha
              </Link>
            </Menu.Item>
            <Menu.Item key="7">
              <Link
                to="/report-payment-by-day-range"
                style={{ fontSize: '0.9em' }}
              >
                Cobro por rango de fecha
              </Link>
            </Menu.Item>
            <Menu.Item key="8">
              <Link to="/report-status-by-month" style={{ fontSize: '0.9em' }}>
                Estado cuota por mes
              </Link>
            </Menu.Item>
            <Menu.Item key="9">
              <Link
                to="/report-clients-by-work-address"
                style={{ fontSize: '0.9em' }}
              >
                Clientes por lugar de trabajo
              </Link>
            </Menu.Item>
          </SubMenu>

          <SubMenu icon={<FilePdfOutlined />} title="Reportes">
            <Menu.Item key="10">
              <Link
                to="/report-payment-by-client"
                style={{ fontSize: '0.9em' }}
              >
                Recibos de clientes
              </Link>
            </Menu.Item>
            <Menu.Item key="11">
              <Link to="/report-clients-list" style={{ fontSize: '0.9em' }}>
                Listado de clientes
              </Link>
            </Menu.Item>
            <Menu.Item key="12">
              <Link to="/report-balance" style={{ fontSize: '0.9em' }}>
                Saldos Totales
              </Link>
            </Menu.Item>
          </SubMenu>

          <SubMenu icon={<ToolOutlined />} title="Herramientas">
            <Menu.Item key="13">
              <Link to="/tools-customize" style={{ fontSize: '0.9em' }}>
                Personalizar
              </Link>
            </Menu.Item>
          </SubMenu>

          <Menu.Item key="17" icon={<LogoutOutlined />}>
            <Link to="/logout" style={{ fontSize: '0.9em' }}>
              Cerrar Sesión
            </Link>
          </Menu.Item>

          <SubMenu icon={<QuestionOutlined />} title="Ayuda">
            <Menu.Item key="14">
              <Link to="/about" style={{ fontSize: '0.9em' }}>
                Acerca de
              </Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
    );
  }
}

export default Sidebar;
