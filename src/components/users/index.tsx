import React from 'react';
import { Table } from 'antd';

class UserContainer extends React.Component {
  _isMounted = false;

  constructor(props: any) {
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
      .getUsers({}, { page, limit })
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
      this.getClients({ page, limit: pageSize });
      return {
        page,
        limit: pageSize,
      };
    });
  }

  render() {
    const { users, loading, total } = this.state;
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
