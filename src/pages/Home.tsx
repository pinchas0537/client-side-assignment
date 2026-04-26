import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, PackageX } from 'lucide-react';
import { toast } from 'react-toastify';
import { getItems } from '../api/items';
import { useAppDispatch } from '../redux/hooks';
import { addToCart } from '../redux/cartSlice';
import type { Item } from '../types';
import styles from './Home.module.css';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ['items'],
    queryFn: getItems,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [supplier, setSupplier] = useState('');
  const [sortBy, setSortBy] = useState('nameAsc');

  // Listen to search changes from Navbar
  useEffect(() => {
    const handleSearch = (e: any) => setSearchQuery(e.detail);
    window.addEventListener('search-change', handleSearch);
    return () => window.removeEventListener('search-change', handleSearch);
  }, []);

  const categories = useMemo(() => Array.from(new Set(items.map(i => i.category))), [items]);
  const suppliers = useMemo(() => Array.from(new Set(items.map(i => typeof i.supplier === 'object' ? i.supplier.name : i.supplier))), [items]);

  const filteredItems = useMemo(() => {
    return items
      .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter(item => category ? item.category === category : true)
      .filter(item => supplier ? (typeof item.supplier === 'object' ? item.supplier.name === supplier : item.supplier === supplier) : true)
      .sort((a, b) => {
        if (sortBy === 'priceAsc') return a.price - b.price;
        if (sortBy === 'priceDesc') return b.price - a.price;
        if (sortBy === 'nameAsc') return a.name.localeCompare(b.name, 'he');
        if (sortBy === 'nameDesc') return b.name.localeCompare(a.name, 'he');
        return 0;
      });
  }, [items, searchQuery, category, supplier, sortBy]);

  const handleAddToCart = (item: Item) => {
    if (item.stock > 0) {
      dispatch(addToCart({ item, quantity: 1 }));
      toast.success('המוצר נוסף לעגלה!');
    } else {
      toast.error('המוצר אזל מהמלאי');
    }
  };

  if (isLoading) return <div className="loader-container"><div className="spinner"></div></div>;

  if (isError) {
    return (
      <div className="container">
        <div className={`glass ${styles.emptyState}`}>
          <PackageX size={48} className={styles.emptyIcon} />
          <h2>אופס! שגיאה בטעינת המוצרים</h2>
          <p>אנא ודא שהשרת פועל בכתובת localhost:3000</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`container ${styles.homeContainer}`}>
      <aside className={`glass ${styles.filtersSidebar}`}>
        <div className={styles.filterSection}>
          <h3>סינון לפי קטגוריה</h3>
          <select className={styles.select} value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">הכל</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className={styles.filterSection}>
          <h3>סינון לפי ספק</h3>
          <select className={styles.select} value={supplier} onChange={(e) => setSupplier(e.target.value)}>
            <option value="">הכל</option>
            {suppliers.map(s => <option key={s as string} value={s as string}>{s}</option>)}
          </select>
        </div>

        <div className={styles.filterSection}>
          <h3>מיון</h3>
          <select className={styles.select} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="nameAsc">שם (א-ת)</option>
            <option value="nameDesc">שם (ת-א)</option>
            <option value="priceAsc">מחיר (נמוך לגבוה)</option>
            <option value="priceDesc">מחיר (גבוה לנמוך)</option>
          </select>
        </div>
      </aside>

      <div className={styles.productsGrid}>
        {filteredItems.length === 0 ? (
          <div className={styles.emptyState}>
            <PackageX size={48} className={styles.emptyIcon} />
            <h2>לא נמצאו מוצרים תואמים</h2>
          </div>
        ) : (
          filteredItems.map(item => (
            <div key={item._id} className={`glass ${styles.card}`}>
              <div className={styles.cardImageWrapper}>
                <span className={styles.categoryBadge}>{item.category}</span>
                <img src={item.image || 'https://via.placeholder.com/300?text=No+Image'} alt={item.name} className={styles.cardImage} />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{item.name}</h3>
                <p className={styles.cardDescription}>{item.description}</p>
                <div className={styles.cardFooter}>
                  <span className={styles.price}>₪{item.price}</span>
                  <div className={styles.cardActions}>
                    <Link to={`/product/${item._id}`} className="btn btn-secondary btn-icon" title="צפייה בפרטים">
                      <Eye size={20} />
                    </Link>
                    <button 
                      className="btn btn-primary btn-icon" 
                      onClick={() => handleAddToCart(item)}
                      disabled={item.stock === 0}
                      title={item.stock === 0 ? "אזל מהמלאי" : "הוסף לעגלה"}
                    >
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
