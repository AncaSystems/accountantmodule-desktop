/* eslint-disable promise/always-return */
import React, { useEffect, useState } from 'react';
import { Table, Select, Button, Row, Col } from 'antd';
import AccountantModule from '@andresmorelos/accountantmodule-sdk';
import { DownloadOutlined } from '@ant-design/icons';
import SaveReport from '../../../helpers/saveReports';
import getMonthAndYear from '../../../utils/getMonthAndYear';

const { Option } = Select;

interface Props {
  API: AccountantModule;
}

const ClientsByWorkAddressContainer = ({ API }: Props) => {
  const [workAddress = [], setWorkAddress] = useState<any[]>();
  const [value, setValue] = useState<string>();
  const [clients = [], setClients] = useState<any[]>();
  const [loading = false, setLoading] = useState<boolean>();
  const [loadingButton = false, setLoadingButton] = useState<boolean>();
  const [page = 1, setPage] = useState<number>();
  const [limit = 10, setLimit] = useState<number>();
  const [total = 0, setTotal] = useState<number>();

  useEffect(() => {
    setLoading(true);
    API.Clients()
      .getDistinct('work')
      .then((response) => {
        setWorkAddress(response);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const mapClientResults = (client: any) => {
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
  };

  const getClients = ({
    work = value,
    currentPage = page,
    currentLimit = limit,
  }: {
    work: string | undefined;
    currentPage: number;
    currentLimit: number;
  }) => {
    console.log(currentLimit, currentPage);
    API.Clients()
      .getClients({ work }, { page: currentPage, limit: currentLimit })
      .then((response) => {
        setTotal(response.totalResults);
        setPage(response.page);
        const clients = response.results.map(mapClientResults);
        setClients(clients);
      })
      .catch((err) => console.error(err));
  };

  const onChange = (work: string) => {
    setValue(work);
    setPage(1);
    getClients({ work, currentPage: 1, currentLimit: limit });
  };

  const handlePaginationChange = (newPage: number, pageSize: number) => {
    setPage(newPage);
    setLimit(pageSize);
    getClients({ currentPage: newPage, currentLimit: pageSize });
  };

  const downloadReport = (event) => {
    if (value) {
      setLoadingButton(true);
      API.Reports()
        .getClientsByWork({ work: value })
        .then((response) => {
          SaveReport(response, `ClientesPorLugarDeTrabajo-${value}.pdf`);
          setLoadingButton(false);
        })
        .catch((err) => console.error(err));
    }
  };

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
      <Row>
        <Col span={22}>
          <Select
            showSearch
            style={{ width: '100%' }}
            onChange={onChange}
            placeholder="Selecione una dirección"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {workAddress.map((name) => (
              <Option key={`work-${name}`} value={name}>
                {name}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={1}>
          <Button
            loading={loadingButton}
            icon={<DownloadOutlined />}
            onClick={downloadReport}
          >
            Descargar
          </Button>
        </Col>
      </Row>

      <Table
        size="middle"
        columns={columns}
        dataSource={clients}
        loading={loading}
        scroll={{ y: 450 }}
        pagination={{
          total,
          onChange: handlePaginationChange,
          current: page,
        }}
      />
    </>
  );
};

export default ClientsByWorkAddressContainer;
