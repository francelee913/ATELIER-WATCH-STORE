import React, { useState, useEffect, useMemo } from "react";
import { PRODUCTS, CATEGORIES, formatPrice } from "./product.js";
import { readStorage, writeStorage } from "./storage.js";
import "./App.css";

function Header({ page, setPage, cartCount, wishlistCount }) {
  return <>
    <div className="announcement">Complimentary delivery on orders over ₱8,000 · Designed to be kept</div>
    <header className="header">
      <button className="text-button" onClick={() => setPage("home")} aria-label="Go home">
        <span className="brand">ATELIER<small>TIME, CONSIDERED</small></span>
      </button>
      <nav className="nav" aria-label="Main navigation">
        <button onClick={() => setPage("home")}>Home</button>
        <button onClick={() => setPage("shop")}>Watches</button>
        <button onClick={() => setPage("story")}>Our Story</button>
      </nav>
      <div className="header-actions">
        <button onClick={() => setPage("wishlist")} aria-label="Wishlist">♡ <span className="count">{wishlistCount}</span></button>
        <button onClick={() => setPage("cart")} aria-label="Shopping bag">Bag <span className="count">{cartCount}</span></button>
      </div>
    </header>
  </>;
}

function ProductCard({ product, onOpen, isWishlisted, onWish }) {
  return <article className="product-card">
    <div className="product-image-wrap" onClick={() => onOpen(product.id)} role="button" tabIndex="0" onKeyDown={e => e.key === "Enter" && onOpen(product.id)}>
      <img src={product.image} alt={`${product.name} wristwatch`} loading="lazy" />
      <span className="product-tag">{product.tag}</span>
      <button className="wish-btn" aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"} onClick={e => { e.stopPropagation(); onWish(product.id); }}>{isWishlisted ? "♥" : "♡"}</button>
    </div>
    <div className="product-info">
      <div><h3>{product.name}</h3><p>{product.category} · {product.color}</p></div>
      <span className="product-price">{formatPrice(product.price)}</span>
    </div>
  </article>;
}

