import React from "react";
import Navbar from "./Navbar";
import { Layout as AntLayout } from "antd";
import { Outlet } from "react-router-dom";

const { Content } = AntLayout;

export default function Layout() {
  return (
    <AntLayout
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column", // 세로 레이아웃
      }}
    >
      <Navbar />

      <Content
        style={{
          flex: 1,                // ⬅️ 남은 공간을 모두 차지
          margin: "80px 16px 16px", // 헤더 높이만큼 위 여백
          overflow: "auto",
          padding: 24,
          background: "#fff",
        }}
      >
        <Outlet />
      </Content>
    </AntLayout>
  );
}
