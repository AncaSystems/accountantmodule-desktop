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
  setUser(user: any): any;
}

const LoginForm = ({ API, setUser }: Props) => {
  const history = useHistory();
  const [form] = Form.useForm();
  const [disabled = false, setDisabled] = useState();
  const [loading = false, setloading] = useState();
  const [hide = true, setHide] = useState();

  const Login = ({ username, password }) => {
    setDisabled(true);
    setloading(true);
    setHide(true);
    API.Auth()
      .Login(username, password)
      .then((response: any) => {
        setUser(response);
        setDisabled(false);
        setloading(false);
        history.push('/');
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
        onFinish={Login}
      >
        <Form.Item className={hide ? 'hide' : ''}>
          <Alert
            message="Usuario o contraseña invalida"
            type="error"
            showIcon
          />
        </Form.Item>
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: 'Por favor ingrese su nombre de usuario!',
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Usuario"
          />
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
            Iniciar Sesión
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default LoginForm;
