import { Menu } from "antd";
import Link from "next/link";
import { useState } from "react";
import ModalOpenSourceLicense from "./modalOpenSourceLicense";

const { SubMenu } = Menu;

export default function NavBar() {
  const [visibleModalOpenSourceLicense, setVisibleModalOpenSourceLicense] =
    useState(false);

  function onCancelOpenSourceLicense() {
    setVisibleModalOpenSourceLicense(false);
  }

  function showOpenSourceLicense() {
    setVisibleModalOpenSourceLicense(true);
  }

  return (
    <>
      <Menu mode="horizontal">
        <Menu.Item key="proj3rd">
          <Link href="/">Project 3rd</Link>
        </Menu.Item>
        <SubMenu key="asn1" title="ASN.1">
          <Menu.Item key="validate">
            <Link href="/asn1/validate">Validate</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="help" title="Help">
          <Menu.Item key="opensource-license" onClick={showOpenSourceLicense}>
            Open source license
          </Menu.Item>
        </SubMenu>
      </Menu>

      <ModalOpenSourceLicense
        visible={visibleModalOpenSourceLicense}
        onCancel={onCancelOpenSourceLicense}
      />
    </>
  );
}
