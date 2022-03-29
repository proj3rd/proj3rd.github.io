import { List, Modal } from "antd";

type Props = {
  visible: boolean;
  onCancel: () => void;
};

export default function ModalAttention(props: Props) {

  return (
    <Modal title="Attention" footer={null} {...props}>
      <List>
        <List.Item>
          All serivces and operations are executed on the client side, i.e. your web browser.
          None of data is transferred to the outside.
          At the same time, performance of the serivces and operations depend on client&apos;s processing capability.
        </List.Item>
        <List.Item>
          All services and operations are not capable of handling an encrypted file.
          Make sure that a file you want to use is not encrypted.
        </List.Item>
      </List>
    </Modal>
  );
}
