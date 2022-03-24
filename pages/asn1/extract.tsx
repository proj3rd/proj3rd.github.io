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
import { extract as extractAsn1 } from "asn3rd/dist/extractor";
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
  const [extracted, setExtracted] = useState("");
  const [errored, setErrored] = useState(false);

  function onCancelModal() {
    setVisibleModal(false);
  }

  function onClickButtonShowExtracted() {
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

  async function extract(text: string) {
    message.destroy();
    return new Promise<string>((resolve, reject) => {
      setTimeout(() => {
        const [error, extracted] = extractAsn1(text);
        if (error) {
          reject(error);
        } else {
          resolve(extracted);
        }
      }, 0);
    })
      .then((extracted) => {
        setExtracted(extracted);
        setErrored(false);
      })
      .catch((reason) => {
        setExtracted(reason.message);
        setErrored(true);
      })
      .finally(() => {
        setVisibleModal(true);
        setWorking(false);
      });
  }

  async function extractFromFile() {
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
      extract(result);
    });
    reader.readAsText(fileObj);
  }

  async function extractFromText() {
    setWorking(true);
    setLastAttempt("text");
    const text = formText.getFieldValue("text");
    extract(text);
  }

  function ResultButton({
    type,
    errored,
  }: {
    type: string;
    extracted: string;
    errored: boolean;
  }) {
    return lastAttempt === type ? (
      errored ? (
        <Button danger onClick={onClickButtonShowExtracted}>
          Show errors
        </Button>
      ) : (
        <Button type="primary" icon={<CheckOutlined />} onClick={onClickButtonShowExtracted}>
          Show the extracted ASN.1
        </Button>
      )
    ) : null;
  }

  return (
    <>
      <Head>
        <title>ASN.1 Extractor</title>
      </Head>

      <Title level={1}>ASN.1 Extractor</Title>

      <Spin spinning={working}>
        <Title level={2}>Extract from a file</Title>
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
                    Click or drag a file to this area to extract ASN.1
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
                  onClick={extractFromFile}
                >
                  Extract from a file
                </Button>{" "}
                <ResultButton type="file" extracted={extracted} errored={errored} />
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Title level={2}>Extract from a text</Title>
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
                  placeholder="Enter a text to extraact ASN.1 definition from it"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item>
                <Button
                  disabled={disabledText || visibleModal}
                  onClick={extractFromText}
                >
                  Extract from a text
                </Button>{" "}
                <ResultButton type="text" extracted={extracted} errored={errored} />
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Modal
          title='Extraction result'
          visible={visibleModal}
          onCancel={onCancelModal}
          width="100%"
          footer={null}
        >
          <TextArea
            value={extracted}
            autoSize={{ minRows: 8, maxRows: 24 }}
            readOnly
          />
        </Modal>
      </Spin>
    </>
  );
}
