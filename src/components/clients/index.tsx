import React from 'react';
import { Table, Input } from 'antd';

const { Search } = Input;

class ClientContainer extends React.Component {
  _isMounted = false;

  constructor(props: any) {
    super(props);

    this.state = {
      clients: [],
      page: 1,
      limit: 10,
      total: 0,
      loading: true,
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
    this.getClients({
      page,
      limit,
      search: { name: value.toUpperCase() },
    });
  }

  getClients = ({
    page = this.state.page,
    limit = this.state.limit,
    search = {},
  }) => {
    this.setState({
      loading: true,
    });
    this.props.API.Clients()
      .getClients(search, { page, limit })
      .then((response) => {
        this.setState({
          clients: response.results.map(this.mapClientResults),
          total: response.totalResults,
          loading: false,
        });
      })
      .catch((error) => console.error(error));
  };

  // eslint-disable-next-line class-methods-use-this
  mapClientResults(client: any) {
    const loan = client.loans[client.loans.length - 1];
    if (loan) {
      let payments = 0;

      if (loan.fees.length > 0) {
        payments = loan.fees.reduce((accumulator: number, _fee: any) => {
          return accumulator + _fee.value;
        }, 0);
      }

      const seed = loan.value - payments;

      return {
        name: client.name,
        work: client.work,
        phone: client.phone,
        active: client._enabled ? 'Sí' : 'No',
        loanDate: new Date(loan.since).toLocaleDateString(),
        paymentType: loan.loanType.name,
        seed: Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
        }).format(seed),
        performance: Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
        }).format(seed * (loan.tax / 100)),
        value: Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
        }).format(seed + seed * (loan.tax / 100)),
        codebtName: client.CoDebtName,
        codebtAddress: client.CoDebtAddress,
        codebtPhone: client.CoDebtPhone,
      };
    }
  }

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
    const { clients, loading, total } = this.state;
    const columns = [
      {
        title: 'Nombre',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Lugar de trabajo',
        dataIndex: 'work',
        key: 'work',
      },
      {
        title: 'Telefono',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: 'Activo',
        dataIndex: 'active',
        key: 'active',
      },
      {
        title: 'Fecha Prestamo',
        dataIndex: 'loanDate',
        key: 'loanDate',
      },
      {
        title: 'Tipo de pago',
        dataIndex: 'paymentType',
        key: 'paymentType',
      },
      {
        title: 'Semilla',
        dataIndex: 'seed',
        key: 'seed',
      },
      {
        title: 'Rendimiento',
        dataIndex: 'performance',
        key: 'performance',
      },
      {
        title: 'Valor Cliente',
        dataIndex: 'value',
        key: 'value',
      },
      {
        title: 'Codeudor',
        dataIndex: 'codebtName',
        key: 'codebtName',
      },
      {
        title: 'Dirección Codeudor',
        dataIndex: 'codebtAddress',
        key: 'codebtAddress',
      },
      {
        title: 'Telefono Codeudor',
        dataIndex: 'codebtPhone',
        key: 'codebtPhone',
      },
    ];

    return (
      <>
        <Search
          placeholder="Nombre Cliente"
          onSearch={this.onSearch}
          enterButton
          style={{ marginBottom: '5px' }}
        />
        <Table
          size="middle"
          columns={columns}
          dataSource={clients}
          loading={loading}
          scroll={{ y: 450 }}
          pagination={{ total, onChange: this.handlePaginationChange }}
        />
      </>
    );
  }
}

export default ClientContainer;
