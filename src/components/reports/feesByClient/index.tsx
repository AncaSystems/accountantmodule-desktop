import React, { useEffect, useState } from 'react';
import { Table, Select } from 'antd';
import AccountantModule from '@andresmorelos/accountantmodule-sdk';

const { Option } = Select;

interface Props {
  API: AccountantModule;
}

const FeesByClientsContainer = ({ API }: Props) => {
  const [fees, setFees] = useState<any>([]);
  const [clients, setClients] = useState<any>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(100);
  const [total, setTotal] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentClient, setCurrentClient] = useState<string | undefined>(
    undefined
  );

  // eslint-disable-next-line class-methods-use-this
  const mapClientResults = (client: any) => {
    return {
      name: client.name,
      id: client.id,
    };
  };

  const searchClients = ({ limit = 1000, search = {} }) => {
    setLoading(true);
    API.Clients()
      .getClients(search, { limit })
      .then((response) => {
        setClients(response.results.map(mapClientResults));
        setLoading(false);
        return null;
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    searchClients({});
  }, []);

  const searchFees = ({
    limitSize,
    pageSize,
    search,
  }: {
    limitSize: number;
    pageSize: number;
    search: any;
  }) => {
    API.Fees()
      .getFees(search, { page: pageSize, limit: limitSize })
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

        setFees(fees);
        setTotal(response.totalResults);
        setLoading(false);
        setPage(page);
      })
      .catch((error) => console.error(error));
  };

  const onSearch = (value: string) => {
    searchFees({ pageSize: 1, limitSize: limit, search: { client: value } });
    setCurrentClient(value);
  };

  const handlePaginationChange = (pageChange: number, pageSize: number) => {
    searchFees({
      pageSize: pageChange,
      limitSize: pageSize,
      search: {
        client: currentClient,
      },
    });
    setPage(pageChange);
    setLimit(pageSize);
  };

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
        onChange={onSearch}
        placeholder="Selecione un cliente"
        optionFilterProp="children"
        filterOption={(input, option) =>
          option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
          onChange: handlePaginationChange,
          current: page,
        }}
      />
    </>
  );
};

export default FeesByClientsContainer;
