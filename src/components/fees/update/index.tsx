/* eslint-disable promise/no-nesting */
/* eslint-disable promise/always-return */
import React, { useEffect, useState } from 'react';
import {
  Card,
  notification,
  Input,
  Row,
  Col,
  Button,
  Form,
  Select,
  Switch,
} from 'antd';
import { useHistory } from 'react-router-dom';
import AccountantModule from '@andresmorelos/accountantmodule-sdk';
import IFee from '@andresmorelos/accountantmodule-sdk/dist/interfaces/Entities/Fee.inteface';
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

const UpdateFeeContainer = ({ API, match }: Props) => {
  const history = useHistory();
  const [fee, setFee] = useState<IFee>();
  const [client, setClient] = useState<IClient>();
  const [form] = Form.useForm();
  const [disabled = false, setDisabled] = useState<boolean>();
  const [loading = false, setloading] = useState<boolean>();

  const parseToCurrency = (valueToParse: number) => {
    return Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(valueToParse);
  };

  useEffect(() => {
    if (match.params.fee !== 'undefined') {
      API.Fees()
        .getFee(match.params.fee)
        .then((feeResult) => {
          setFee(feeResult);
          API.Clients()
            .getClient(feeResult.client)
            .then((clientResult) => {
              const { month, year } = getMonthAndYear();

              clientResult.loans = clientResult.loans.filter(
                (_loan) =>
                  _loan.month === month && _loan.year === year.toString()
              );

              const loan = clientResult.loans[clientResult.loans.length - 1];

              let payments = 0;

              if (loan.fees.length > 0) {
                payments = loan.fees.reduce(
                  (accumulator: number, _fee: any) => {
                    // eslint-disable-next-line no-underscore-dangle
                    if (_fee._enabled) {
                      return accumulator + _fee.value;
                    }
                    return accumulator;
                  },
                  0
                );
              }

              const seed = loan.value - payments;

              const performance = seed * (loan.tax / 100);

              let clientValue = loan.value * (loan.tax / 100) + seed;

              if (seed === 0.0) {
                clientValue = loan.value + clientValue - payments;
              }

              setClient(clientResult);
              form.setFieldsValue({
                _enabled: feeResult._enabled,
                user: feeResult.user.name,
                type: feeResult.type,
                value: parseToCurrency(feeResult.value),
                commission: parseToCurrency(feeResult.commission),
                client: clientResult.name,
                loanType:
                  clientResult.loans[clientResult.loans.length - 1].loanType
                    .name,
                seed: parseToCurrency(seed),
                performance: parseToCurrency(performance),
                clientValue: parseToCurrency(clientValue),
              });
            })
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
    }
  }, []);

  const updateFee = ({
    type,
    fee,
    _enabled,
  }: {
    type: string;
    fee: number;
    _enabled: boolean;
  }) => {
    API.Fees()
      .updateFee(match.params.fee, { value: fee, type, _enabled })
      .then((response) => {
        notification.success({
          message: 'Cobro Actualizado',
          description: `Cobro ${response.seq} actualizado satifactoriamente`,
        });
        setDisabled(false);
        setloading(false);
        form.resetFields();
        history.push('/report-payment');
      })
      .catch((err) => {
        notification.error({
          message: 'Hubo un error al crear el cobro',
          description:
            'Por favor verifique que todos los datos esten correctos, o que el valor semilla sea diferente a cero (0)',
        });
        setDisabled(false);
        setloading(false);
      });
  };

  const onFinish = (values: any) => {
    setDisabled(true);
    setloading(true);
    updateFee(values);
  };

  if (match.params.fee === 'undefined') {
    return (
      <Card style={{ textAlign: 'center' }}>
        <h1> No hay pago seleccionado para modificar</h1>
      </Card>
    );
  }

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
          <Col span={10} offset={1}>
            <fieldset>
              <legend>Datos Cobro</legend>
              <Form.Item
                name="client"
                label={<span>Cliente</span>}
                rules={[
                  {
                    required: false,
                    message: 'Por favor seleccione un cliente!',
                    whitespace: false,
                  },
                ]}
              >
                <Input disabled type="text" />
              </Form.Item>

              <Form.Item
                name="user"
                label={<span>Cobrador</span>}
                rules={[
                  {
                    required: false,
                    message: 'Por favor ingrese con un usuario valido',
                    whitespace: true,
                  },
                ]}
              >
                <Input disabled />
              </Form.Item>

              <Form.Item
                name="type"
                label="Tipo de Pago"
                rules={[
                  {
                    type: 'string',
                    required: true,
                    message: 'Por favor ingrese una tipo de pago!',
                  },
                ]}
              >
                <Select>
                  <Option key={1} value="cash">
                    Efectivo
                  </Option>
                  <Option key={2} value="consigned">
                    Consignado
                  </Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="value"
                label="Abono"
                rules={[
                  { required: true, message: 'Por favor ingrese un abono!' },
                ]}
                initialValue="0,00"
              >
                <Input
                  type="text"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setFee(parseInt(event.target.value, 10));
                  }}
                  onBlur={() => {
                    form.setFieldsValue({
                      value: parseToCurrency(fee),
                    });
                  }}
                />
              </Form.Item>

              <Form.Item
                name="commission"
                label="Comisión"
                rules={[
                  { required: true, message: 'Por favor ingrese un abono!' },
                ]}
                initialValue="0,00"
              >
                <Input type="text" disabled />
              </Form.Item>

              <Form.Item
                name="_enabled"
                label="Cancelar"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch />
              </Form.Item>
            </fieldset>
          </Col>

          <Col span={10}>
            <fieldset>
              <legend>Datos Cliente</legend>
              <Form.Item
                name="loanType"
                label="Tipo de Pago"
                rules={[{ required: false }]}
              >
                <Input disabled />
              </Form.Item>

              <Form.Item
                name="seed"
                label="Capital Semilla"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Input type="text" disabled />
              </Form.Item>

              <Form.Item
                name="performance"
                label="Rendimiento"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Input type="text" disabled />
              </Form.Item>

              <Form.Item
                name="clientValue"
                label="Saldo Cliente"
                rules={[
                  {
                    required: false,
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
            Actualizar cobro
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default UpdateFeeContainer;
