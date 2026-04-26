import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { removeFromCart, updateQuantity, clearCart, addToCart } from '../redux/cartSlice';
import { getItems } from '../api/items';
import styles from './Cart.module.css';

const Cart: React.FC = () => {
  const { cartItems, totalPrice } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  const { data: allItems = [] } = useQuery({
    queryKey: ['items'],
    queryFn: getItems,
  });

  const recommendations = useMemo(() => {
    if (cartItems.length === 0 || allItems.length === 0) return [];
    
    const cartCategorySet = new Set(cartItems.map(i => i.category));
    const cartIds = new Set(cartItems.map(i => i._id));
    
    // Find items in same categories, not already in cart
    const candidates = allItems.filter(
      item => cartCategorySet.has(item.category) && !cartIds.has(item._id) && item.stock > 0
    );

    // If not enough candidates from same categories, fallback to other items
    if (candidates.length < 4) {
      const otherCandidates = allItems.filter(item => !cartIds.has(item._id) && item.stock > 0);
      candidates.push(...otherCandidates);
    }
    
    // Shuffle and pick top 4
    return candidates.sort(() => 0.5 - Math.random()).slice(0, 4);
  }, [cartItems, allItems]);

  if (cartItems.length === 0) {
    return (
      <div className={`container ${styles.emptyContainer}`}>
        <div className={`glass ${styles.emptyCart}`}>
          <ShoppingBag size={64} className={styles.emptyIcon} />
          <h2>העגלה שלך ריקה</h2>
          <p>נראה שטרם הוספת מוצרים לעגלה.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '2rem' }}>
            <ArrowLeft size={20} />
            חזרה לחנות
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`container ${styles.cartContainer}`}>
      <div className={styles.mainCart}>
        <div className={styles.cartHeader}>
          <h1>עגלת קניות</h1>
          <button className="btn btn-danger" onClick={() => dispatch(clearCart())}>
            <Trash2 size={16} />
            נקה עגלה
          </button>
        </div>

        <div className={`glass ${styles.cartList}`}>
          {cartItems.map(item => (
            <div key={item._id} className={styles.cartItem}>
              <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} className={styles.itemImage} />
              
              <div className={styles.itemDetails}>
                <Link to={`/product/${item._id}`} className={styles.itemName}>{item.name}</Link>
                <div className={styles.itemCategory}>{item.category}</div>
              </div>

              <div className={styles.itemPrice}>
                ₪{item.price}
              </div>

              <div className={styles.quantityControl}>
                <button 
                  className="btn btn-icon btn-secondary" 
                  onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.cartQuantity - 1 }))}
                >
                  <Minus size={14} />
                </button>
                <span className={styles.quantityDisplay}>{item.cartQuantity}</span>
                <button 
                  className="btn btn-icon btn-secondary" 
                  onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.cartQuantity + 1 }))}
                  disabled={item.cartQuantity >= item.stock}
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className={styles.itemTotal}>
                ₪{(item.price * item.cartQuantity).toFixed(2)}
              </div>

              <button 
                className={`btn btn-icon ${styles.removeBtn}`}
                onClick={() => dispatch(removeFromCart(item._id))}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {recommendations.length > 0 && (
          <div className={styles.recommendationsSection}>
            <h3>אולי תאהב גם...</h3>
            <div className={styles.recommendationsGrid}>
              {recommendations.map(item => (
                <div key={item._id} className={`glass ${styles.recCard}`}>
                  <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} className={styles.recImage} />
                  <div className={styles.recContent}>
                    <h4 className={styles.recTitle}>{item.name}</h4>
                    <span className={styles.recPrice}>₪{item.price}</span>
                    <button 
                      className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '0.5rem' }}
                      onClick={() => dispatch(addToCart({ item, quantity: 1 }))}
                    >
                      הוסף לעגלה
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={`glass ${styles.summarySidebar}`}>
        <h2>סיכום הזמנה</h2>
        
        <div className={styles.summaryRow}>
          <span>פריטים ({cartItems.reduce((acc, i) => acc + i.cartQuantity, 0)}):</span>
          <span>₪{totalPrice.toFixed(2)}</span>
        </div>
        
        <div className={styles.summaryRow}>
          <span>דמי משלוח:</span>
          <span>חינם</span>
        </div>
        
        <div className={`${styles.summaryRow} ${styles.totalRow}`}>
          <span>סך הכל:</span>
          <span className={styles.totalPrice}>₪{totalPrice.toFixed(2)}</span>
        </div>
        
        <button className={`btn btn-primary ${styles.checkoutBtn}`}>
          מעבר לתשלום
        </button>
      </div>
    </div>
  );
};

export default Cart;
