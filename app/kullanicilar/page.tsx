"use client";

import { useEffect, useState } from "react";
import DataGrid, { Column } from "devextreme-react/data-grid";
import LoadPanel from "devextreme-react/load-panel";
import { getUsers, User } from "@/services/userService";
import "devextreme/dist/css/dx.light.css";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

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
      <DataGrid dataSource={users} showBorders={true} columnAutoWidth={true} rowAlternationEnabled={true}>
        <Column dataField="name.firstname" caption="Ad" />
        <Column dataField="name.lastname" caption="Soyad" />
        <Column dataField="username" caption="Kullanıcı Adı" />
        <Column dataField="email" caption="Email" />
        <Column dataField="phone" caption="Telefon" />
        <Column
          caption="Adres"
          cellRender={(data: any) => {
            return `${data.data.address.street}, ${data.data.address.city}`;
          }}
        />
      </DataGrid>
    </div>
  );
}
