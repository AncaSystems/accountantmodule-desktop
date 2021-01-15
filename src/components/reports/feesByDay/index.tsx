/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/no-nesting */
/* eslint-disable promise/always-return */
import React from 'react';
import { Table, Input } from 'antd';

const { Search } = Input;

class FeeByDayReportContainer extends React.Component {
  _isMounted = false;

  constructor(props: any) {
    super(props);

    this.state = {
      fees: [],
      page: 1,
      limit: 10,
      total: 0,
      loading: true,
      search: {},
    };

    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
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

  onSearch(value: string) {
    let search;
    if (![null, undefined, ''].includes(value)) {
      const startDate = new Date(value);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 24 * 1000);
      search = {
        createdAt: {
          $gte: new Date(startDate).toISOString(),
          $lt: new Date(endDate).toISOString(),
        },
      };
    } else {
      search = {};
    }

    this.setState((state, props) => {
      this.getFees({
        page: state.page,
        limit: state.limit,
        search,
      });

      return {
        search,
      };
    });
  }

  getFees = ({
    page = this.state.page,
    limit = this.state.limit,
    search = this.state.search,
  }) => {
    this.setState({
      loading: true,
    });
    this.props.API.Fees()
      .getFees(search, { page, limit })
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
            commission: Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP',
            }).format(fee.commission),
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
      <>
        <Search
          type="date"
          placeholder="Secuencia"
          onSearch={this.onSearch}
          enterButton
          style={{ marginBottom: '5px' }}
        />
        <Table
          size="middle"
          columns={columns}
          dataSource={fees}
          loading={loading}
          scroll={{ y: 500 }}
          pagination={{ total, onChange: this.handlePaginationChange }}
        />
      </>
    );
  }
}

export default FeeByDayReportContainer;
