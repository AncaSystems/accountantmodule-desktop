/* eslint-disable promise/always-return */
import React, { useEffect, useState } from 'react';
import {
  Card,
  Form,
  Input,
  Row,
  Col,
  Button,
  DatePicker,
  Select,
  notification,
} from 'antd';
import { useHistory } from 'react-router-dom';
import AccountantModule from '@andresmorelos/accountantmodule-sdk';
import ILoanType from '@andresmorelos/accountantmodule-sdk/dist/interfaces/Entities/LoanType.interface';
import IClient from '@andresmorelos/accountantmodule-sdk/dist/interfaces/Entities/Client.interface';
import getMonthAndYear from '../../../utils/getMonthAndYear';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 15,
      offset: 4,
    },
  },
};

interface Props {
  API: AccountantModule;
  match: any;
}

const UpdateContainer = ({ API, match }: Props) => {
  const history = useHistory();
  const [client, setClient] = useState<IClient>();
  const [form] = Form.useForm();
  const [disabled = false, setDisabled] = useState();
  const [loading = false, setloading] = useState();
  const [valueInput = 0, setValueInput] = useState<number>();
  const [taxValue = 0, setTaxValue] = useState<number>();
  const [loanTypes = [], setLoanTypes] = useState<ILoanType[]>();

  const updateLoan = (
    loanId: string,
    {
      since,
      tax,
      value,
      loanType,
      month,
      year,
    }: {
      since: string;
      tax: string | number;
      value: number | string;
      loanType: string;
      month: string;
      year: string;
    }
  ) => {
    API.Loans()
      .updateLoan(loanId, {
        since,
        tax,
        value: valueInput,
        loanType,
        month,
        year,
      })
      .then((response: any) => {
        setDisabled(false);
        setloading(false);
        form.resetFields();
        notification.success({
          message: 'Cliente Actualizado Exitosamente',
        });
        history.push('/clients');
      })
      .catch((error: any) => console.error(error));
  };

  const updateClient = ({
    identification,
    name,
    work,
    address,
    phone,
    CoDebtName,
    CoDebtAddress,
    CoDebtPhone,
    _enabled = true,
    since,
    tax,
    value,
    loanType,
  }: {
    identification: string;
    name: string;
    work: string;
    address: string | undefined;
    phone: string | undefined;
    CoDebtName: string;
    CoDebtAddress: string;
    CoDebtPhone: string;
    _enabled: boolean;
    since: string;
    tax: string | number;
    value: string | number;
    loanType: string;
    month: string;
    year: string;
  }) => {
    API.Clients()
      .updateClientClient(match.params.client, {
        identification,
        name,
        work,
        address,
        phone,
        CoDebtName,
        CoDebtAddress,
        CoDebtPhone,
        _enabled,
      })
      .then((response: any) => {
        const { month, year } = getMonthAndYear();
        response.loans = response.loans.filter(
          (_loan) => _loan.month === month && _loan.year === year.toString()
        );
        updateLoan(response.loans[response.loans.length - 1].id, {
          since,
          tax,
          value,
          loanType,
          month,
          year: year.toString(),
        });
      })
      .catch((error: any) => {
        setDisabled(false);
        setloading(false);
      });
  };

  const onFinish = (values: any) => {
    setDisabled(true);
    setloading(true);
    updateClient(values);
  };

  const parseToCurrency = (valueToParse: number) => {
    return Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(valueToParse);
  };

  const calculatePerformanceAndClientValue = (
    seed?: number,
    value?: number
  ) => {
    if (valueInput || seed) {
      const tax = value !== undefined ? value / 100 : taxValue / 100;
      const performance = seed !== undefined ? seed * tax : valueInput * tax;
      return {
        performance,
        clientValue:
          seed !== undefined ? performance + seed : performance + valueInput,
      };
    }

    return { performance: 0, clientValue: 0 };
  };

  useEffect(() => {
    API.Clients()
      .getClient(match.params.client)
      .then((responseClient) => {
        const { month, year } = getMonthAndYear();
        responseClient.loans = responseClient.loans.filter(
          (_loan) => _loan.month === month && _loan.year === year.toString()
        );
        setClient(responseClient);
        setValueInput(
          responseClient.loans[responseClient.loans.length - 1].value
        );
        setTaxValue(responseClient.loans[responseClient.loans.length - 1].tax);
        const { performance, clientValue } = calculatePerformanceAndClientValue(
          responseClient.loans[responseClient.loans.length - 1].value,
          responseClient.loans[responseClient.loans.length - 1].tax
        );
        form.setFieldsValue({
          identification: responseClient.identification,
          name: responseClient.name,
          work: responseClient.work,
          address: responseClient.address,
          phone: responseClient.phone,
          CoDebtName: responseClient.CoDebtName,
          CoDebtAddress: responseClient.CoDebtAddress,
          CoDebtPhone: responseClient.CoDebtPhone,
          tax: responseClient.loans[responseClient.loans.length - 1].tax,
          value: parseToCurrency(
            responseClient.loans[responseClient.loans.length - 1].value
          ),
          loanType:
            responseClient.loans[responseClient.loans.length - 1].loanType.id,
          performance: parseToCurrency(performance),
          client_value: parseToCurrency(clientValue),
        });
      })
      .catch((err) => console.error(err));

    API.LoanTypes()
      .getLoanTypes()
      .then((reponse) => {
        setLoanTypes(reponse.results);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <Card style={{ textAlign: 'center' }}>
      <Form
        form={form}
        {...formItemLayout}
        name="Creacion de usuario"
        title="Creacion de usuario"
        onFinish={onFinish}
        scrollToFirstError
      >
        <Row gutter={[16, 24]}>
          <Col span={8}>
            <fieldset>
              <legend>Datos Cliente</legend>
              <Form.Item
                name="identification"
                label={<span>identificación</span>}
                rules={[
                  {
                    required: true,
                    message:
                      'Por favor ingrese una identificación para el cliente!',
                    whitespace: false,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="name"
                label={<span>Nombre</span>}
                rules={[
                  {
                    required: true,
                    message: 'Por favor ingrese un nombre para el usuario!',
                    whitespace: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="work"
                label={<span>Lugar de trabajo</span>}
                rules={[
                  {
                    required: true,
                    message: 'Por favor ingrese un lugar de trabajo',
                    whitespace: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="address"
                label="Dirección"
                rules={[
                  {
                    type: 'string',
                    required: false,
                    message: 'Por favor ingrese una dirección!',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Telefono"
                rules={[
                  {
                    required: false,
                    message: 'Por favor ingrese un telefono!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </fieldset>
          </Col>

          <Col span={8}>
            <fieldset>
              <legend>Datos Codeudor</legend>
              <Form.Item
                name="CoDebtName"
                label="Nombre"
                rules={[
                  {
                    required: true,
                    message: 'Por favor ingrese un Co-Deudor!',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="CoDebtAddress"
                label="Dirección"
                rules={[
                  {
                    required: true,
                    message: 'Por favor ingrese la dirección del codeudor!',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="CoDebtPhone"
                label="Telefono"
                rules={[
                  {
                    required: true,
                    message: 'Por favor ingrese el telefono de Codeudor!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </fieldset>
          </Col>

          <Col span={8}>
            <fieldset>
              <legend>Datos Credito</legend>
              <Form.Item
                name="since"
                label="Fecha de crédito"
                rules={[
                  {
                    required: false,
                    message: 'Por favor ingrese la fecha del credito!',
                  },
                ]}
              >
                <DatePicker />
              </Form.Item>

              <Form.Item
                name="loanType"
                label="Tipo de Pago"
                rules={[
                  {
                    required: true,
                    message: 'Por favor ingrese lel tipo de pago!',
                  },
                ]}
              >
                <Select placeholder="Por favor seleccione los permisos del usuario">
                  {loanTypes.map(({ id, name }) => (
                    <Option key={`permission-${id}`} value={id}>
                      {name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="tax"
                label="Rendimiento"
                rules={[
                  {
                    required: true,
                    message: 'Por favor ingrese el rendimiento!',
                  },
                ]}
              >
                <Input
                  type="number"
                  suffix="%"
                  min={0}
                  max={10}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setTaxValue(parseInt(event.target.value, 10));
                    const {
                      performance,
                      clientValue,
                    } = calculatePerformanceAndClientValue(
                      undefined,
                      parseInt(event.target.value, 10)
                    );
                    form.setFieldsValue({
                      performance: parseToCurrency(performance),
                      client_value: parseToCurrency(clientValue),
                    });
                  }}
                />
              </Form.Item>

              <Form.Item
                name="value"
                label="Capital Semilla"
                rules={[
                  {
                    required: true,
                    message: 'Por favor ingrese el capital Semilla!',
                  },
                ]}
              >
                <Input
                  type="text"
                  value={valueInput}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setValueInput(parseInt(event.target.value, 10));
                  }}
                  onBlur={() => {
                    const {
                      performance,
                      clientValue,
                    } = calculatePerformanceAndClientValue();
                    form.setFieldsValue({
                      value: parseToCurrency(valueInput),
                      performance: parseToCurrency(performance),
                      client_value: parseToCurrency(clientValue),
                    });
                  }}
                />
              </Form.Item>

              <Form.Item
                name="performance"
                label="Rendimiento"
                rules={[
                  {
                    required: false,
                    message: 'Por favor ingrese el rendimiento!',
                  },
                ]}
              >
                <Input type="text" disabled />
              </Form.Item>

              <Form.Item
                name="client_value"
                label="Valor Cliente"
                rules={[
                  {
                    required: false,
                    message: 'Por favor ingrese el rendimiento!',
                  },
                ]}
              >
                <Input type="text" disabled />
              </Form.Item>
            </fieldset>
          </Col>
        </Row>
        <Form.Item {...tailFormItemLayout}>
          <Button
            loading={loading}
            disabled={disabled}
            type="primary"
            htmlType="submit"
          >
            Actualizar cliente
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default UpdateContainer;
