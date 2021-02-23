/* eslint-disable promise/always-return */
import React from 'react';
import { Table, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import AccountantModule from '@andresmorelos/accountantmodule-sdk';
import SaveReport from '../../../helpers/saveReports';
import getMonthAndYear from '../../../utils/getMonthAndYear';

interface Props {
  API: AccountantModule;
}

interface State {
  clients: any[];
  page: number;
  limit: number;
  total: number;
  loading: boolean;
  loadingButton: boolean;
}
class ClientContainer extends React.Component<Props, State> {
  _isMounted = false;

  constructor(props: Props) {
    super(props);

    this.state = {
      clients: [],
      page: 1,
      limit: 10,
      total: 0,
      loading: true,
      loadingButton: false,
    };

    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.downloadReport = this.downloadReport.bind(this);
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
          clients: response.results
            .map(this.mapClientResults)
            .filter((client) => client?.originalSeed > 0),
          total: response.totalResults,
          loading: false,
        });
      })
      .catch((error) => console.error(error));
  };

  // eslint-disable-next-line class-methods-use-this
  mapClientResults(client: any) {
    const { month, year } = getMonthAndYear();
    client.loans = client.loans.filter(
      (_loan) => _loan.month === month && _loan.year === year.toString()
    );

    const loan = client.loans[client.loans.length - 1];
    if (loan) {
      let payments = 0;
      let seq1 = 0;
      let seq2 = 0;
      let value1 = 0;
      let value2 = 0;

      if (loan.fees.length > 0) {
        payments = loan.fees.reduce((accumulator: number, _fee: any) => {
          if (_fee._enabled) {
            return accumulator + _fee.value;
          }
          return accumulator;
        }, 0);
      }

      let seed = loan.value - payments;

      if (seed < 0) {
        seed = 0.0;
      }
      const performance = seed * (loan.tax / 100);

      let clientValue = loan.value * (loan.tax / 100) + seed;

      if (clientValue <= 0 || (performance <= 0 && loan.tax > 0)) {
        clientValue = 0.0;
      }

      if (Array.isArray(loan.fees) && loan.fees.length === 1) {
        seq1 = loan.fees[0].seq;
        value1 = loan.fees[0].value;
      } else if (loan.fees.length > 1) {
        seq1 = loan.fees[0].seq;
        value1 = loan.fees[0].value;
        seq2 = loan.fees[1].seq;
        value2 = loan.fees[1].value;
      }

      return {
        id: client.id,
        work: client.work,
        name: client.name,
        phone: client.phone,
        loanDate: new Date(loan.since).toLocaleDateString(),
        originalSeed: loan.value,
        seed: Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
        }).format(seed),
        performance: Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
        }).format(performance),
        value: Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
        }).format(clientValue),
        seq1,
        fee1: Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
        }).format(value1),
        seq2,
        fee2: Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
        }).format(value2),
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

  downloadReport(event) {
    this.setState({
      loadingButton: true,
    });
    this.props.API.Reports()
      .getClientsOverview()
      .then((response) => {
        SaveReport(response, 'ListadoDeClientes.pdf');
        this.setState({
          loadingButton: false,
        });
      })
      .catch((err) => console.error(err));
  }

  render() {
    const { clients, loading, total, loadingButton } = this.state;
    const { API } = this.props;
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
        title: 'Fecha Prestamo',
        dataIndex: 'loanDate',
        key: 'loanDate',
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
        title: 'Secuencia',
        dataIndex: 'seq1',
        key: 'seq1',
      },
      {
        title: 'Cobro',
        dataIndex: 'fee1',
        key: 'fee1',
      },
      {
        title: 'Secuencia',
        dataIndex: 'seq2',
        key: 'seq2',
      },
      {
        title: 'Cobro',
        dataIndex: 'fee2',
        key: 'fee2',
      },
    ];

    return (
      <>
        <Button
          icon={<DownloadOutlined />}
          loading={loadingButton}
          onClick={this.downloadReport}
        >
          Descargar
        </Button>
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
