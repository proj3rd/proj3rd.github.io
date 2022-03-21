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
import Head from "next/head";

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
    setDisabledFile(!file.fileList.length);
  }

  function onValuesChangeText(changedValues: any) {
    const { text } = changedValues;
    setDisabledText(!text);
  }

  async function validate(text: string) {
    message.destroy();
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
        message.success("ASN.1 definition looks well formed.", 0);
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

  async function validateFile() {
    setWorking(true);
    const fileField = formFile.getFieldValue("file");
    if (!fileField.fileList.length) {
      setWorking(false);
      return;
    }
    const file = fileField.fileList[0];
    const fileObj = file.originFileObj as File;
    if (!fileObj) {
      setWorking(false);
      return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', (ev) => {
      const { result } = reader;
      if (typeof result !== 'string') {
        message.error('Oops. It is unexpected.', 0);
        setWorking(false);
        return;
      }
      validate(result);
    });
    reader.readAsText(fileObj);
  }

  async function validateText() {
    setWorking(true);
    const text = formText.getFieldValue("text");
    validate(text);
  }

  return (
    <>
      <Head>
        <title>ASN.1 Validator</title>
      </Head>

      <Title level={1}>ASN.1 Validator</Title>

      <Spin spinning={working}>
        <Title level={2}>Validate from a file</Title>
        <Form
          form={formFile}
          component={false}
          onValuesChange={onValuesChangeFile}
        >
          <Row>
            <Col span={24}>
              <Form.Item name="file">
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
                <Button disabled={disabledFile} onClick={validateFile}>
                  Validate from file
                </Button>
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
              <Form.Item name="text">
                <TextArea
                  autoSize={{ minRows: 8, maxRows: 24 }}
                  style={{ fontFamily: "monospace, monospace" }}
                  placeholder="Enter ASN.1 definition to validate"
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
