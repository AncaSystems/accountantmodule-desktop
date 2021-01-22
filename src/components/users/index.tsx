/* eslint-disable promise/always-return */
import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Space, Button } from 'antd';
import AccountantModule from '@andresmorelos/accountantmodule-sdk';

interface Props {
  API: AccountantModule;
}

interface State {
  users: any[];
  page: number;
  limit: number;
  total: number;
  loading: boolean;
}
class UserContainer extends React.Component<Props, State> {
  _isMounted = false;

  constructor(props: Props) {
    super(props);

    this.state = {
      users: [],
      page: 1,
      limit: 10,
      total: 0,
      loading: true,
    };

    this.handlePaginationChange = this.handlePaginationChange.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.getUsers({});
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getUsers = ({ page = this.state.page, limit = this.state.limit }) => {
    this.setState({
      loading: true,
    });
    this.props.API.Users()
      .getUsers({ _enabled: true }, { page, limit })
      .then((response) => {
        this.setState({
          users: response.results.filter((user) => user._enabled),
          total: response.totalResults,
          loading: false,
        });
      })
      .catch((error) => console.error(error));
  };

  handlePaginationChange(page: number, pageSize: number) {
    this.setState((state, props) => {
      this.getUsers({ page, limit: pageSize });
      return {
        page,
        limit: pageSize,
      };
    });
  }

  render() {
    const { users, loading, total } = this.state;
    const { API } = this.props;
    const columns = [
      {
        title: 'Nombre',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Dirección',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: 'Telefono',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: 'Nombre Usuario',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: 'Acciones',
        key: 'action',
        render: (text, record) => (
          <Space size="middle">
            <Link to={`/user/${record.id}/update`}>Modificar</Link>
            <Button
              type="link"
              onClick={() => {
                API.Users()
                  .deleteUser(record.id)
                  .then((result) => {
                    this.getUsers({});
                  })
                  .catch((err) => console.error(err));
              }}
            >
              Eliminar
            </Button>
          </Space>
        ),
      },
    ];

    return (
      <Table
        size="middle"
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={{ total, onChange: this.handlePaginationChange }}
      />
    );
  }
}

export default UserContainer;
