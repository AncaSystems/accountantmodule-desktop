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
  AutoComplete,
} from 'antd';
import AccountantModule from '@andresmorelos/accountantmodule-sdk';
import { Moment } from 'moment';
import getMonthAndYear from '../../../utils/getMonthAndYear';

interface Props {
  API: AccountantModule;
}

interface OptionType {
  value: string;
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
  const [form] = Form.useForm();
  const [disabled = false, setDisabled] = useState();
  const [loading = false, setloading] = useState();
  const [valueInput = 0, setValueInput] = useState<number>();
  const [taxValue = 0, setTaxValue] = useState<number>();
  const [loanTypes = [], setLoanTypes] = useState();
  const [autoCompletOptionsName, setAutoCompleteOptionsName] = useState<
    OptionType[]
  >([]);
  const [
    validAutoCompletOptionsName,
    setValidAutoCompletOptionsName,
  ] = useState<OptionType[]>([]);
  const [
    autoCompletOptionsIdentification,
    setAutoCompleteOptionsIdentification,
  ] = useState<OptionType[]>([]);
  const [
    validAutoCompletOptionsIdentification,
    setValidAutoCompletOptionsIdentification,
  ] = useState<OptionType[]>([]);

  useEffect(() => {
    API.LoanTypes()
      .getLoanTypes()
      .then((reponse) => {
        setLoanTypes(reponse.results);
      })
      .catch((err) => console.error(err));

    API.Clients()
      .getDistinct('name')
      .then((response) => {
        const options = response.map((name: string) => {
          return { value: name };
        });
        setAutoCompleteOptionsName(options);

        return null;
      })
      .catch((error) => console.error(error));

    API.Clients()
      .getDistinct('identification')
      .then((response) => {
        const options = response.map((identification: string) => {
          return { value: identification };
        });
        setAutoCompleteOptionsIdentification(options);

        return null;
      })
      .catch((error) => console.error(error));
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
          message: 'Cliente Creado Exitosamente',
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

  const autoCompletOnSearchName = (value: string) => {
    const validOptions = autoCompletOptionsName.filter(
      (option) => option.value.indexOf(value.toUpperCase()) >= 0
    );
    setValidAutoCompletOptionsName(validOptions);
  };

  const autoCompletOnSearchIdentification = (value: string) => {
    const validOptions = autoCompletOptionsIdentification.filter(
      (option) => option.value.indexOf(value.toUpperCase()) >= 0
    );
    setValidAutoCompletOptionsIdentification(validOptions);
  };

  const onFinish = (values: any) => {
    setDisabled(true);
    setloading(true);
    const { since } = values;
    const { month, year } = getMonthAndYear();
    values = {
      ...values,
      month,
      year,
    };
    createClient(values);
  };

  const parseToCurrency = (valueToParse: number) => {
    return Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(valueToParse);
  };

  const calculatePerformanceAndClientValue = (value?: number) => {
    if (valueInput) {
      const tax = value !== undefined ? value / 100 : taxValue / 100;
      const performance = valueInput * tax;
      return { performance, clientValue: performance + valueInput };
    }

    return { performance: 0, clientValue: 0 };
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
              <AutoComplete
                options={validAutoCompletOptionsIdentification}
                onSearch={autoCompletOnSearchIdentification}
              />
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
              <AutoComplete
                options={validAutoCompletOptionsName}
                onSearch={autoCompletOnSearchName}
              />
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
                  required: true,
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
                { required: true, message: 'Por favor ingrese un telefono!' },
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
              label="Saldo Cliente"
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
          Crear cliente
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegistrationForm;
