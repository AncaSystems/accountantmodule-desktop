import React from 'react';
import { Table, Select } from 'antd';

const { Option } = Select;

class FeesByClientsContainer extends React.Component {
  _isMounted = false;

  constructor(props: any) {
    super(props);

    this.state = {
      fees: [],
      clients: [],
      page: 1,
      limit: 10,
      total: 0,
      loading: true,
      currentClient: undefined,
    };

    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.getClients({});
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onSearch(value: string) {
    const { page, limit } = this.state;
    this.getFees({ page: 1, limit, search: { client: value } });
    this.setState({
      currentClient: value,
    });
  }

  getClients = ({ limit = 1000, search = {} }) => {
    this.setState({
      loading: true,
    });
    this.props.API.Clients()
      .getClients(search, { limit })
      .then((response) => {
        this.setState({
          clients: response.results.map(this.mapClientResults),
        });
      })
      .catch((error) => console.error(error));
  };

  getFees = ({ limit, page, search }) => {
    this.props.API.Fees()
      .getFees(search, { page, limit })
      // eslint-disable-next-line promise/always-return
      .then((response) => {
        const fees = response.results.map((fee) => {
          return {
            seq: fee.seq,
            value: Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP',
            }).format(fee.value),
            user: fee.user.name,
            commission: Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP',
            }).format(fee.commission),
            cancelled: fee._enabled ? 'No' : 'Sí',
          };
        });

        this.setState({
          fees,
          total: response.totalResults,
          loading: false,
          page,
        });
      })
      .catch((error) => console.error(error));
  };

  // eslint-disable-next-line class-methods-use-this
  mapClientResults(client: any) {
    return {
      name: client.name,
      id: client.id,
    };
  }

  handlePaginationChange(page: number, pageSize: number) {
    this.setState((state, props) => {
      this.getFees({
        page,
        limit: pageSize,
        search: {
          client: state.currentClient,
        },
      });
      return {
        page,
        limit: pageSize,
      };
    });
  }

  render() {
    const { clients, fees, loading, total, page } = this.state;
    const columns = [
      {
        title: 'Secuencia',
        dataIndex: 'seq',
        key: 'seq',
      },
      {
        title: 'Cancelado',
        dataIndex: 'cancelled',
        key: 'cancelled',
      },
      {
        title: 'Valor',
        dataIndex: 'value',
        key: 'value',
      },
      {
        title: 'Cobrador',
        dataIndex: 'user',
        key: 'user',
      },
      {
        title: 'Comisión',
        dataIndex: 'commission',
        key: 'commission',
      },
    ];

    return (
      <>
        <Select
          showSearch
          style={{ width: '100%' }}
          onChange={this.onSearch}
          placeholder="Selecione un cliente"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {clients.map(({ name, id }) => (
            <Option key={`client-${id}`} value={id}>
              {name}
            </Option>
          ))}
        </Select>
        <Table
          size="middle"
          columns={columns}
          dataSource={fees}
          loading={loading}
          scroll={{ y: 450 }}
          pagination={{
            total,
            onChange: this.handlePaginationChange,
            current: page,
          }}
        />
      </>
    );
  }
}

export default FeesByClientsContainer;
