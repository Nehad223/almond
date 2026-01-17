import React from 'react';

const Delivery_To_Home = () => {
  return (
    <a className='store' role="button" href="https://almondsnack.duckdns.org/"  target='_blank' >
      <div className='store-inner'>
        <img src='/pngegg.avif' alt="cart"   fetchPriority="high"   />
        <span aria-live="polite">توصيل الى المنزل</span>  
      </div>
    </a>
  );
}

export default Delivery_To_Home;


