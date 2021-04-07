import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Row, Col, notification } from 'antd';
import AccountantModule from '@andresmorelos/accountantmodule-sdk';
import { useHistory } from 'react-router-dom';

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
  name: string;
  tax: string;
  loanTypeId: string;
}

const UpdateLoanTypeForm = ({ API, loanTypeId, name, tax: OldTax }: Props) => {
  const [form] = Form.useForm();
  const [disabled = false, setDisabled] = useState<boolean>();
  const [loading = false, setloading] = useState<boolean>();
  const [hide = true, setHide] = useState();
  const history = useHistory();

  useEffect(() => {
    form.setFieldsValue({
      tax: OldTax,
    });
  }, []);

  const UpdateLoan = ({ tax }: { tax: number | undefined }) => {
    setDisabled(true);
    setloading(true);
    setHide(true);

    API.LoanTypes()
      .updateLoanType(loanTypeId, { tax })
      .then((response: any) => {
        setDisabled(false);
        setloading(false);
        notification.success({
          message: 'Porcentaje Actualizado Exitosamente',
        });
        history.push('/tools-customize');
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
    <Card style={{ textAlign: 'center' }}>
      <Form
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...formItemLayout}
        form={form}
        name="LoanTypeUpdate"
        className="loanTypeForm"
        title={name}
        initialValues={{ remember: true }}
        onFinish={UpdateLoan}
      >
        <Row gutter={[16, 24]}>
          <Col offset={5} span={12}>
            <fieldset>
              <legend> {name}</legend>
              <Form.Item
                name="tax"
                label="Porcentaje"
                rules={[
                  {
                    required: true,
                    message: 'Por favor ingrese el porcentaje!',
                  },
                ]}
              >
                <Input type="number" suffix="%" min={1} step={0.5} />
              </Form.Item>
              <Form.Item>
                <Button
                  loading={loading}
                  disabled={disabled}
                  type="primary"
                  htmlType="submit"
                  className="update-form-button"
                >
                  Actualizar
                </Button>
              </Form.Item>
            </fieldset>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};
export default UpdateLoanTypeForm;
