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
    p("word-extractor", "MIT", "https://www.npmjs.com/package/word-extractor"),
    p("Next.js", "MIT", "https://nextjs.org"),
    p("webpack", "MIT", "https://webpack.js.org"),
    p("React", "MIT", "https://reactjs.org"),
    p("Ant Design", "MIT", "https://ant.design/"),
    p("assert", "MIT", "https://www.npmjs.com/package/assert"),
    p("buffer", "MIT", "https://www.npmjs.com/package/buffer"),
    p("events", "MIT", "https://www.npmjs.com/package/events"),
    p("path-browserify", "MIT", "https://www.npmjs.com/package/path-browserify"),
    p("process", "MIT", "https://www.npmjs.com/package/process"),
    p("stream-browserify", "MIT", "https://www.npmjs.com/package/stream-browserify"),
    p("util", "MIT", "https://www.npmjs.com/package/util"),
    p("browserify-zlib", "MIT", "https://www.npmjs.com/package/browserify-zlib"),
  ];

  return (
    <Modal title="Open source license" footer={null} {...props}>
      <List header={null} footer={null}>
        {projects.map(({ name, license, url }) => {
          const title = url ? (
            <a href={url} target="_blank" rel="noreferrer">
              {name}
            </a>
          ) : (
            { name }
          );
          return (
            <List.Item key={name}>
              <List.Item.Meta title={title} description={license} />
            </List.Item>
          );
        })}
      </List>
    </Modal>
  );
}
