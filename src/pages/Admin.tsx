import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  LayoutDashboard, Package, ShoppingBag, DollarSign, 
  TrendingUp, Trophy, BarChart2, Star, Plus, Edit, Trash2, Users
} from 'lucide-react';
import { getItems } from '../api/items';
import { getSuppliers } from '../api/suppliers';
import { 
  getMonthlyRevenue, getWeeklyTopCategory, getDailyTopItem, 
  getItemMargins, getMostProfitableSupplier 
} from '../api/analytics';
import styles from './Admin.module.css';

const Admin: React.FC = () => {
  const { data: items = [] } = useQuery({ queryKey: ['items'], queryFn: getItems });
  const { data: suppliers = [] } = useQuery({ queryKey: ['suppliers'], queryFn: getSuppliers });
  
  const { data: revenue } = useQuery({ queryKey: ['revenue'], queryFn: getMonthlyRevenue });
  const { data: topCategory } = useQuery({ queryKey: ['topCategory'], queryFn: getWeeklyTopCategory });
  const { data: topItem } = useQuery({ queryKey: ['topItem'], queryFn: getDailyTopItem });
  const { data: margins } = useQuery({ queryKey: ['margins'], queryFn: getItemMargins });
  const { data: topSupplier } = useQuery({ queryKey: ['topSupplier'], queryFn: getMostProfitableSupplier });

  const lowStockItems = items.filter(item => item.stock < 5);

  return (
    <div className={`container ${styles.adminContainer}`}>
      <div className={styles.header}>
        <LayoutDashboard size={36} className={styles.headerIcon} />
        <h1>לוח בקרה וניהול</h1>
      </div>

      {/* Analytics Section */}
      <section className={styles.dashboardSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <BarChart2 size={24} className={styles.headerIcon} />
            סטטיסטיקות וביצועים
          </h2>
        </div>

        <div className={styles.analyticsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}><Package size={24} /></div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>סך כל המוצרים</div>
              <div className={styles.statValue}>{items.length}</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ color: 'var(--warning)' }}><ShoppingBag size={24} /></div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>מוצרים שעומדים לאזול</div>
              <div className={`${styles.statValue} ${styles.warningText}`}>{lowStockItems.length}</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ color: 'var(--success)' }}><DollarSign size={24} /></div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>הכנסות (30 ימים אחרונים)</div>
              <div className={styles.statValue}>₪{typeof revenue === 'number' ? revenue : (revenue?.revenue || 0)}</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}><TrendingUp size={24} /></div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>קטגוריה רווחית (7 ימים)</div>
              <div className={styles.statValue}>{topCategory?._id || topCategory?.category || '---'}</div>
              <div className={styles.statSubtext}>רווח: ₪{topCategory?.totalProfit || topCategory?.profit || 0}</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}><Trophy size={24} /></div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>מוצר רווחי (24 שעות)</div>
              <div className={styles.statValue}>{topItem?.name || topItem?._id || '---'}</div>
              <div className={styles.statSubtext}>רווח: ₪{topItem?.totalProfit || topItem?.profit || 0}</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}><Star size={24} /></div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>רווחיות (הכי גבוה/נמוך)</div>
              <div className={styles.statValue} style={{ fontSize: '1rem' }}>
                <span className={styles.successText}>↑ {margins?.highest?.name || '---'} ({margins?.highest?.margin || 0}%)</span><br/>
                <span className={styles.warningText}>↓ {margins?.lowest?.name || '---'} ({margins?.lowest?.margin || 0}%)</span>
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}><Users size={24} /></div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>הספק הרווחי ביותר</div>
              <div className={styles.statValue}>{topSupplier?.name || topSupplier?._id || '---'}</div>
              <div className={styles.statSubtext}>רווח: ₪{topSupplier?.totalProfit || topSupplier?.profit || 0}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Management */}
      <section className={styles.dashboardSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>ניהול מוצרים</h2>
          <button className="btn btn-primary">
            <Plus size={18} /> הוסף מוצר חדש
          </button>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>תמונה</th>
                <th>שם מוצר</th>
                <th>קטגוריה</th>
                <th>מחיר</th>
                <th>מלאי</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item._id}>
                  <td>
                    <img src={item.image || 'https://via.placeholder.com/40'} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>₪{item.consumerPrice || item.price || 0}</td>
                  <td className={item.stock < 5 ? styles.warningText : ''}>{item.stock}</td>
                  <td>
                    <div className={styles.actionCell}>
                      <button className="btn btn-icon btn-secondary"><Edit size={16} /></button>
                      <button className="btn btn-icon btn-danger"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>אין מוצרים במערכת</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Suppliers Management */}
      <section className={styles.dashboardSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>ניהול ספקים</h2>
          <button className="btn btn-primary">
            <Plus size={18} /> הוסף ספק חדש
          </button>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>שם ספק</th>
                <th>מספר מוצרים באספקה</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map(supplier => (
                <tr key={supplier._id}>
                  <td>{supplier.name}</td>
                  <td>{supplier.items?.length || 0}</td>
                  <td>
                    <div className={styles.actionCell}>
                      <button className="btn btn-icon btn-secondary"><Edit size={16} /></button>
                      <button className="btn btn-icon btn-danger"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {suppliers.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: '2rem' }}>אין ספקים במערכת</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};

export default Admin;
