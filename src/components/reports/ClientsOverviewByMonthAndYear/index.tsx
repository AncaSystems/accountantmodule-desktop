/* eslint-disable promise/always-return */
import React, { useState } from 'react';
import { Button, DatePicker } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import AccountantModule from '@andresmorelos/accountantmodule-sdk';
import SaveReport from '../../../helpers/saveReports';

interface Props {
  API: AccountantModule;
}

const ClientOverviewByMonthAndYearContainer = ({ API }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(false);
  const [year, setYear] = useState<string | undefined | null>(undefined);
  const [month, setMonth] = useState<string | undefined | null>(undefined);

  const monthNames = [
    'enero',
    'febrero',
    'marzo',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];

  const downloadReport = (event: any) => {
    if (
      ![null, undefined, ''].includes(month) &&
      ![null, undefined, ''].includes(year)
    ) {
      setLoading(true);
      API.Reports()
        .getClientsOverviewByMonthAndYear(month, year)
        .then((response) => {
          SaveReport(response, 'ListadoDeClientes.pdf');
          setLoading(false);
          return undefined;
        })
        .catch((err) => console.error(err));
    }
  };

  const onChange = (momentDate: moment.Moment | null, date: string) => {
    setEnabled(false);
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const [year, month] = date.split('-');
    setYear(year);
    setMonth(monthNames[parseInt(month, 10) - 1]);
    setEnabled(true);
  };

  return (
    <>
      <DatePicker picker="month" size="large" onChange={onChange} />
      <Button
        disabled={!enabled}
        icon={<DownloadOutlined />}
        loading={loading}
        onClick={downloadReport}
      >
        Descargar
      </Button>
    </>
  );
};

export default ClientOverviewByMonthAndYearContainer;
