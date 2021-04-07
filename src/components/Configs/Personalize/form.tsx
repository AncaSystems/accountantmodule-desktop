import React, { useState } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import AccountantModule from '@andresmorelos/accountantmodule-sdk';

const { Password } = Input;

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

interface Props {
  API: AccountantModule;
  setIsAuthenticated(): any;
}

const AuthSecondPassForm = ({ API, setIsAuthenticated }: Props) => {
  const [form] = Form.useForm();
  const [disabled = false, setDisabled] = useState();
  const [loading = false, setloading] = useState();
  const [hide = true, setHide] = useState();

  const Authenticate = ({ password }) => {
    setDisabled(true);
    setloading(true);
    setHide(true);

    API.Auth()
      .AuthSecondPass('personalize', password)
      .then((response: any) => {
        setIsAuthenticated(true);
        setDisabled(false);
        setloading(false);
        return undefined;
      })
      .catch((error: any) => {
        setDisabled(false);
        setloading(false);
        setHide(false);
        return error;
      });
  };

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        name="normal_login"
        className="login-form"
        title="Iniciar Sesión"
        initialValues={{ remember: true }}
        onFinish={Authenticate}
      >
        <Form.Item className={hide ? 'hide' : ''}>
          <Alert message="Contraseña invalida" type="error" showIcon />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Por favor ingrese su contraseña' },
          ]}
        >
          <Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Contraseña"
          />
        </Form.Item>
        <Form.Item>
          <Button
            loading={loading}
            disabled={disabled}
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Autenticarme
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default AuthSecondPassForm;
