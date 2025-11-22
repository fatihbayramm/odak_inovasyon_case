"use client";
import {
  getUser,
  updateUser,
  User,
  CreateOrUpdateUser,
  createUser,
  deleteUser,
  getUsers,
} from "@/services/userService";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TextBox from "devextreme-react/text-box";
import Button from "devextreme-react/button";
import CheckBox from "devextreme-react/check-box";
import LoadPanel from "devextreme-react/load-panel";
import "devextreme/dist/css/dx.light.css";
import { ROUTES } from "@/utils/routes";
import ErrorBox from "@/components/ErrorBox";

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();

  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<CreateOrUpdateUser>({
    id: "0",
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    status: "active",
  });

  const fetchUser = async () => {
    if (id === "new") return;
    try {
      setLoading(true);
      setError(null);
      const userData = await getUser(Number(id));
      setUser(userData);
      setFormData({
        id: userData.id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        location: userData.location,
        status: userData.status,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchUser();
  }, [id]);

  const generateUniqueId = async (): Promise<number> => {
    const existingUsers = await getUsers();
    const existingIds = new Set(existingUsers.map((u) => u.id));

    let newId: number;
    let attempts = 0;
    const maxAttempts = 1000;

    do {
      // 100'den sonra rastgele sayı üret (100-999999 arası)
      newId = Math.floor(Math.random() * 999900) + 100;
      attempts++;

      if (attempts > maxAttempts) {
        // Eğer çok fazla deneme yapıldıysa, en yüksek ID'den devam et
        const maxId = existingUsers.length > 0 ? Math.max(...existingUsers.map((u) => Number(u.id))) : 0;
        newId = Math.max(maxId + 1, 100);
        break;
      }
    } while (existingIds.has(String(newId)));

    return newId;
  };

  const handleSubmit = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      if (id !== "new") {
        const response = await updateUser(Number(id), formData);
        setUser(response);
        setFormData({
          id: response.id,
          first_name: response.first_name,
          last_name: response.last_name,
          username: response.username,
          email: response.email,
          phone: response.phone,
          location: response.location,
          password: response.password,
        });
      }

      if (id === "new") {
        const uniqueId = await generateUniqueId();
        const userWithId = { ...formData, id: String(uniqueId) };
        const response = await createUser(userWithId);
        // setUser(response);
        router.push(ROUTES.USER_DETAIL(response.id));
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  if (id !== "new" && !user) {
    return (
      <div style={{ padding: "20px" }}>
        <LoadPanel visible={loading} message="Yükleniyor..." />
        {error && <ErrorBox error={error} />}
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <LoadPanel visible={loading} message="Yükleniyor..." />

      {error && <ErrorBox error={error} />}

      <div style={{ marginBottom: "30px" }}>
        <Button
          text="Geri Dön"
          icon="back"
          onClick={() => router.push(ROUTES.USERS)}
          style={{ marginBottom: "20px" }}
        />
        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "30px" }}>
          {id === "new" ? "Yeni Kullanıcı Oluştur" : "Kullanıcı Detayları"}
        </h1>
      </div>

      <div style={{ display: "grid", gap: "30px" }}>
        <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px" }}>Düzenlenebilir Bilgiler</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div style={{ display: "grid", gap: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Ad</label>
                <TextBox
                  value={formData.first_name}
                  onValueChanged={(e) => setFormData({ ...formData, first_name: e.value })}
                  placeholder="Ad giriniz"
                  disabled={loading}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Soyad</label>
                <TextBox
                  value={formData.last_name}
                  onValueChanged={(e) => setFormData({ ...formData, last_name: e.value })}
                  placeholder="Soyad giriniz"
                  disabled={loading}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Kullanıcı Adı</label>
                <TextBox
                  value={formData.username}
                  onValueChanged={(e) => setFormData({ ...formData, username: e.value })}
                  placeholder="Kullanıcı adı giriniz"
                  disabled={loading}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>E-posta</label>
                <TextBox
                  value={formData.email}
                  onValueChanged={(e) => setFormData({ ...formData, email: e.value })}
                  placeholder="E-posta giriniz"
                  disabled={loading}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Telefon</label>
                <TextBox
                  value={formData.phone}
                  onValueChanged={(e) => setFormData({ ...formData, phone: e.value })}
                  placeholder="Telefon giriniz"
                  disabled={loading}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Konum</label>
                <TextBox
                  value={formData.location}
                  onValueChanged={(e) => setFormData({ ...formData, location: e.value })}
                  placeholder="Konum giriniz"
                  disabled={loading}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Şifre</label>
                <TextBox
                  value={formData.password}
                  onValueChanged={(e) => setFormData({ ...formData, password: e.value })}
                  mode={showPassword ? "text" : "password"}
                  placeholder="Şifre giriniz"
                  disabled={loading}
                />
                <div style={{ marginTop: "8px" }}>
                  <CheckBox
                    text="Şifreyi göster"
                    value={showPassword}
                    onValueChanged={(e) => setShowPassword(e.value)}
                  />
                </div>
              </div>

              {submitError && <ErrorBox error={submitError} />}

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <Button
                    text="Kullanıcıyı Sil"
                    type="danger"
                    onClick={async (e) => {
                      e.event?.stopPropagation();
                      await deleteUser(Number(id));
                      router.push(ROUTES.USERS);
                    }}
                    disabled={loading}
                    style={{ marginTop: "10px" }}
                  />
                </div>
                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <Button
                    text="İptal"
                    type="outline"
                    onClick={() => router.push(ROUTES.USERS)}
                    disabled={loading}
                    style={{ marginTop: "10px" }}
                  />
                  <Button
                    text={id === "new" ? "Oluştur" : "Güncelle"}
                    type="default"
                    useSubmitBehavior={true}
                    disabled={loading}
                    style={{ marginTop: "10px" }}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
