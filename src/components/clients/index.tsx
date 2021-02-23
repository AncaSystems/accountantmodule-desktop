/* eslint-disable promise/always-return */
import React from 'react';
import { Table, Input, Space, Button, notification } from 'antd';
import { Link } from 'react-router-dom';
import AccountantModule from '@andresmorelos/accountantmodule-sdk';
import getMonthAndYear from '../../utils/getMonthAndYear';

const { Search } = Input;

interface Props {
  API: AccountantModule;
}

interface State {
  clients: any[];
  page: number;
  limit: number;
  total: number;
  loading: boolean;
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
          clients: response.results
            .map(this.mapClientResults)
            .filter((client) => client !== undefined),
          total: response.totalResults,
          loading: false,
        });
      })
      .catch((error) => console.error(error));
  };

  // eslint-disable-next-line class-methods-use-this
  mapClientResults(client: any) {
    if (client.loans) {
      const { month, year } = getMonthAndYear();
      client.loans = client.loans.filter(
        (_loan) => _loan.month === month && _loan.year === year.toString()
      );

      const loan = client.loans[client.loans.length - 1];
      if (loan) {
        let payments = 0;

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

        return {
          id: client.id,
          name: client.name,
          work: client.work,
          phone: client.phone,
          active: client._enabled ? 'Sí' : 'No',
          enabled: client._enabled,
          loanDate: new Date(loan.since).toLocaleDateString(),
          paymentType: loan.loanType.name,
          seed: Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
          }).format(seed),
          seedValue: seed,
          performance: Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
          }).format(performance),
          value: Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
          }).format(clientValue),
          codebtName: client.CoDebtName,
          codebtAddress: client.CoDebtAddress,
          codebtPhone: client.CoDebtPhone,
        };
      }
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
      {
        title: 'Acciones',
        key: 'action',
        render: (text, record) => {
          return (
            <Space size="middle">
              <Link to={`/clients/${record.id}/update`}>Modificar</Link>
              <Button
                type="link"
                onClick={() => {
                  if (!record.enabled) {
                    notification.info({
                      message: 'No se pudo eliminar el cliente',
                      description: 'El cliente no se encuentra activo.',
                    });
                    return;
                  }
                  if (record.seedValue === 0) {
                    API.Clients()
                      .deleteClient(record.id)
                      .then((result) => {
                        this.getClients({});
                      })
                      .catch((err) => console.error(err));
                  } else {
                    notification.error({
                      message: 'No se pudo eliminar el cliente',
                      description:
                        'La semilla del cliente deber ser igual a cero ($ 0,00) para poder ser eliminado.',
                    });
                  }
                }}
              >
                Eliminar
              </Button>
            </Space>
          );
        },
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