function Footer({ setPage }) {
  return <footer className="footer">
    <div className="footer-top">
      <div><div className="brand">ATELIER<small>TIME, CONSIDERED</small></div><p>Thoughtful timepieces, made for the moments that matter. A modern approach to timeless design.</p></div>
      <div><span className="eyebrow">Explore</span><p><a href="#shop" onClick={e => {e.preventDefault(); setPage("shop");}}>Shop watches</a><br/><a href="#story" onClick={e => {e.preventDefault(); setPage("story");}}>Our story</a></p></div>
      <div><span className="eyebrow">Client care</span><p>Shipping & returns<br/>Care guide<br/>Contact: hello@atelier.example</p></div>
    </div>
    <div className="footer-bottom"><span>© 2026 ATELIER WATCH CO.</span><span>CRAFTED WITH INTENTION.</span></div>
  </footer>;
}

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedId, setSelectedId] = useState(1);
  const [cart, setCart] = useState(() => readStorage("atelier-cart", []));
  const [wishlist, setWishlist] = useState(() => readStorage("atelier-wishlist", []));
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ name: "", email: "", address: "", city: "", postal: "" });
  const [errors, setErrors] = useState({});
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => { writeStorage("atelier-cart", cart); }, [cart]);
  useEffect(() => { writeStorage("atelier-wishlist", wishlist); }, [wishlist]);

  const selected = PRODUCTS.find(p => p.id === selectedId) || PRODUCTS[0];
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal === 0 || subtotal >= 8000 ? 0 : 250;

  const visibleProducts = useMemo(() => {
    let result = PRODUCTS.filter(p => (category === "All" || p.category === category) &&
      `${p.name} ${p.category} ${p.color}`.toLowerCase().includes(search.toLowerCase()));
    if (sort === "low") result.sort((a,b) => a.price - b.price);
    if (sort === "high") result.sort((a,b) => b.price - a.price);
    if (sort === "name") result.sort((a,b) => a.name.localeCompare(b.name));
    return result;
  }, [category, search, sort]);

  function notify(message) {
    setToast(message);
    window.clearTimeout(notify.timer);
    notify.timer = window.setTimeout(() => setToast(""), 2400);
  }
  function openProduct(id) { setSelectedId(id); setPage("product"); window.scrollTo(0,0); }
  function addToCart(id) {
    const product = PRODUCTS.find(p => p.id === id);
    setCart(current => {
      const existing = current.find(item => item.id === id);
      return existing ? current.map(item => item.id === id ? {...item, qty: item.qty + 1} : item) : [...current, {...product, qty: 1}];
    });
    notify(`${product.name} added to your bag`);
  }
  function changeQty(id, amount) {
    setCart(current => current.map(item => item.id === id ? {...item, qty: item.qty + amount} : item).filter(item => item.qty > 0));
  }
  function toggleWish(id) {
    setWishlist(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id]);
    notify(wishlist.includes(id) ? "Removed from wishlist" : "Saved to wishlist");
  }
  function goShop() { setPage("shop"); window.scrollTo(0,0); }

  function submitCheckout(e) {
    e.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (form.address.trim().length < 5) next.address = "Please enter a complete street address.";
    if (form.city.trim().length < 2) next.city = "Please enter your city.";
    if (!/^[0-9A-Za-z -]{3,10}$/.test(form.postal)) next.postal = "Enter a valid postal code.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setOrderNumber(`ATL-${Math.floor(100000 + Math.random() * 900000)}`);
    setCart([]);
    setPage("success");
    window.scrollTo(0,0);
  }

  return <div className="app-shell">
    <Header page={page} setPage={setPage} cartCount={cartCount} wishlistCount={wishlist.length} />

    {page === "home" && <>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">The art of keeping time</span>
            <h1>Every second,<br/>well considered.</h1>
            <p>Meet a collection of thoughtfully designed timepieces. Quiet confidence, lasting materials, and details worth noticing.</p>
            <button className="primary-btn" onClick={goShop}>Discover the collection</button>
          </div>
          <div className="hero-image"><img src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1400&q=90" alt="Elegant wristwatch in a refined studio setting" fetchPriority="high"/></div>
        </section>
        <section className="section">
          <div className="section-heading"><div><span className="eyebrow">A considered collection</span><h2>Made to move with you.</h2></div><button className="text-button" onClick={goShop}>View all watches →</button></div>
          <div className="product-grid">{PRODUCTS.slice(0,3).map(p => <ProductCard key={p.id} product={p} onOpen={openProduct} isWishlisted={wishlist.includes(p.id)} onWish={toggleWish}/>)}</div>
        </section>
        <section className="story-band"><span className="eyebrow">Less, but better</span><h2>Not just something you wear. Something you keep.</h2><p>We believe the best design earns its place in your everyday. Each ATELIER timepiece balances considered proportions, reliable movement, and enduring materials.</p></section>
      </main>
    </>}

    {page === "story" && <main className="page-wrap"><span className="eyebrow">Our philosophy</span><h1 className="page-title">Time, considered.</h1><p className="detail-description">ATELIER began with a simple idea: an everyday watch should feel personal, purposeful, and made to last. We focus on balanced proportions, useful details, and materials that age beautifully. Our collection is designed to move between the ordinary and the unforgettable.</p><div style={{marginTop:32}}><button className="primary-btn" onClick={goShop}>Explore the collection</button></div></main>}

    {page === "shop" && <main>
      <section className="shop-top"><span className="eyebrow">The collection</span><h1 className="page-title">Find your timepiece.</h1><p className="detail-description">Six considered designs. One for every way you move through the day.</p>
        <div className="shop-toolbar"><div className="filters">{CATEGORIES.map(c => <button key={c} className={`filter-btn ${category === c ? "active" : ""}`} onClick={() => setCategory(c)}>{c}</button>)}</div>
          <div className="search-sort"><input aria-label="Search watches" placeholder="Search watches..." value={search} onChange={e => setSearch(e.target.value)}/><select aria-label="Sort watches" value={sort} onChange={e => setSort(e.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="name">Name</option></select></div>
        </div>
      </section>
      <section className="shop-content"><div className="product-grid">{visibleProducts.map(p => <ProductCard key={p.id} product={p} onOpen={openProduct} isWishlisted={wishlist.includes(p.id)} onWish={toggleWish}/>)}</div>{visibleProducts.length === 0 && <div className="empty-state"><h2>No watches found</h2><p>Try another search or category.</p><button className="secondary-btn" onClick={() => {setSearch("");setCategory("All");}}>Clear filters</button></div>}</section>
    </main>}

    {page === "product" && <main className="detail-layout">
      <div className="detail-image"><img src={selected.image} alt={`${selected.name} watch`} /></div>
      <div className="detail-copy"><span className="eyebrow">{selected.tag} · {selected.category}</span><h1>{selected.name}</h1><div className="detail-price">{formatPrice(selected.price)}</div><p className="detail-description">{selected.description}</p>
        <div className="spec-list">{[["Movement",selected.movement],["Case",selected.case],["Strap",selected.strap],["Water resistance",selected.water]].map(([k,v])=><div className="spec-row" key={k}><span>{k}</span><strong>{v}</strong></div>)}</div>
        <div className="detail-actions"><button className="primary-btn" onClick={() => addToCart(selected.id)}>Add to bag</button><button className="secondary-btn" onClick={() => toggleWish(selected.id)}>{wishlist.includes(selected.id) ? "♥ Saved" : "♡ Save to wishlist"}</button></div>
        <p style={{fontSize:11,color:"var(--muted)",marginTop:20}}>Complimentary delivery on orders over ₱8,000.</p>
      </div>
    </main>}

    {page === "wishlist" && <main className="page-wrap"><span className="eyebrow">Your saved pieces</span><h1 className="page-title">Wishlist</h1>{wishlist.length ? <div className="product-grid">{PRODUCTS.filter(p => wishlist.includes(p.id)).map(p=><ProductCard key={p.id} product={p} onOpen={openProduct} isWishlisted onWish={toggleWish}/>)}</div> : <div className="empty-state"><h2>Nothing saved just yet.</h2><p>Keep the pieces that catch your eye.</p><button className="primary-btn" onClick={goShop}>Explore watches</button></div>}</main>}

    {page === "cart" && <main className="page-wrap"><span className="eyebrow">Your selection</span><h1 className="page-title">Shopping bag</h1>{cart.length ? <div className="cart-layout"><div>{cart.map(item=><div className="cart-item" key={item.id}><img src={item.image} alt={item.name}/><div><h3>{item.name}</h3><p>{item.category} · {formatPrice(item.price)}</p><div className="quantity"><button onClick={()=>changeQty(item.id,-1)} aria-label="Decrease quantity">−</button><span>{item.qty}</span><button onClick={()=>changeQty(item.id,1)} aria-label="Increase quantity">+</button><button className="text-button" onClick={()=>changeQty(item.id,-item.qty)}>Remove</button></div></div><strong>{formatPrice(item.price*item.qty)}</strong></div>)}</div><aside className="summary"><h3>Order summary</h3><div className="summary-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div><div className="summary-row"><span>Delivery</span><span>{shipping===0?"Complimentary":formatPrice(shipping)}</span></div><div className="summary-row summary-total"><span>Total</span><span>{formatPrice(subtotal+shipping)}</span></div><button className="primary-btn" onClick={()=>setPage("checkout")}>Continue to checkout</button></aside></div> : <div className="empty-state"><h2>Your bag is taking a little break.</h2><p>Find a timepiece worth keeping.</p><button className="primary-btn" onClick={goShop}>Shop watches</button></div>}</main>}

    {page === "checkout" && <main className="page-wrap"><span className="eyebrow">Almost yours</span><h1 className="page-title">Checkout</h1>{cart.length ? <div className="checkout-grid"><form onSubmit={submitCheckout} noValidate><div className="form-grid">
      {[["name","Full name","text"],["email","Email address","email"],["address","Street address","text"],["city","City","text"],["postal","Postal code","text"]].map(([key,label,type])=><div className={`field ${key==="address"?"full":""}`} key={key}><label htmlFor={key}>{label}</label><input id={key} type={type} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} aria-invalid={!!errors[key]} />{errors[key]&&<span className="error">{errors[key]}</span>}</div>)}
      </div><button className="primary-btn" type="submit">Place order · {formatPrice(subtotal+shipping)}</button><p style={{fontSize:10,color:"var(--muted)"}}>Demo checkout only. No payment will be collected.</p></form><aside className="summary"><h3>Your order</h3>{cart.map(item=><div className="summary-row" key={item.id}><span>{item.name} × {item.qty}</span><span>{formatPrice(item.price*item.qty)}</span></div>)}<div className="summary-row"><span>Delivery</span><span>{shipping===0?"Free":formatPrice(shipping)}</span></div><div className="summary-row summary-total"><span>Total</span><span>{formatPrice(subtotal+shipping)}</span></div></aside></div> : <div className="empty-state"><p>Your bag is empty.</p><button className="primary-btn" onClick={goShop}>Shop watches</button></div>}</main>}

    {page === "success" && <main className="page-wrap"><div className="success-panel"><div className="success-mark">✓</div><span className="eyebrow">Order confirmed</span><h1>Thank you.</h1><p>Your order <strong>{orderNumber}</strong> has been placed in this demo store.</p><p style={{color:"var(--muted)",fontSize:12}}>A confirmation would be sent to your email in a live store.</p><button className="primary-btn" onClick={goShop}>Continue exploring</button></div></main>}

    <Footer setPage={setPage}/>
    {toast && <div className="toast" role="status">{toast}</div>}
  </div>;
}
