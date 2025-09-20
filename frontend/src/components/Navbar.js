import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./styles/Navbar.css";
import planet from "../assets/planet.png";

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const path = location.pathname;

    return (
        <header className="navbar">
            <div className="navbar-inner">
                <div className="nav-left">
                    <Link to="/" className="logo">
                        <img src={planet} alt="Checksheet" />
                    </Link>
                </div>

                <div className="nav-right">
                    <nav className="nav-menu">
                        {/* <Link
                            to="/explain"
                            className={path === "/explain" ? "active" : ""}
                        >
                            이용방법
                        </Link> */}
                        <Link
                            to="/checksheet/list"
                            className={path.startsWith("/checksheet/list") ? "active" : ""}
                        >
                            체크시트 일람
                        </Link>
                        <Link
                            to="/tasks"
                            className={path === "/tasks" ? "active" : ""}
                        >
                            작업 일람
                        </Link>
                    </nav>
                    <button
                        className="contact-btn"
                        onClick={() => navigate("/checksheet/list")}
                    >
                        바로가기
                    </button>
                </div>
            </div>
        </header>
    );
}
