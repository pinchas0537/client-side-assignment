import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    DollarSign,
    TrendingUp,
    Trophy,
    BarChart2,
    Star,
    Plus,
    Edit,
    Trash2,
    Users,
    Loader2,
    X,
} from "lucide-react";

import { getItems, deleteItem, createItem, updateItem } from "../api/items";
import { getSuppliers, deleteSupplier, createSupplier, updateSupplier } from "../api/suppliers";
import {
    getMonthlyRevenue,
    getWeeklyTopCategory,
    getDailyTopItem,
    getItemMargins,
    getMostProfitableSupplier,
} from "../api/analytics";

import { toast } from "react-toastify";
import styles from "./Admin.module.css";

import type {
    Item,
    Supplier,
    AnalyticsRevenue,
    AnalyticsCategory,
    AnalyticsTopItem,
    AnalyticsMargins,
    AnalyticsTopSupplier,
} from "../types";

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

const Admin: React.FC = () => {
    const queryClient = useQueryClient();

    const [modalMode, setModalMode] = useState<"item" | "supplier" | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [itemForm, setItemForm] = useState<Partial<Item>>({
        name: "",
        category: "",
        price: 0,
        consumerPrice: 0,
        stock: 0,
        supplierId: "",
        image: "",
    });
    const [supplierForm, setSupplierForm] = useState<Partial<Supplier & { contactInfo?: string }>>({
        name: "",
        contactInfo: "",
    });

    const { data: items = [], isLoading: itemsLoading } = useQuery<Item[]>({ queryKey: ["items"], queryFn: getItems });
    const { data: suppliers = [] } = useQuery<Supplier[]>({ queryKey: ["suppliers"], queryFn: getSuppliers });

    const { data: revRes } = useQuery<ApiResponse<AnalyticsRevenue>>({
        queryKey: ["revenue"],
        queryFn: getMonthlyRevenue,
    });
    const { data: catRes } = useQuery<ApiResponse<AnalyticsCategory>>({
        queryKey: ["topCategory"],
        queryFn: getWeeklyTopCategory,
    });
    const { data: itemRes } = useQuery<ApiResponse<AnalyticsTopItem>>({
        queryKey: ["topItem"],
        queryFn: getDailyTopItem,
    });
    const { data: marginRes } = useQuery<ApiResponse<AnalyticsMargins>>({
        queryKey: ["margins"],
        queryFn: getItemMargins,
    });
    const { data: supRes } = useQuery<ApiResponse<AnalyticsTopSupplier>>({
        queryKey: ["topSupplier"],
        queryFn: getMostProfitableSupplier,
    });

    const itemMutation = useMutation({
        mutationFn: async (data: Partial<Item>) => {
            const payload = {
                ...data,
                price: Number(data.price),
                consumerPrice: Number(data.consumerPrice),
                stock: Number(data.stock),
            };
            return editingId ? updateItem(editingId, payload) : createItem(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["items"] });
            toast.success(editingId ? "המוצר עודכן" : "המוצר נוסף בהצלחה");
            closeModal();
        },
        onError: (err: any) => {
            const msg = err.response?.data?.message || "שגיאה בשמירת המוצר";
            toast.error(msg);
        },
    });

    const supplierMutation = useMutation({
        mutationFn: async (data: Partial<Supplier>) => {
            return editingId ? updateSupplier(editingId, data) : createSupplier(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["suppliers"] });
            toast.success("פרטי הספק נשמרו");
            closeModal();
        },
        onError: (err: any) => toast.error(err.response?.data?.message || "שגיאה בשמירת הספק"),
    });

    const deleteItemMutation = useMutation({
        mutationFn: deleteItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["items"] });
            toast.success("המוצר נמחק");
        },
    });

    const deleteSupMutation = useMutation({
        mutationFn: deleteSupplier,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["suppliers"] });
            toast.success("הספק נמחק");
        },
    });

    const openItemModal = (item: Item | null = null) => {
        if (item) {
            setEditingId(item._id);
            setItemForm({
                name: item.name,
                category: item.category,
                price: item.price,
                consumerPrice: item.consumerPrice,
                stock: item.stock,
                supplierId: typeof item.supplierId === "object" ? (item.supplierId as any)._id : item.supplierId,
                image: item.image || "",
            });
        } else {
            setEditingId(null);
            setItemForm({ name: "", category: "", price: 0, consumerPrice: 0, stock: 0, supplierId: "", image: "" });
        }
        setModalMode("item");
    };

    const openSupplierModal = (sup: Supplier | null = null) => {
        if (sup) {
            setEditingId(sup._id);
            setSupplierForm({ name: sup.name, contactInfo: (sup as any).contactInfo || "" });
        } else {
            setEditingId(null);
            setSupplierForm({ name: "", contactInfo: "" });
        }
        setModalMode("supplier");
    };

    const closeModal = () => {
        setModalMode(null);
        setEditingId(null);
    };

    if (itemsLoading)
        return (
            <div className={styles.loaderCenter}>
                <Loader2 className="animate-spin" size={40} />
            </div>
        );

    return (
        <div className={`container ${styles.adminContainer}`}>
            <div className={styles.header}>
                <LayoutDashboard size={36} className={styles.headerIcon} />
                <h1>ניהול מערכת</h1>
            </div>
            <section className={styles.dashboardSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                        <BarChart2 size={24} /> ביצועים וסטטיסטיקה
                    </h2>
                </div>
                <div className={styles.analyticsGrid}>
                    <StatCard icon={<Package />} label="מוצרים" value={items.length} />
                    <StatCard
                        icon={<ShoppingBag color="orange" />}
                        label="חוסרים"
                        value={items.filter((i) => i.stock < 5).length}
                    />
                    <StatCard
                        icon={<DollarSign color="green" />}
                        label="פדיון חודשי"
                        value={`₪${revRes?.data?.toLocaleString() || 0}`}
                    />
                    <StatCard
                        icon={<TrendingUp color="blue" />}
                        label="קטגוריה חזקה"
                        value={catRes?.data?._id || "---"}
                    />
                    <StatCard
                        icon={<Trophy color="gold" />}
                        label="המוצר הכי נמכר היום"
                        value={itemRes?.data?.name || "---"}
                    />
                    <StatCard
                        icon={<Star color="purple" />}
                        label="רווחיות שיא"
                        value={`${marginRes?.data?.highest?.margin || 0}₪`}
                        subtext={`הכי רווחי: ${marginRes?.data?.highest?.name || "---"}`}
                    />
                    <StatCard
                        icon={<Star color="purple" />}
                        label="רווחיות נמוכה"
                        value={`${marginRes?.data?.lowest?.margin || 0}₪`}
                        subtext={`הכי פחות רווחי: ${marginRes?.data?.lowest?.name || "---"}`}
                    />
                    <StatCard icon={<Users color="cyan" />} label="ספק הכי רווחי" value={supRes?.data?._id || "---"} />
                </div>
            </section>

            <section className={styles.dashboardSection}>
                <div className={styles.sectionHeader}>
                    <h2>מוצרים במערכת</h2>
                    <button className="btn btn-primary" onClick={() => openItemModal()}>
                        <Plus size={18} /> מוצר חדש
                    </button>
                </div>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>שם</th>
                            <th>קטגוריה</th>
                            <th>מחיר צרכן</th>
                            <th>מלאי</th>
                            <th>פעולות</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item._id}>
                                <td>{item.name}</td>
                                <td>{item.category}</td>
                                <td>₪{item.consumerPrice}</td>
                                <td className={item.stock < 5 ? styles.warningText : ""}>{item.stock}</td>
                                <td>
                                    <div className={styles.actionCell}>
                                        <button className="btn btn-icon" onClick={() => openItemModal(item)}>
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            className="btn btn-icon btn-danger"
                                            onClick={() =>
                                                window.confirm("למחוק מוצר?") && deleteItemMutation.mutate(item._id)
                                            }
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* טבלת ספקים */}
            <section className={styles.dashboardSection}>
                <div className={styles.sectionHeader}>
                    <h2>ספקים רשומים</h2>
                    <button className="btn btn-primary" onClick={() => openSupplierModal()}>
                        <Plus size={18} /> ספק חדש
                    </button>
                </div>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>שם ספק</th>
                            <th>מספר מוצרים</th>
                            <th>פעולות</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.map((sup) => (
                            <tr key={sup._id}>
                                <td>{sup.name}</td>
                                <td>{sup.items?.length || 0}</td>
                                <td>
                                    <div className={styles.actionCell}>
                                        <button className="btn btn-icon" onClick={() => openSupplierModal(sup)}>
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            className="btn btn-icon btn-danger"
                                            onClick={() =>
                                                window.confirm("למחוק ספק?") && deleteSupMutation.mutate(sup._id)
                                            }
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* Modal - הוספה ועריכה */}
            {modalMode && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3>
                                {editingId ? "עריכת" : "הוספת"} {modalMode === "item" ? "מוצר" : "ספק"}
                            </h3>
                            <button onClick={closeModal} className={styles.closeBtn}>
                                <X />
                            </button>
                        </div>

                        {modalMode === "item" ? (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    itemMutation.mutate(itemForm);
                                }}
                            >
                                <div className={styles.formGroup}>
                                    <label>שם מוצר</label>
                                    <input
                                        value={itemForm.name}
                                        onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>קטגוריה (שדה חובה)</label>
                                    <input
                                        value={itemForm.category}
                                        onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label>עלות ספק</label>
                                        <input
                                            type="number"
                                            value={itemForm.price}
                                            onChange={(e) =>
                                                setItemForm({ ...itemForm, price: Number(e.target.value) })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>מחיר לצרכן</label>
                                        <input
                                            type="number"
                                            value={itemForm.consumerPrice}
                                            onChange={(e) =>
                                                setItemForm({ ...itemForm, consumerPrice: Number(e.target.value) })
                                            }
                                            required
                                        />
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>מלאי נוכחי</label>
                                    <input
                                        type="number"
                                        value={itemForm.stock}
                                        onChange={(e) => setItemForm({ ...itemForm, stock: Number(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>שיוך לספק</label>
                                    <select
                                        value={typeof itemForm.supplierId === "string" ? itemForm.supplierId : ""}
                                        onChange={(e) => setItemForm({ ...itemForm, supplierId: e.target.value })}
                                        required
                                    >
                                        <option value="">בחירה...</option>
                                        {suppliers.map((s) => (
                                            <option key={s._id} value={s._id}>
                                                {s.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary w-full"
                                    disabled={itemMutation.isPending}
                                >
                                    {itemMutation.isPending ? (
                                        <Loader2 className="animate-spin" size={18} />
                                    ) : (
                                        "שמור מוצר"
                                    )}
                                </button>
                            </form>
                        ) : (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    supplierMutation.mutate(supplierForm);
                                }}
                            >
                                <div className={styles.formGroup}>
                                    <label>שם הספק</label>
                                    <input
                                        value={supplierForm.name}
                                        onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>פרטי קשר / טלפון</label>
                                    <input
                                        value={supplierForm.contactInfo}
                                        onChange={(e) =>
                                            setSupplierForm({ ...supplierForm, contactInfo: e.target.value })
                                        }
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary w-full"
                                    disabled={supplierMutation.isPending}
                                >
                                    {supplierMutation.isPending ? (
                                        <Loader2 className="animate-spin" size={18} />
                                    ) : (
                                        "שמור ספק"
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; subtext?: string }> = ({
    icon,
    label,
    value,
    subtext,
}) => (
    <div className={styles.statCard}>
        <div className={styles.statIcon}>{icon}</div>
        <div className={styles.statContent}>
            <div className={styles.statLabel}>{label}</div>
            <div className={styles.statValue}>{value}</div>
            {subtext && <div className={styles.statSubtext}>{subtext}</div>}
        </div>
    </div>
);

export default Admin;
