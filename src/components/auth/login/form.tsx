import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

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

const LoginForm = (props) => {
  const [form] = Form.useForm();
  const [disabled = false, setDisabled] = useState();
  const [loading = false, setloading] = useState();
  const { action } = props;

  const onFinish = (values: any) => {
    setDisabled(true);
    setloading(true);
    const { username, password } = values;
    action(username, password);
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="normal_login"
      className="login-form"
      title="Iniciar Sesión"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Please input your Username!' }]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Usuario"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input
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
  );
};
export default LoginForm;
