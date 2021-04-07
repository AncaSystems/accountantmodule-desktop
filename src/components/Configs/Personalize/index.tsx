/* eslint-disable promise/always-return */
import AccountantModule from '@andresmorelos/accountantmodule-sdk';
import React, { useState } from 'react';
import SecondPassForm from './form';
import ListLoanTypesContainer from './list';

interface Props {
  API: AccountantModule;
}

const PersonalizeContainer = ({ API }: Props) => {
  const [IsAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  if (!IsAuthenticated) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '70vh',
        }}
      >
        <SecondPassForm API={API} setIsAuthenticated={setIsAuthenticated} />;
      </div>
    );
  }

  return <ListLoanTypesContainer API={API} />;
};

export default PersonalizeContainer;
