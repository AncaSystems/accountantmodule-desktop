/* eslint-disable promise/always-return */
import AccountantModule from '@andresmorelos/accountantmodule-sdk';
import React, { useState } from 'react';
import UpdateLoanTypeForm from './form';

interface Props {
  API: AccountantModule;
  match: any;
}

const PersonalizeUpdateContainer = ({ API, match }: Props) => {
  return (
    <UpdateLoanTypeForm
      API={API}
      loanTypeId={match.params.loanTypeId}
      name={match.params.name}
      tax={match.params.tax}
    />
  );
};

export default PersonalizeUpdateContainer;
