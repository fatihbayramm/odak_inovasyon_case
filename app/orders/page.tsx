"use client";

import { useEffect, useState } from "react";
import DataGrid, { Column, Paging, Pager } from "devextreme-react/data-grid";
import LoadPanel from "devextreme-react/load-panel";
import Button from "devextreme-react/button";
import DateBox from "devextreme-react/date-box";
import { getOrders, Order, deleteOrder, OrderStatusLabels } from "@/services/orderService";
import "devextreme/dist/css/dx.light.css";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/utils/routes";
import ErrorBox from "@/components/ErrorBox";

export default function OrdersPage() {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const router = useRouter();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const orderData = await getOrders();
      setAllOrders(orderData);
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = [...allOrders];

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate >= start;
      });
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate <= end;
      });
    }

    setFilteredOrders(filtered);
  }, [allOrders, startDate, endDate]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: string) => {
    return `${parseFloat(price).toFixed(2)} ₺`;
  };

  const handleFilter = () => {
    // Filtreleme otomatik olarak useEffect ile yapılıyor
    // Bu fonksiyon sadece buton tıklaması için
    // useEffect zaten startDate ve endDate değiştiğinde çalışıyor
  };

  const handleClearFilters = () => {
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <LoadPanel visible={loading} message="Yükleniyor..." />

      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "flex-end",
            marginBottom: "16px",
            padding: "16px",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
          }}
        >
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>
              Başlangıç Tarihi
            </label>
            <DateBox
              value={startDate}
              onValueChanged={(e) => setStartDate(e.value)}
              placeholder="Başlangıç tarihi seçiniz"
              displayFormat="dd/MM/yyyy"
              type="date"
              width="100%"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>
              Bitiş Tarihi
            </label>
            <DateBox
              value={endDate}
              onValueChanged={(e) => setEndDate(e.value)}
              placeholder="Bitiş tarihi seçiniz"
              displayFormat="dd/MM/yyyy"
              type="date"
              width="100%"
            />
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <Button text="Filtrele" type="default" onClick={handleFilter} />
            <Button text="Temizle" type="outline" onClick={handleClearFilters} />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            text="Yeni Sipariş Ekle"
            icon="plus"
            type="default"
            onClick={() => router.push(ROUTES.ORDER_DETAIL("new"))}
          />
        </div>
      </div>

      {error && <ErrorBox error={error} />}

      <DataGrid
        dataSource={filteredOrders}
        showBorders={true}
        columnAutoWidth={true}
        rowAlternationEnabled={true}
        noDataText="Siparişler bulunamadı"
        onRowClick={(e) => {
          router.push(ROUTES.ORDER_DETAIL(e.data.id));
        }}
        onRowPrepared={(e) => {
          if (e.rowElement) {
            e.rowElement.style.cursor = "pointer";
          }
        }}
      >
        <Paging defaultPageSize={10} />
        <Pager
          visible={true}
          allowedPageSizes={[5, 10, 20, 30, 50]}
          showPageSizeSelector={true}
          showInfo={true}
          showNavigationButtons={true}
        />
        <Column dataField="orderNumber" caption="Sipariş No" />
        <Column dataField="userId" caption="Kullanıcı ID" />
        <Column
          dataField="status"
          caption="Durum"
          cellRender={(data: any) => {
            return OrderStatusLabels[data.value as keyof typeof OrderStatusLabels] || data.value;
          }}
        />
        <Column
          dataField="createdAt"
          caption="Oluşturulma Tarihi"
          cellRender={(data: any) => {
            return formatDate(data.value);
          }}
        />
        <Column
          dataField="totalPrice"
          caption="Toplam Fiyat"
          cellRender={(data: any) => {
            return formatPrice(data.value);
          }}
        />
        <Column
          caption="İşlemler"
          width={200}
          alignment="center"
          cellRender={(data: any) => {
            const orderId = data.data.id;
            return (
              <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                <Button
                  icon="edit"
                  hint="Düzenle"
                  onClick={(e) => {
                    e.event?.stopPropagation();
                    router.push(ROUTES.ORDER_DETAIL(orderId));
                  }}
                />
                <Button
                  icon="trash"
                  hint="Sil"
                  onClick={async (e) => {
                    e.event?.stopPropagation();
                    await deleteOrder(orderId);
                    await fetchOrders();
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
