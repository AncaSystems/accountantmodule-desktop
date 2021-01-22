/* eslint-disable promise/always-return */
import React, { useState } from 'react';
import { Form, Input, Tooltip, Button, Select } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import AccountantModule from '@andresmorelos/accountantmodule-sdk';

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
      span: 7,
      offset: 4,
    },
  },
};

interface Props {
  API: AccountantModule;
  permissions: any[];
}

const RegistrationForm = ({ API, permissions }: Props) => {
  const [form] = Form.useForm();
  const [disabled = false, setDisabled] = useState();
  const [loading = false, setloading] = useState();

  const createUsers = ({ username, password, name, phone, address, permissions }) => {
    API.Auth()
      .SingUp({ username, password, name, phone, address, permissions })
      .then((response: any) => {
        setDisabled(false);
        setloading(false);
        form.resetFields();
      })
      .catch((error: any) => console.error(error));
  };

  const onFinish = (values: any) => {
    setDisabled(true);
    setloading(true);
    createUsers(values);
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
        name="username"
        label={
          <span>
            Nombre de usuario&nbsp;
            <Tooltip title="Usuario que será utilizado para iniciar sesión">
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
        }
        rules={[
          {
            required: true,
            message: 'Por favor ingrese un nombre de usuario!',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Contraseña"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese una contraseña!',
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirmar Contraseña"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Por favor confirme su contraseña!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject('Las dos contraseñas deben coincidir!');
            },
          }),
        ]}
      >
        <Input.Password />
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
        rules={[{ required: false, message: 'Por favor ingrese un telefono!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="permissions"
        label="Permisos"
        rules={[
          {
            required: true,
            message: 'Por favor seleccione los permisos del usuario!',
          },
        ]}
      >
        <Select
          mode="multiple"
          placeholder="Por favor seleccione los permisos del usuario"
        >
          {permissions.map(({ id, name, description }) => (
            <Option key={`permission-${id}`} value={id}>
              {description}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button
          loading={loading}
          disabled={disabled}
          type="primary"
          htmlType="submit"
        >
          Crear
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegistrationForm;
