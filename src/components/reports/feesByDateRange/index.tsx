/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/no-nesting */
/* eslint-disable promise/always-return */
import React from 'react';
import { Table, DatePicker, Row, Col, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import SaveReport from '../../../helpers/saveReports';

const { RangePicker } = DatePicker;

class FeeByDateRangeReportContainer extends React.Component {
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
      gte: new Date(),
      lt: new Date(),
      loadingButton: false,
    };

    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.downloadReport = this.downloadReport.bind(this);
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

  onSearch(value: any) {
    let search;
    if (Array.isArray(value)) {
      search = {
        createdAt: {
          $gte: value[0].format('MM/DD/yyyy'),
          $lt: value[1].format('MM/DD/yyyy'),
        },
      };
      this.setState({
        gte: search.createdAt.$gte,
        lt: search.createdAt.$lt,
      });
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

  downloadReport(event) {
    const { gte, lt } = this.state;
    this.setState({
      loadingButton: true,
    });
    this.props.API.Reports()
      .getFeeReport({
        gte,
        lt,
        description: `Cobros por Rango de Fecha`,
      })
      .then((response) => {
        SaveReport(response, 'cobrosPorRangoDeFecha.pdf');
        this.setState({
          loadingButton: false,
        });
      })
      .catch((err) => console.error(err));
  }

  render() {
    const { fees, loading, total, loadingButton } = this.state;
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
        <Row>
          <Col span={22}>
            <RangePicker onChange={this.onSearch} style={{ width: '100%' }} />
          </Col>
          <Col span={1}>
            <Button
              icon={<DownloadOutlined />}
              loading={loadingButton}
              onClick={this.downloadReport}
            >
              Descargar
            </Button>
          </Col>
        </Row>
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

export default FeeByDateRangeReportContainer;
