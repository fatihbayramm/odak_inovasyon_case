"use client";

import { useState, useEffect } from "react";
import Popup from "devextreme-react/popup";
import Button from "devextreme-react/button";
import SelectBox from "devextreme-react/select-box";
import TextBox from "devextreme-react/text-box";
import NumberBox from "devextreme-react/number-box";
import FileUploader from "devextreme-react/file-uploader";
import { createOrder, OrderStatus, OrderStatusLabels, OrderItem } from "@/services/orderService";
import { getUsers, User } from "@/services/userService";
import { getOrders } from "@/services/orderService";
import ErrorBox from "@/components/common/ErrorBox";
import SuccessBox from "@/components/common/SuccessBox";

interface NewOrderModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewOrderModal({ visible, onClose, onSuccess }: NewOrderModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [status, setStatus] = useState<OrderStatus>(OrderStatus.PENDING);
  const [items, setItems] = useState<Array<OrderItem & { tempId: string }>>([]);

  useEffect(() => {
    if (visible) {
      fetchUsers();
      fetchExistingOrders();
    }
  }, [visible]);

  const fetchUsers = async () => {
    try {
      const userData = await getUsers();
      setUsers(userData);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchExistingOrders = async () => {
    try {
      await getOrders();
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const generateUniqueOrderId = async (): Promise<string> => {
    const existingOrders = await getOrders();
    const existingIds = new Set(existingOrders.map((o) => Number(o.id)));

    let newId: number;
    let attempts = 0;
    const maxAttempts = 1000;

    do {
      // 130'dan sonra rastgele sayı üret (130-999999 arası)
      newId = Math.floor(Math.random() * 999870) + 130;
      attempts++;

      if (attempts > maxAttempts) {
        // Eğer çok fazla deneme yapıldıysa, en yüksek ID'den devam et
        const maxId = existingOrders.length > 0 ? Math.max(...existingOrders.map((o) => Number(o.id))) : 0;
        newId = Math.max(maxId + 1, 130);
        break;
      }
    } while (existingIds.has(newId));

    return String(newId);
  };

  const generateUniqueItemId = (): string => {
    const existingItemIds = items.map((item) => Number(item.id));
    let newId: number;
    let attempts = 0;
    const maxAttempts = 1000;

    do {
      newId = Math.floor(Math.random() * 999999) + 1;
      attempts++;

      if (attempts > maxAttempts) {
        const maxId = existingItemIds.length > 0 ? Math.max(...existingItemIds) : 0;
        newId = maxId + 1;
        break;
      }
    } while (existingItemIds.includes(newId));

    return String(newId);
  };

  const generateOrderNumber = (): string => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 10000);
    return `ORD-${year}-${String(randomNum).padStart(4, "0")}`;
  };

  const handleAddItem = () => {
    const newItem: OrderItem & { tempId: string } = {
      id: generateUniqueItemId(),
      productId: generateUniqueItemId(),
      name: "",
      price: "0",
      quantity: "1",
      total: "0",
      image: "",
      tempId: `temp-${Date.now()}-${Math.random()}`,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (tempId: string) => {
    setItems(items.filter((item) => item.tempId !== tempId));
  };

  const handleItemChange = (tempId: string, field: keyof OrderItem, value: string) => {
    setItems(
      items.map((item) => {
        if (item.tempId === tempId) {
          const updatedItem = { ...item, [field]: value };
          // Total'ı hesapla
          if (field === "price" || field === "quantity") {
            const price = parseFloat(updatedItem.price) || 0;
            const quantity = parseFloat(updatedItem.quantity) || 0;
            updatedItem.total = (price * quantity).toFixed(2);
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const calculateTotalPrice = (): string => {
    const total = items.reduce((sum, item) => {
      return sum + (parseFloat(item.total) || 0);
    }, 0);
    return total.toFixed(2);
  };

  const handleSubmit = async () => {
    if (!userId) {
      setError("Lütfen bir kullanıcı seçiniz");
      return;
    }

    if (items.length === 0) {
      setError("Lütfen en az bir ürün ekleyiniz");
      return;
    }

    // Tüm ürün alanlarının doldurulduğunu kontrol et
    for (const item of items) {
      if (!item.name || !item.price || !item.quantity) {
        setError("Lütfen tüm ürün alanlarını doldurunuz");
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const orderId = await generateUniqueOrderId();
      const orderNumber = generateOrderNumber();
      const totalPrice = calculateTotalPrice();
      const createdAt = new Date().toISOString();

      // tempId'yi kaldır
      const orderItems: OrderItem[] = items.map(({ tempId, ...item }) => item);

      const newOrder = {
        id: orderId,
        userId: userId,
        orderNumber: orderNumber,
        status: status,
        createdAt: createdAt,
        items: orderItems,
        totalPrice: totalPrice,
      };

      await createOrder(newOrder);
      setSuccess("Sipariş başarıyla oluşturuldu");

      // Formu temizle
      setUserId(null);
      setStatus(OrderStatus.PENDING);
      setItems([]);

      // 1 saniye sonra modal'ı kapat ve listeyi yenile
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccess(null);
      }, 1000);
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(null);
    setUserId(null);
    setStatus(OrderStatus.PENDING);
    setItems([]);
    onClose();
  };

  const userOptions = users.map((user) => ({
    value: user.id,
    label: `${user.first_name} ${user.last_name}`,
  }));

  const statusOptions = [
    { value: OrderStatus.COMPLETED, label: OrderStatusLabels[OrderStatus.COMPLETED] },
    { value: OrderStatus.PENDING, label: OrderStatusLabels[OrderStatus.PENDING] },
    { value: OrderStatus.CANCELLED, label: OrderStatusLabels[OrderStatus.CANCELLED] },
  ];

  return (
    <Popup
      visible={visible}
      onHiding={handleClose}
      showTitle={true}
      title="Yeni Sipariş Oluştur"
      width={800}
      height={600}
      showCloseButton={true}
    >
      <div style={{ padding: "20px" }}>
        {error && <ErrorBox error={error} />}
        {success && <SuccessBox success={success} />}

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>
            Kullanıcı <span style={{ color: "red" }}>*</span>
          </label>
          <SelectBox
            dataSource={userOptions}
            value={userId}
            onValueChanged={(e) => setUserId(e.value)}
            displayExpr="label"
            valueExpr="value"
            placeholder="Kullanıcı seçiniz"
            searchEnabled={true}
            width="100%"
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>Durum</label>
          <SelectBox
            dataSource={statusOptions}
            value={status}
            onValueChanged={(e) => setStatus(e.value)}
            displayExpr="label"
            valueExpr="value"
            width="100%"
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <label style={{ fontWeight: "500", fontSize: "14px" }}>Ürünler</label>
            <Button text="Ürün Ekle" icon="plus" type="default" onClick={handleAddItem} />
          </div>

          {items.length === 0 ? (
            <div
              style={{
                padding: "20px",
                textAlign: "center",
                color: "#999",
                backgroundColor: "#f5f5f5",
                borderRadius: "4px",
              }}
            >
              Henüz ürün eklenmedi
            </div>
          ) : (
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              {items.map((item, index) => (
                <div
                  key={item.tempId}
                  style={{
                    padding: "12px",
                    marginBottom: "12px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "4px",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <strong>Ürün {index + 1}</strong>
                    <Button icon="trash" hint="Sil" onClick={() => handleRemoveItem(item.tempId)} />
                  </div>
                  <div
                    style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "8px", marginBottom: "8px" }}
                  >
                    <div>
                      <label style={{ display: "block", marginBottom: "4px", fontSize: "12px" }}>Ürün Adı</label>
                      <TextBox
                        value={item.name}
                        onValueChanged={(e) => handleItemChange(item.tempId, "name", e.value || "")}
                        placeholder="Ürün adı"
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "4px", fontSize: "12px" }}>Fiyat</label>
                      <NumberBox
                        value={parseFloat(item.price)}
                        onValueChanged={(e) => handleItemChange(item.tempId, "price", String(e.value || 0))}
                        format="#,##0.00"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "4px", fontSize: "12px" }}>Miktar</label>
                      <NumberBox
                        value={parseInt(item.quantity)}
                        onValueChanged={(e) => handleItemChange(item.tempId, "quantity", String(e.value || 1))}
                        min={1}
                        placeholder="1"
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "4px", fontSize: "12px" }}>Toplam</label>
                      <TextBox value={`${parseFloat(item.total).toFixed(2)} ₺`} readOnly={true} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "4px", fontSize: "12px" }}>Ürün Görseli</label>
                    <FileUploader
                      accept="image/*"
                      uploadMode="instantly"
                      onValueChanged={(e) => {
                        const file = e.value && e.value.length > 0 ? e.value[0] : null;
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const base64 = event.target?.result as string;
                            handleItemChange(item.tempId, "image", base64);
                          };
                          reader.readAsDataURL(file);
                        } else {
                          handleItemChange(item.tempId, "image", "");
                        }
                      }}
                      multiple={false}
                    />
                    {item.image && (
                      <div style={{ marginTop: "8px" }}>
                        <img
                          src={item.image}
                          alt="Ürün görseli"
                          style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "cover", borderRadius: "4px" }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginBottom: "20px", padding: "12px", backgroundColor: "#e3f2fd", borderRadius: "4px" }}>
          <strong>Toplam Fiyat: {calculateTotalPrice()} ₺</strong>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <Button text="İptal" type="normal" onClick={handleClose} disabled={loading} />
          <Button text="Oluştur" type="default" onClick={handleSubmit} disabled={loading} />
        </div>
      </div>
    </Popup>
  );
}
