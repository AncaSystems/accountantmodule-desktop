/* eslint-disable promise/no-nesting */
/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/always-return */
import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Row,
  Col,
  Button,
  notification,
  Select,
  Table,
  Space,
} from 'antd';
import { Link } from 'react-router-dom';
import AccountantModule from '@andresmorelos/accountantmodule-sdk';
import IClient from '@andresmorelos/accountantmodule-sdk/dist/interfaces/Entities/Client.interface';
import getMonthAndYear from '../../../utils/getMonthAndYear';

interface Props {
  API: AccountantModule;
  user: any;
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

const RegistrationForm = ({ API, user }: Props) => {
  const [form] = Form.useForm();
  const [disabled = false, setDisabled] = useState<boolean>();
  const [loading = false, setloading] = useState<boolean>();
  const [loadingFees = true, setLoadingFees] = useState<boolean>();
  const [clients = [], setClients] = useState<IClient[]>();
  const [fees = [], setFees] = useState<any[]>();
  const [feesPage = 0, setFeesPages] = useState<number>();
  const [feesLimit = 0, setFeesLimit] = useState<number>();
  const [feesTotal = 0, setFeesTotal] = useState<number>();
  const [fee, setFee] = useState<number>();
  const [loan, setLoan] = useState<string>();
  const [sequence, setSequence] = useState<number>(0);

  const getSearch = () => {
    const today = new Date().setHours(0, 0, 0);
    const startDate = new Date(today - 60 * 60 * 5 * 1000);
    const endDate = new Date(today + 60 * 60 * 19 * 1000);

    return {
      createdAt: {
        $gte: new Date(startDate).toISOString(),
        $lt: new Date(endDate).toISOString(),
      },
    };
  };

  const getFees = ({
    page = feesPage,
    limit = feesLimit,
    search = getSearch(),
  }) => {
    setLoadingFees(true);
    API.Fees()
      .getFees(search, { page, limit })
      // eslint-disable-next-line promise/always-return
      .then((response) => {
        const feesPromises = response.results.map(async (Currentfee) => {
          const client = await API.Clients().getClient(Currentfee.client);

          return {
            id: Currentfee.id,
            seq: Currentfee.seq,
            value: Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP',
            }).format(Currentfee.value),
            user: Currentfee.user.name,
            commission: Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP',
            }).format(Currentfee.commission),
            client: client.name,
            cancelled: Currentfee._enabled ? 'No' : 'Sí',
          };
        });

        Promise.all(feesPromises).then((Responsefees) => {
          setLoadingFees(false);
          setFees(Responsefees);
          setFeesTotal(response.totalResults);
          return null;
        });
      })
      .catch((error) => console.error(error));
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    getFees({ page, limit: pageSize });
    setFeesPages(page);
    setFeesLimit(pageSize);
  };

  useEffect(() => {
    API.Counter()
      .getCounter('FeeCounter')
      .then((response) => {
        setSequence(response.seq + 1);
        form.setFieldsValue({
          sequence: response.seq + 1,
        });
      })
      .catch((err) => console.error(err));

    API.Clients()
      .getClients({}, { limit: 1000 })
      .then((reponse) => {
        setClients(reponse.results);
      })
      .catch((err) => console.error(err));

    getFees({});
  }, []);

  const createFee = ({ type }: { type: string }) => {
    if (loan && fee) {
      API.Loans()
        .createFee(loan, { user: user.id, value: fee, type })
        .then((response) => {
          notification.success({
            message: 'Cobro creado',
            description: `Cobro ${response.seq} creado satifactoriamente`,
          });
          setDisabled(false);
          setloading(false);
          form.resetFields();
          form.setFieldsValue({
            sequence: sequence + 1,
          });
          setSequence(sequence + 1);
          getFees({});
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
    }
  };

  const onFinish = (values: any) => {
    setDisabled(true);
    setloading(true);
    createFee(values);
  };

  const parseToCurrency = (value) => {
    return Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(value);
  };

  const getClient = (id: string) => {
    API.Clients()
      .getClient(id)
      .then((response) => {
        if (response) {
          let seed = 0;
          let performance = 0;
          let clientValue = 0;
          let tax = 0;

          if (response.loans) {
            let payments = 0;

            const { month, year } = getMonthAndYear();
            response.loans = response.loans.filter(
              (_loan) => _loan.month === month && _loan.year === year.toString()
            );

            const lastLoan = response.loans[response.loans.length - 1];

            setLoan(lastLoan.id);

            if (lastLoan.fees.length > 0) {
              payments = lastLoan.fees.reduce(
                (accumulator: number, _fee: any) => {
                  if (_fee._enabled) {
                    return accumulator + _fee.value;
                  }
                  return accumulator;
                },
                0
              );
            }

            seed = lastLoan.value - payments;

            if (seed < 0) {
              seed = 0.0;
            }
            performance = seed * (lastLoan.tax / 100);

            clientValue = lastLoan.value * (lastLoan.tax / 100) + seed;

            if (seed === 0.0) {
              clientValue = lastLoan.value + clientValue - payments;
            }

            tax = lastLoan.loanType.tax;
          }

          form.setFieldsValue({
            seed: parseToCurrency(seed),
            performance: parseToCurrency(performance),
            clientValue: parseToCurrency(clientValue),
            commission: parseToCurrency(performance * (tax / 100)),
            loanType: response.loans[response.loans.length - 1].loanType.name,
          });
        }
      })
      .catch((err) => console.error(err));
  };

  const onSearch = (value: string) => {
    getClient(value);
  };

  const columns = [
    {
      title: 'Secuencia',
      dataIndex: 'seq',
      key: 'seq',
    },
    {
      title: 'Cancelado',
      dataIndex: 'cancelled',
      key: 'cancelled',
    },
    {
      title: 'Cliente',
      dataIndex: 'client',
      key: 'client',
    },
    {
      title: 'Valor',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: 'Cobrador',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Comisión',
      dataIndex: 'commission',
      key: 'commission',
    },
    {
      title: 'Acciones',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Link to={`/payments/${record.id}/update`}>Modificar</Link>
        </Space>
      ),
    },
  ];

  return (
    <>
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
                name="sequence"
                label={<span>Secuencia</span>}
                rules={[
                  {
                    required: false,
                  },
                ]}
                initialValue={sequence}
              >
                <Input disabled />
              </Form.Item>

              <Form.Item
                name="client"
                label={<span>Cliente</span>}
                rules={[
                  {
                    required: true,
                    message: 'Por favor seleccione un cliente!',
                    whitespace: false,
                  },
                ]}
              >
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  onChange={onSearch}
                  placeholder="Selecione un cliente"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {clients.map(({ name, id }) => (
                    <Option key={`client-${id}`} value={id}>
                      {name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="user"
                label={<span>Cobrador</span>}
                rules={[
                  {
                    required: true,
                    message: 'Por favor ingrese con un usuario valido',
                    whitespace: true,
                  },
                ]}
                initialValue={user.name}
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
            Crear cobro
          </Button>
        </Form.Item>
      </Form>

      <Table
        columns={columns}
        dataSource={fees}
        loading={loadingFees}
        scroll={{ y: 500 }}
        pagination={{ total: feesTotal, onChange: handlePaginationChange }}
      />
    </>
  );
};

export default RegistrationForm;
