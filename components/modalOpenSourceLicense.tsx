import { List, Modal } from "antd";
import Link from "next/link";

type Props = {
  visible: boolean;
  onCancel: () => void;
};

type Project = {
  name: string;
  license: string;
  url?: string;
};

export default function ModalOpenSourceLicense(props: Props) {
  const p = (name: string, license: string, url?: string): Project => ({
    name,
    license,
    url,
  });
  const projects: Project[] = [
    p("grammar3rd", "MIT", "https://github.com/proj3rd/grammar3rd"),
    p("asn3rd", "MIT", "https://github.com/proj3rd/asn3rd"),
    p("ANTLR4", "BSD 3-clause, MIT", "https://www.antlr.org"),
    p("Next.js", "MIT", "https://nextjs.org"),
    p("React", "MIT", "https://reactjs.org"),
    p("Ant Design", "MIT", "https://ant.design/"),
  ];

  return (
    <Modal title="Open source license" footer={null} {...props}>
      <List header={null} footer={null}>
        {projects.map(({ name, license, url }) => {
          const title = url ? (
            <a href={url} target="_blank">
              {name}
            </a>
          ) : (
            { name }
          );
          return (
            <List.Item>
              <List.Item.Meta title={title} description={license} />
            </List.Item>
          );
        })}
      </List>
    </Modal>
  );
}
