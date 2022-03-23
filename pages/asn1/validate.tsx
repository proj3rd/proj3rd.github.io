import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Spin,
  Typography,
  Upload,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { CheckOutlined, InboxOutlined } from "@ant-design/icons";
import { parse } from "asn3rd/dist/parser.js";
import { useState } from "react";
import Head from "next/head";

const { TextArea } = Input;
const { Title } = Typography;
const { Dragger } = Upload;

export default function Extract() {
  const [formFile] = useForm();
  const [formText] = useForm();

  const [lastAttempt, setLastAttempt] = useState("");
  const [working, setWorking] = useState(false);
  const [disabledFile, setDisabledFile] = useState(true);
  const [disabledText, setDisabledText] = useState(true);
  const [visibleModal, setVisibleModal] = useState(false);
  const [numErrors, setNumErrors] = useState(0);
  const [errors, setErrors] = useState("");

  function onCancelModal() {
    setVisibleModal(false);
  }

  function onClickButtonShowErrors() {
    setVisibleModal(true);
  }

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
        setNumErrors(0);
      })
      .catch((reason) => {
        const errors = reason.errors
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
        setNumErrors(reason.errors.length);
        setErrors(errors);
        setVisibleModal(true);
      })
      .finally(() => {
        setWorking(false);
      });
  }

  async function validateFile() {
    setWorking(true);
    setLastAttempt("file");
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
    reader.addEventListener("load", (ev) => {
      const { result } = reader;
      if (typeof result !== "string") {
        message.error("Oops. It is unexpected.", 0);
        setWorking(false);
        return;
      }
      validate(result);
    });
    reader.readAsText(fileObj);
  }

  async function validateText() {
    setWorking(true);
    setLastAttempt("text");
    const text = formText.getFieldValue("text");
    validate(text);
  }

  function ResultButton({
    type,
    numErrors,
  }: {
    type: string;
    numErrors: number;
  }) {
    return lastAttempt === type ? (
      numErrors ? (
        <Button danger onClick={onClickButtonShowErrors}>
          Show {numErrors === 1 ? "an error" : "errors"}
        </Button>
      ) : (
        <Button type="primary" icon={<CheckOutlined />} />
      )
    ) : null;
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
                <Button
                  disabled={disabledFile || visibleModal}
                  onClick={validateFile}
                >
                  Validate from file
                </Button>{" "}
                <ResultButton type="file" numErrors={numErrors} />
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
                <Button
                  disabled={disabledText || visibleModal}
                  onClick={validateText}
                >
                  Validate from text
                </Button>{" "}
                <ResultButton type="text" numErrors={numErrors} />
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Modal
          title={`ASN.1 definition seems have ${
            numErrors === 1 ? "an error" : "errors"
          }`}
          visible={visibleModal}
          onCancel={onCancelModal}
          width="100%"
          footer={null}
        >
          <TextArea
            value={errors}
            autoSize={{ minRows: 8, maxRows: 24 }}
            readOnly
          />
        </Modal>
      </Spin>
    </>
  );
}
