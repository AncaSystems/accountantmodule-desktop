/* eslint-disable promise/always-return */
import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Row,
  Col,
  Button,
  DatePicker,
  Select,
  notification,
} from 'antd';
import AccountantModule from '@andresmorelos/accountantmodule-sdk';
import { Moment } from 'moment';

interface Props {
  API: AccountantModule;
}

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

const RegistrationForm = ({ API }: Props) => {
  const monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  const [form] = Form.useForm();
  const [disabled = false, setDisabled] = useState();
  const [loading = false, setloading] = useState();
  const [valueInput = '0', setValueInput] = useState();
  const [loanTypes = [], setLoanTypes] = useState();

  useEffect(() => {
    API.LoanTypes()
      .getLoanTypes()
      .then((reponse) => {
        setLoanTypes(reponse.results);
      })
      .catch((err) => console.error(err));
  }, []);

  const createLoan = (
    client: string,
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
    API.Clients()
      .createLoan(client, {
        since,
        tax,
        value,
        loanType,
        month,
        year,
      })
      .then((response: any) => {
        setDisabled(false);
        setloading(false);
        form.resetFields();
        notification.success({
          message: 'Cliente Creado Exitosamente'
        });
      })
      .catch((error: any) => console.error(error));
  };

  const createClient = ({
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
    month,
    year,
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
      .createClient({
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
        createLoan(response.id, {
          since,
          tax,
          value,
          loanType,
          month,
          year,
        });
      })
      .catch((error: any) => {
        setDisabled(false);
        setloading(false);
      });
  };

  const getMonthAndYear = (since: Moment) => {
    let month = monthNames[since.month()];
    const day = since.day();

    if (day > 27) {
      if (month !== 'Diciembre') {
        month = monthNames[since.month() + 1];
      } else {
        // eslint-disable-next-line prefer-destructuring
        month = monthNames[0]; // Enero
      }
    }

    return { month, year: since.year() };
  };

  const onFinish = (values: any) => {
    setDisabled(true);
    setloading(true);
    const { since } = values;
    const { month, year } = getMonthAndYear(since);
    values = {
      ...values,
      month,
      year,
    };
    createClient(values);
  };

  const ParseCurrency = (valueToParse: number) => {
    return Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(valueToParse);
  };

  return (
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
                { required: false, message: 'Por favor ingrese un telefono!' },
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
                { required: true, message: 'Por favor ingrese un Co-Deudor!' },
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
                  required: true,
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
              <Input type="number" suffix="%" />
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
                prefix="$"
                value={valueInput}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setValueInput(
                    ParseCurrency(parseInt(event.target.value, 10))
                  );
                }}
              />
            </Form.Item>

            <Form.Item
              name="rendimiento"
              label="Rendimiento"
              rules={[
                {
                  required: false,
                  message: 'Por favor ingrese el rendimiento!',
                },
              ]}
            >
              <Input type="text" prefix="$" />
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
              <Input type="text" prefix="$" />
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
          Crear cliente
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegistrationForm;
