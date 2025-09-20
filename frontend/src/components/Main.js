import React from "react";
import "./styles/Main.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function Main() {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <section className="hero-container">
        <div className="overlay" />
        <div className="hero-content">

          <h1 className="title">CheckSheet System</h1>
          <p className="subtitle">간편하게 체크시트 기능을 이용해보세요.</p>
          <button
            className="contact-btn"
            onClick={() => navigate("/checksheet/list")}
          >
            바로가기
          </button>
          <div className="info-box">
            <p>
              작업 절차를 표준화한 체크리스트 포맷을 기반으로, 발생한 작업을 손쉽게 기록하고 데이터로 축적할 수 있는 시스템입니다.
            </p>
            <div className="tags">
              <span>체크시트 만들기</span>
              <span>작업 일람</span>
              <span>작업 실시하기</span>
              <span>작업 관리</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
