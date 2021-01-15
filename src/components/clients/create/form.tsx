import React, { useState } from 'react';
import { Form, Input, Row, Col, Button } from 'antd';

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

const RegistrationForm = (props) => {
  const [form] = Form.useForm();
  const [disabled = false, setDisabled] = useState();
  const [loading = false, setloading] = useState();
  const { onCreate } = props;

  const onFinish = (values: any) => {
    setDisabled(true);
    setloading(true);
    onCreate(values);
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
      <Row gutter={[16,24]}>
        <Col span={10} offset={1}>
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
        </Col>

        <Col span={10}>
          <Form.Item
            name="CoDebtName"
            label="Nombre Codeudor"
            rules={[
              { required: true, message: 'Por favor ingrese un Co-Deudor!' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="CoDebtAddress"
            label="Dirección Codeudor"
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
            label="Telefono Codeudor"
            rules={[
              {
                required: true,
                message: 'Por favor ingrese el telefono de Codeudor!',
              },
            ]}
          >
            <Input />
          </Form.Item>
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
