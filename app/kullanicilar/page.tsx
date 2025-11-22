"use client";

import { useEffect, useState } from "react";
import DataGrid, { Column } from "devextreme-react/data-grid";
import LoadPanel from "devextreme-react/load-panel";
import Button from "devextreme-react/button";
import { getUsers, User } from "@/services/userService";
import "devextreme/dist/css/dx.light.css";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/utils/routes";
export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  //TODO: burayi normaldeki gibi duzgun bir fonksiyon haline getir.
  useEffect(() => {
    getUsers()
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <LoadPanel visible={loading} message="Yükleniyor..." />
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
        <Button text="Yeni Kullanıcı Ekle" icon="plus" type="default" onClick={() => router.push(ROUTES.USER_NEW())} />
      </div>
      <DataGrid
        dataSource={users}
        showBorders={true}
        columnAutoWidth={true}
        rowAlternationEnabled={true}
        noDataText="Kullanıcılar bulunamadı"
        onRowClick={(e) => {
          router.push(ROUTES.USER_DETAIL(e.data.id));
        }}
        onRowPrepared={(e) => {
          if (e.rowElement) {
            e.rowElement.style.cursor = "pointer";
          }
        }}
      >
        <Column dataField="first_name" caption="Ad" />
        <Column dataField="last_name" caption="Soyad" />
        <Column dataField="username" caption="Kullanıcı Adı" />
        <Column dataField="email" caption="Email" />
        <Column dataField="phone" caption="Telefon" />
        <Column dataField="location" caption="Konum" />
        <Column
          caption="İşlemler"
          width={200}
          alignment="center"
          cellRender={(data: any) => {
            const userId = data.data.id;
            return (
              <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                <Button
                  icon="edit"
                  hint="Düzenle"
                  onClick={(e) => {
                    e.event?.stopPropagation();
                    router.push(ROUTES.USER_DETAIL(userId));
                  }}
                />
                <Button
                  icon="trash"
                  hint="Sil"
                  onClick={(e) => {
                    e.event?.stopPropagation();
                    // Şimdilik işlevsiz
                  }}
                />
                <Button
                  icon="export"
                  hint="Yeni Sekmede Aç"
                  onClick={(e) => {
                    e.event?.stopPropagation();
                    window.open(ROUTES.USER_DETAIL(userId), "_blank");
                  }}
                />
              </div>
            );
          }}
        />
      </DataGrid>
    </div>
  );
}
