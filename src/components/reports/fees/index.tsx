import React from 'react';
import { Table } from 'antd';

class FeeReportContainer extends React.Component {
  _isMounted = false;

  constructor(props: any) {
    super(props);

    this.state = {
      fees: [],
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
      this.getFees({});
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getFees = ({ page = this.state.page, limit = this.state.limit }) => {
    this.setState({
      loading: true,
    });
    this.props.API.Fees()
      .getFees({}, { page, limit })
      // eslint-disable-next-line promise/always-return
      .then((response) => {
        const feesPromises = response.results.map(async (fee) => {
          const client = await this.props.API.Clients().getClient(fee.client);

          return {
            seq: fee.seq,
            value: Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP',
            }).format(fee.value),
            user: fee.user.name,
            commission: fee.commission,
            client: client.name,
            cancelled: fee._enabled ? 'No' : 'Sí',
          };
        });

        Promise.all(feesPromises).then((fees) => {
          this.setState({
            fees,
            total: response.totalResults,
            loading: false,
          });
        });
      })
      .catch((error) => console.error(error));
  };

  handlePaginationChange(page: number, pageSize: number) {
    this.setState((state, props) => {
      this.getFees({ page, limit: pageSize });
      return {
        page,
        limit: pageSize,
      };
    });
  }

  render() {
    const { fees, loading, total } = this.state;
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
        title: 'Cliente',
        dataIndex: 'client',
        key: 'client',
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
      <Table
        size="middle"
        columns={columns}
        dataSource={fees}
        loading={loading}
        scroll={{ y: 500 }}
        pagination={{ total, onChange: this.handlePaginationChange }}
      />
    );
  }
}

export default FeeReportContainer;
