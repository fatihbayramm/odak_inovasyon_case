"use client";

import { useEffect, useState, useRef } from "react";
import DataGrid, { Column, Paging, Pager, Editing } from "devextreme-react/data-grid";
import LoadPanel from "devextreme-react/load-panel";
import Button from "devextreme-react/button";
import DateBox from "devextreme-react/date-box";
import SelectBox from "devextreme-react/select-box";
import NumberBox from "devextreme-react/number-box";
import Popup from "devextreme-react/popup";
import { getOrders, Order, deleteOrder, updateOrder, OrderStatusLabels, OrderStatus } from "@/services/orderService";
import { getUsers, User } from "@/services/userService";
import "devextreme/dist/css/dx.light.css";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/utils/routes";
import ErrorBox from "@/components/common/ErrorBox";
import NewOrderModal from "@/components/orders/NewOrderModal";

export default function OrdersPage() {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();
  const dataGridRef = useRef<any>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const orderData = await getOrders();
      setAllOrders(orderData);

      // Seçili sipariş varsa güncelle
      if (selectedOrder) {
        const updatedOrder = orderData.find((o) => o.id === selectedOrder.id);
        if (updatedOrder) {
          setSelectedOrder(updatedOrder);
          setOrderItems([...updatedOrder.items]);
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const userData = await getUsers();
      setUsers(userData);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      setOrderItems([...selectedOrder.items]);
    } else {
      setOrderItems([]);
    }
  }, [selectedOrder]);

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

    if (selectedUserId) {
      filtered = filtered.filter((order) => order.userId === selectedUserId);
    }

    if (selectedStatus) {
      filtered = filtered.filter((order) => order.status === selectedStatus);
    }

    setFilteredOrders(filtered);
  }, [allOrders, startDate, endDate, selectedUserId, selectedStatus]);

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
    setSelectedUserId(null);
    setSelectedStatus(null);
  };

  const userOptions = users.map((user) => ({
    value: user.id,
    label: `${user.first_name} ${user.last_name}`,
  }));

  const statusOptions = [
    { value: null, label: "Tümü" },
    { value: OrderStatus.COMPLETED, label: OrderStatusLabels[OrderStatus.COMPLETED] },
    { value: OrderStatus.PENDING, label: OrderStatusLabels[OrderStatus.PENDING] },
    { value: OrderStatus.CANCELLED, label: OrderStatusLabels[OrderStatus.CANCELLED] },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <LoadPanel visible={loading} message="Yükleniyor..." />

      <div style={{ marginBottom: "20px" }}>
        <div
          className="filters-container"
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
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>
              Kullanıcı
            </label>
            <SelectBox
              dataSource={userOptions}
              value={selectedUserId}
              onValueChanged={(e) => setSelectedUserId(e.value || null)}
              displayExpr="label"
              valueExpr="value"
              placeholder="Kullanıcı seçiniz"
              searchEnabled={true}
              showClearButton={true}
              width="100%"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>Durum</label>
            <SelectBox
              dataSource={statusOptions}
              value={selectedStatus}
              onValueChanged={(e) => setSelectedStatus(e.value || null)}
              displayExpr="label"
              valueExpr="value"
              placeholder="Durum seçiniz"
              showClearButton={true}
              width="100%"
            />
          </div>
          <div className="filter-buttons" style={{ display: "flex", gap: "8px" }}>
            <Button text="Filtrele" type="default" onClick={handleFilter} />
            <Button text="Temizle" type="outline" onClick={handleClearFilters} />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button text="Yeni Sipariş Ekle" icon="plus" type="default" onClick={() => setIsModalVisible(true)} />
        </div>
      </div>

      {error && <ErrorBox error={error} />}

      <DataGrid
        dataSource={filteredOrders}
        showBorders={true}
        columnAutoWidth={true}
        rowAlternationEnabled={true}
        noDataText="Siparişler bulunamadı"
        onInitialized={(e) => {
          dataGridRef.current = e.component;
        }}
        onRowUpdating={async (e) => {
          try {
            const updatedOrder = await updateOrder(e.oldData.id, {
              userId: e.oldData.userId,
              orderNumber: e.newData.orderNumber || e.oldData.orderNumber,
              status: e.oldData.status,
              createdAt: e.oldData.createdAt,
              items: e.oldData.items,
              totalPrice: e.oldData.totalPrice,
            });
            e.newData = updatedOrder;
            await fetchOrders();
            // Seçili sipariş güncellenirse, selectedOrder'ı da güncelle
            if (selectedOrder?.id === updatedOrder.id) {
              setSelectedOrder(updatedOrder);
            }
          } catch (error) {
            e.cancel = true;
            setError(error instanceof Error ? error.message : String(error));
          }
        }}
        onRowPrepared={(e) => {
          if (e.rowElement) {
            e.rowElement.style.cursor = "pointer";
          }
        }}
        ref={dataGridRef}
      >
        <Editing mode="row" allowUpdating={true} useIcons={true} />
        <Paging defaultPageSize={10} />
        <Pager
          visible={true}
          allowedPageSizes={[5, 10, 20, 30, 50]}
          showPageSizeSelector={true}
          showInfo={true}
          showNavigationButtons={true}
        />
        <Column dataField="orderNumber" caption="Sipariş No" allowEditing={true} />
        <Column
          dataField="userId"
          caption="Kullanıcı"
          cellRender={(data: any) => {
            const userId = data.data.userId;
            const user = users.find((u) => u.id === userId);
            return user ? `${user.first_name} ${user.last_name}` : userId;
          }}
        />
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
            const order = filteredOrders.find((o) => o.id === orderId);
            return (
              <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                <Button
                  icon="edit"
                  hint="Düzenle"
                  onClick={(e) => {
                    e.event?.stopPropagation();
                    if (order) {
                      setSelectedOrder(order);
                      setOrderItems([...order.items]);
                    }
                  }}
                />
                <Button
                  icon="trash"
                  hint="Sil"
                  onClick={async (e) => {
                    e.event?.stopPropagation();
                    await deleteOrder(orderId);
                    await fetchOrders();
                    if (selectedOrder?.id === orderId) {
                      setSelectedOrder(null);
                    }
                  }}
                />
              </div>
            );
          }}
        />
      </DataGrid>

      {selectedOrder && (
        <div style={{ marginTop: "30px" }}>
          <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0 }}>Sipariş Ürünleri - {selectedOrder.orderNumber}</h3>
            <Button icon="close" hint="Kapat" onClick={() => setSelectedOrder(null)} />
          </div>
          <DataGrid
            dataSource={orderItems}
            showBorders={true}
            columnAutoWidth={true}
            rowAlternationEnabled={true}
            noDataText="Ürün bulunamadı"
            onRowUpdating={async (e) => {
              try {
                // Yeni fiyat ve miktarı e.newData'dan al
                // Eğer e.newData undefined/null ise, orderItems state'inden al
                let newPrice =
                  e.newData.price !== undefined && e.newData.price !== null ? String(e.newData.price) : e.oldData.price;
                let newQuantity =
                  e.newData.quantity !== undefined && e.newData.quantity !== null
                    ? String(e.newData.quantity)
                    : e.oldData.quantity;

                // Eğer hala eski değerler varsa, orderItems state'inden güncel değeri al
                if (newPrice === e.oldData.price || newQuantity === e.oldData.quantity) {
                  const currentItem = orderItems.find((item) => item.id === e.oldData.id);
                  if (currentItem) {
                    if (newPrice === e.oldData.price) {
                      newPrice = currentItem.price;
                    }
                    if (newQuantity === e.oldData.quantity) {
                      newQuantity = currentItem.quantity;
                    }
                  }
                }

                // Total'ı hesapla
                const total = (parseFloat(newPrice) * parseFloat(newQuantity)).toFixed(2);

                // Güncellenmiş ürünü oluştur
                const updatedItem = {
                  ...e.oldData,
                  price: newPrice,
                  quantity: newQuantity,
                  total: total,
                };

                // Tüm ürünleri güncelle
                const updatedItems = orderItems.map((item) => (item.id === updatedItem.id ? updatedItem : item));

                // Toplam fiyatı hesapla
                const totalPrice = updatedItems.reduce((sum, item) => sum + parseFloat(item.total), 0).toFixed(2);

                // Update isteği at
                const updatedOrder = await updateOrder(selectedOrder.id, {
                  userId: selectedOrder.userId,
                  orderNumber: selectedOrder.orderNumber,
                  status: selectedOrder.status,
                  createdAt: selectedOrder.createdAt,
                  items: updatedItems,
                  totalPrice: totalPrice,
                });

                // Response'dan gelen değerleri state'e set et
                setSelectedOrder(updatedOrder);
                setOrderItems([...updatedOrder.items]);

                // DataGrid'e güncellenmiş ürünü set et
                const updatedItemFromResponse = updatedOrder.items.find((item) => item.id === e.oldData.id);
                if (updatedItemFromResponse) {
                  e.newData = updatedItemFromResponse;
                } else {
                  e.newData = updatedItem;
                }

                // Sipariş listesini yenile
                await fetchOrders();
              } catch (error) {
                e.cancel = true;
                setError(error instanceof Error ? error.message : String(error));
              }
            }}
          >
            <Editing mode="row" allowUpdating={true} useIcons={true} />
            <Paging defaultPageSize={10} />
            <Pager
              visible={true}
              allowedPageSizes={[5, 10, 20, 30, 50]}
              showPageSizeSelector={true}
              showInfo={true}
              showNavigationButtons={true}
            />
            <Column dataField="id" caption="ID" width={80} allowEditing={false} />
            <Column dataField="productId" caption="Ürün ID" width={100} allowEditing={false} />
            <Column dataField="name" caption="Ürün Adı" allowEditing={false} />
            <Column
              dataField="price"
              caption="Fiyat"
              allowEditing={true}
              cellRender={(data: any) => {
                return formatPrice(data.value);
              }}
              editCellRender={(data: any) => {
                // Edit modunda mevcut değeri al
                const itemId = data.data?.id;
                const currentItem = orderItems.find((item) => item.id === itemId);
                const currentValue = currentItem ? parseFloat(currentItem.price || "0") : parseFloat(data.value || "0");

                return (
                  <NumberBox
                    value={currentValue}
                    onValueChanged={(e) => {
                      const newValue = String(e.value || 0);
                      // DataGrid'in internal state'ini güncelle
                      data.setValue(newValue);
                      // orderItems state'ini de güncelle
                      if (itemId) {
                        setOrderItems((prevItems) =>
                          prevItems.map((item) => (item.id === itemId ? { ...item, price: newValue } : item))
                        );
                      }
                    }}
                    format="#,##0.00"
                    min={0}
                    width="100%"
                  />
                );
              }}
            />
            <Column
              dataField="quantity"
              caption="Miktar"
              width={100}
              allowEditing={true}
              editCellRender={(data: any) => {
                // Edit modunda mevcut değeri al
                const itemId = data.data?.id;
                const currentItem = orderItems.find((item) => item.id === itemId);
                const currentValue = currentItem ? parseInt(currentItem.quantity || "1") : parseInt(data.value || "1");

                return (
                  <NumberBox
                    value={currentValue}
                    onValueChanged={(e) => {
                      const newValue = String(e.value || 1);
                      // DataGrid'in internal state'ini güncelle
                      data.setValue(newValue);
                      // orderItems state'ini de güncelle
                      if (itemId) {
                        setOrderItems((prevItems) =>
                          prevItems.map((item) => (item.id === itemId ? { ...item, quantity: newValue } : item))
                        );
                      }
                    }}
                    min={1}
                    width="100%"
                  />
                );
              }}
            />
            <Column
              dataField="total"
              caption="Toplam"
              allowEditing={false}
              cellRender={(data: any) => {
                return formatPrice(data.value);
              }}
            />
            <Column
              caption="İşlemler"
              width={150}
              alignment="center"
              allowEditing={false}
              cellRender={(data: any) => {
                const item = data.data;
                const hasImage = item.image && item.image.trim() !== "";
                return (
                  <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                    {hasImage && (
                      <Button
                        icon="image"
                        hint="Resmi Görüntüle"
                        onClick={(e) => {
                          e.event?.stopPropagation();
                          setSelectedImage(item.image);
                          setImageModalVisible(true);
                        }}
                      />
                    )}
                  </div>
                );
              }}
            />
          </DataGrid>
        </div>
      )}

      <Popup
        visible={imageModalVisible}
        onHiding={() => {
          setImageModalVisible(false);
          setSelectedImage(null);
        }}
        showTitle={true}
        title="Ürün Görseli"
        width={600}
        height={600}
        showCloseButton={true}
      >
        <div
          style={{
            padding: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Ürün görseli"
              style={{
                maxWidth: "100%",
                maxHeight: "500px",
                objectFit: "contain",
                borderRadius: "4px",
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null; // Sonsuz döngüyü önle
                target.src = ""; // Resmi temizle
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent && !parent.querySelector(".error-message")) {
                  const errorDiv = document.createElement("div");
                  errorDiv.className = "error-message";
                  errorDiv.textContent = "Resim yüklenemedi";
                  errorDiv.style.color = "#999";
                  errorDiv.style.textAlign = "center";
                  errorDiv.style.padding = "20px";
                  parent.appendChild(errorDiv);
                }
              }}
            />
          ) : (
            <div style={{ color: "#999", textAlign: "center" }}>Resim bulunamadı</div>
          )}
        </div>
      </Popup>

      <NewOrderModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} onSuccess={fetchOrders} />

      <style jsx global>{`
        @media (max-width: 768px) {
          .filters-container {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .filters-container > div {
            flex: 1 1 100% !important;
            width: 100% !important;
          }
          .filter-buttons {
            width: 100% !important;
            justify-content: stretch !important;
          }
          .filter-buttons button {
            flex: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
