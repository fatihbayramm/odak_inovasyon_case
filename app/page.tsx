"use client";
import { ROUTES } from "@/utils/routes";
import { useRouter } from "next/navigation";
import Button from "devextreme-react/button";

export default function Home() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
          maxWidth: "800px",
          width: "100%",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "32px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onClick={() => router.push(ROUTES.USERS)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "#4CAF50",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "40px",
            }}
          >
            👥
          </div>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "600", color: "#333" }}>Kullanıcılar</h2>
          <p style={{ margin: 0, color: "#666", textAlign: "center", fontSize: "14px" }}>
            Kullanıcıları görüntüle, düzenle ve yönet
          </p>
          <Button text="Kullanıcıları Görüntüle" type="default" width="100%" />
        </div>

        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "32px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onClick={() => router.push(ROUTES.ORDERS)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "#2196F3",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "40px",
            }}
          >
            📦
          </div>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "600", color: "#333" }}>Siparişler</h2>
          <p style={{ margin: 0, color: "#666", textAlign: "center", fontSize: "14px" }}>
            Siparişleri görüntüle, düzenle ve yönet
          </p>
          <Button text="Siparişleri Görüntüle" type="default" width="100%" />
        </div>
      </div>
    </div>
  );
}
