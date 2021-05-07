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

const TotalBalance = ({ API }: Props) => {
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [totalBalance, setTotalBalance] = useState<any>({
    totalSeed: 0,
    totalPerformance: 0,
    totalClientValue: 0,
    totalPayments: 0,
  });

  useEffect(() => {
    API.Reports()
      .getTotalBalanceNumbers()
      .then((response) => {
        setTotalBalance(response);
      })
      .catch((err) => console.error(err));
  }, []);

  const downloadReport = (event: any) => {
    setLoadingButton(true);
    API.Reports()
      .getTotalBalance()
      .then((response) => {
        SaveReport(response, 'SaldosTotales.pdf');
        setLoadingButton(false);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Button
        icon={<DownloadOutlined />}
        loading={loadingButton}
        onClick={downloadReport}
      >
        Descargar
      </Button>
      <Card title="Saldos Totales">
        <p>
          <b>Semilla:</b> {parseCurrency(totalBalance.totalSeed)}
        </p>
        <p>
          <b>Rendimiento:</b> {parseCurrency(totalBalance.totalPerformance)}
        </p>
        <p>
          <b>Saldo Cliente:</b> {parseCurrency(totalBalance.totalClientValue)}
        </p>
        <p>
          <b>Pagos Recibidos:</b> {parseCurrency(totalBalance.totalPayments)}
        </p>
      </Card>
    </>
  );
};

export default TotalBalance;
