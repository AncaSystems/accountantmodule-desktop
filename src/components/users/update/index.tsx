/* eslint-disable promise/always-return */
import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Tooltip, Button, Select, notification } from 'antd';
import { useHistory } from 'react-router-dom';
import AccountantModule from '@andresmorelos/accountantmodule-sdk';
import { QuestionCircleOutlined } from '@ant-design/icons';
import IPermission from '@andresmorelos/accountantmodule-sdk/dist/interfaces/Entities/Permission.interface';
import IUser from '@andresmorelos/accountantmodule-sdk/dist/interfaces/Entities/User.interface';

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
  match: any;
}

const UpdateUserContainer = ({ API, match }: Props) => {
  const history = useHistory();
  const [permissions, setPermissions] = useState<IPermission[]>();
  const [user, setUser] = useState<IUser>();
  const [form] = Form.useForm();
  const [disabled = false, setDisabled] = useState();
  const [loading = false, setloading] = useState();

  useEffect(() => {
    API.Permissions()
      .getPermissions({}, { limit: 20 })
      .then((response) => {
        setPermissions(response.results);
      })
      .catch((error: any) => console.error(error));

    API.Users()
      .getUser(match.params.user)
      .then((userResult) => {
        setUser(userResult);
        form.setFieldsValue({
          name: userResult.name,
          username: userResult.username,
          address: userResult.address,
          phone: userResult.phone,
          permissions: userResult.permissions.map(
            (_permissions) => _permissions.id
          ),
        });
      })
      .catch((err) => console.error(err));
  }, []);

  const updateUsers = ({
    username,
    password,
    name,
    phone,
    address,
    permissions,
  }) => {
    API.Users()
      .updateUser(match.params.user, {
        username,
        password,
        name,
        phone,
        address,
        permissions,
      })
      .then((response) => {
        setDisabled(false);
        setloading(false);
        form.resetFields();
        notification.success({
          message: 'Usuario Actualizado Exitosamente',
        });
        history.push('/users');
      })
      .catch((error: any) => console.error(error));
  };

  const onFinish = (values: any) => {
    setDisabled(true);
    setloading(true);
    updateUsers(values);
  };

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
              required: false,
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
              required: false,
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
          rules={[
            { required: false, message: 'Por favor ingrese un telefono!' },
          ]}
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
            {permissions &&
              permissions.map(({ id, name, description }) => (
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
            Actualizar Usuario
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default UpdateUserContainer;
