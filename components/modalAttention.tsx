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
          None of data is transferred to a 'server' and there is no risk of leaking confidential information by Project 3rd itself.
          At the same time, performance of the serivces and operations depend on client's processing capability.
        </List.Item>
      </List>
    </Modal>
  );
}
