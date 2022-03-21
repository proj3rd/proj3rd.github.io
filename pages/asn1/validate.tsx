import {
  Button,
  Col,
  Form,
  Input,
  message,
  Row,
  Spin,
  Typography,
  Upload,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { InboxOutlined } from "@ant-design/icons";
import { parse } from "asn3rd/dist/parser.js";
import { useState } from "react";

const { TextArea } = Input;
const { Title } = Typography;
const { Dragger } = Upload;

export default function Extract() {
  const [formFile] = useForm();
  const [formText] = useForm();

  const [working, setWorking] = useState(false);
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

  async function validateText() {
    setWorking(true);
    const text = formText.getFieldValue("text");
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const [error] = parse(text);
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      }, 0);
    })
      .then(() => {
        message.success("ASN.1 definition looks well formed.");
      })
      .catch((reason) => {
        const msg = reason.errors
          .map(
            ({
              line,
              column,
              msg,
            }: {
              line: number;
              column: number;
              msg: string;
            }) => {
              return `line ${line}:${column} ${msg}`;
            }
          )
          .join("\n");
        message.error(msg);
      })
      .finally(() => {
        setWorking(false);
      });
  }

  return (
    <>
      <Spin spinning={working}>
        <Title level={1}>ASN.1 Valiator</Title>

        <Title level={2}>Validate from a file</Title>
        <Form
          form={formFile}
          component={false}
          onValuesChange={onValuesChangeFile}
        >
          <Row>
            <Col span={24}>
              <Form.Item name="file" label="File">
                <Dragger multiple={false} maxCount={1}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to validate ASN.1
                    definition.
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

        <Title level={2}>Validate from a text</Title>
        <Form
          form={formText}
          component={false}
          onValuesChange={onValuesChangeText}
        >
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
                <Button disabled={disabledText} onClick={validateText}>
                  Validate from text
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </>
  );
}
