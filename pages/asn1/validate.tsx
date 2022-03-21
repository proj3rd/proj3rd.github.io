import { Button, Col, Form, Input, Row, Typography, Upload } from "antd";
import { useForm } from "antd/lib/form/Form";
import { InboxOutlined } from "@ant-design/icons";
import { useState } from "react";

const { TextArea } = Input;
const { Dragger } = Upload;

export default function Extract() {
  const [formFile] = useForm();
  const [formText] = useForm();

  const [disabledFile, setDisabledFile] = useState(true);
  const [disabledText, setDisabledText] = useState(true);

  function onValuesChangeFile(changedValues: any) {
    const { file } = changedValues;
    if (!file) {
      return;
    }
    setDisabledFile(file.fileList.length === 0);
  }

  function onValuesChangeText(changedValues: any) {
    const { text } = changedValues;
    setDisabledText(!text);
  }

  return (
    <>
      <Typography.Title level={1}>ASN.1 Valiator</Typography.Title>
      <Form form={formFile} component={false} onValuesChange={onValuesChangeFile}>
        <Row>
          <Col span={24}>
            <Form.Item name="file" label="File">
              <Dragger multiple={false} maxCount={1}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to validate ASN.1 definition.
                </p>
              </Dragger>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item>
              <Button disabled={disabledFile}>Validate from file</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Form form={formText} component={false} onValuesChange={onValuesChangeText}>
        <Row>
          <Col span={24}>
            <Form.Item name="text" label="Text">
              <TextArea
                autoSize={{ minRows: 8, maxRows: 24 }}
                style={{ fontFamily: "monospace, monospace" }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item>
              <Button disabled={disabledText}>Validate from text</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
}
