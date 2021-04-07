/* eslint-disable react/display-name */
/* eslint-disable promise/always-return */
import AccountantModule from '@andresmorelos/accountantmodule-sdk';
import React, { useEffect, useState } from 'react';
import { Table, Space } from 'antd';
import { Link } from 'react-router-dom';

interface Props {
  API: AccountantModule;
}

const ListLoanTypesContainer = ({ API }: Props) => {
  const [loanTypes, setLoanTypes] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    API.LoanTypes()
      .getLoanTypes()
      .then(({ results }) => {
        console.log(results);
        setLoanTypes(results);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Porcentage',
      dataIndex: 'tax',
      key: 'tax',
    },
    {
      title: 'Acciones',
      key: 'action',
      render: (text, record) => {
        return (
          <Space size="middle">
            <Link
              to={`/tools-customize/${record.id}/${record.name}/${record.tax}/update`}
            >
              Modificar
            </Link>
          </Space>
        );
      },
    },
  ];

  return (
    <Table
      size="middle"
      columns={columns}
      dataSource={loanTypes}
      loading={loading}
      scroll={{ y: 450 }}
    />
  );
};

export default ListLoanTypesContainer;
