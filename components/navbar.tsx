import { Menu } from "antd";
import Link from "next/link";

const { SubMenu } = Menu;

export default function NavBar() {
  return (
    <Menu mode="horizontal">
      <Menu.Item key='proj3rd'>
        <Link href="/">Project 3rd</Link>
      </Menu.Item>
      <SubMenu key="asn1" title="ASN.1">
        <Menu.Item key="validate">
          <Link href="/asn1/validate">Validate</Link>
        </Menu.Item>
      </SubMenu>
    </Menu>
  )
}
