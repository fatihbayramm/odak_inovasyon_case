"use client";
import { getUser, updateUser, User, CreateOrUpdateUser, createUser } from "@/services/userService";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TextBox from "devextreme-react/text-box";
import Button from "devextreme-react/button";
import LoadPanel from "devextreme-react/load-panel";
import "devextreme/dist/css/dx.light.css";
import { ROUTES } from "@/utils/routes";

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();

  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateOrUpdateUser>({
    id: 0,
    username: "",
    email: "",
    password: "",
  });

  const fetchUser = async () => {
    if (id === "yeni") return;
    try {
      setLoading(true);
      setError(null);
      const userData = await getUser(Number(id));
      setUser(userData);
      setFormData({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        password: userData.password,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const handleSubmit = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      if (id !== "yeni") {
        const response = await updateUser(Number(id), formData);
        setUser(response);
        setFormData({
          id: response.id,
          username: response.username,
          email: response.email,
          password: response.password,
        });
      }

      if (id === "yeni") {
        const response = await createUser(formData);
        setUser(response);
        router.push(ROUTES.USER_DETAIL(response.id));
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  if (id !== "yeni" && !user) {
    return (
      <div style={{ padding: "20px" }}>
        <LoadPanel visible={loading} message="Yükleniyor..." />
        {error && <div style={{ color: "red", marginTop: "20px" }}>Hata: {error}</div>}
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <LoadPanel visible={loading} message="Yükleniyor..." />

      {error && <div style={{ color: "red", marginTop: "20px" }}>Hata: {error}</div>}

      <div style={{ marginBottom: "30px" }}>
        <Button text="Geri Dön" icon="back" onClick={() => router.back()} style={{ marginBottom: "20px" }} />
        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "30px" }}>
          {id === "yeni" ? "Yeni Kullanıcı Oluştur" : "Kullanıcı Detayları"}
        </h1>
      </div>

      <div style={{ display: "grid", gap: "30px" }}>
        <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px" }}>Düzenlenebilir Bilgiler</h2>
          <div style={{ display: "grid", gap: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Kullanıcı Adı</label>
              <TextBox
                value={formData.username}
                onValueChanged={(e) => setFormData({ ...formData, username: e.value })}
                placeholder="Kullanıcı adı giriniz"
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>E-posta</label>
              <TextBox
                value={formData.email}
                onValueChanged={(e) => setFormData({ ...formData, email: e.value })}
                placeholder="E-posta giriniz"
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Şifre</label>
              <TextBox
                value={formData.password}
                onValueChanged={(e) => setFormData({ ...formData, password: e.value })}
                mode="password"
                placeholder="Şifre giriniz"
              />
            </div>

            {submitError && (
              <div
                style={{
                  color: "red",
                  marginBottom: "20px",
                  padding: "10px",
                  backgroundColor: "#ffebee",
                  borderRadius: "4px",
                }}
              >
                Hata: {submitError}
              </div>
            )}

            <Button
              text={id === "yeni" ? "Oluştur" : "Güncelle"}
              type="default"
              onClick={handleSubmit}
              disabled={loading}
              style={{ marginTop: "10px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
