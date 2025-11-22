"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Button from "devextreme-react/button";
import Popup from "devextreme-react/popup";
import { ROUTES } from "@/utils/routes";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header
        style={{
          backgroundColor: "#fff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          padding: "0 20px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: "600",
              color: "#333",
              cursor: "pointer",
            }}
            onClick={() => router.push(ROUTES.HOME)}
          >
            Odak İnovasyon
          </h1>

          <div
            className="desktop-nav"
            style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "16px" }}
          >
            <Button
              text="Kullanıcılar"
              type={isActive(ROUTES.USERS) ? "default" : "normal"}
              onClick={() => router.push(ROUTES.USERS)}
              stylingMode="text"
            />
            <Button
              text="Siparişler"
              type={isActive(ROUTES.ORDERS) ? "default" : "normal"}
              onClick={() => router.push(ROUTES.ORDERS)}
              stylingMode="text"
            />
          </div>
        </div>

        <nav style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div className="desktop-nav">
            <Button
              text="Çıkış Yap"
              icon="export"
              type="normal"
              onClick={() => {
                console.log("Çıkış yapılıyor...");
              }}
              stylingMode="text"
            />
          </div>

          <Button
            icon="menu"
            type="normal"
            onClick={() => setIsMenuOpen(true)}
            stylingMode="text"
            className="mobile-menu-btn"
          />
        </nav>
      </header>

      <Popup
        visible={isMenuOpen}
        onHiding={() => setIsMenuOpen(false)}
        showTitle={false}
        width="280px"
        height="auto"
        showCloseButton={true}
      >
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <Button
            text="Kullanıcılar"
            type={isActive(ROUTES.USERS) ? "default" : "normal"}
            onClick={() => handleNavigation(ROUTES.USERS)}
            width="100%"
            stylingMode="outlined"
          />
          <Button
            text="Siparişler"
            type={isActive(ROUTES.ORDERS) ? "default" : "normal"}
            onClick={() => handleNavigation(ROUTES.ORDERS)}
            width="100%"
            stylingMode="outlined"
          />
          <div style={{ height: "1px", backgroundColor: "#e0e0e0", margin: "8px 0" }} />
          <Button
            text="Çıkış Yap"
            icon="export"
            type="normal"
            onClick={() => {
              console.log("Çıkış yapılıyor...");
              setIsMenuOpen(false);
            }}
            width="100%"
            stylingMode="outlined"
          />
        </div>
      </Popup>

      <style jsx global>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
