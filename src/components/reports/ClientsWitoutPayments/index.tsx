/* eslint-disable promise/always-return */
import React, { useEffect, useState } from 'react';
import { Button, Card } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import AccountantModule from '@andresmorelos/accountantmodule-sdk';
import SaveReport from '../../../helpers/saveReports';

interface Props {
  API: AccountantModule;
}

const parseCurrency = (value: number) => {
  return Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
  }).format(value);
};

const ClientsWitoutPayments = ({ API }: Props) => {
  const [loadingButton, setLoadingButton] = useState<boolean>(false);

  const downloadReport = (event: any) => {
    setLoadingButton(true);
    API.Reports()
      .getClientsWithOutPayments()
      .then((response) => {
        SaveReport(response, 'ClientesSinPagos.pdf');
        setLoadingButton(false);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '25px' }}>
      <Button
        icon={<DownloadOutlined />}
        loading={loadingButton}
        onClick={downloadReport}
      >
        Descargar
      </Button>
    </div>
  );
};

export default ClientsWitoutPayments;
