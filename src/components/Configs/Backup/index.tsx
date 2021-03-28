import React, { useState, useEffect } from 'react';
import AccountantModule from '@andresmorelos/accountantmodule-sdk';

interface Props {
  API: AccountantModule;
}
const BackupConfigNotifier = ({ API }: Props) => {
  const [backupInProgress, setBackupInProgress] = useState<any>({ flag: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      API.Config()
        .getConfig('backup')
        .then((result) => {
          setBackupInProgress(result);
          return null;
        })
        .catch((error) => console.error(error));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return <>{backupInProgress.flag ? 'Sí' : 'No'}</>;
};

export default BackupConfigNotifier;
