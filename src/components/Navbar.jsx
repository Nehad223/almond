import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function Navbar({ categories, active, setActive }) {
  return (
    <nav className="gn-navbar">
      <Swiper slidesPerView="auto" spaceBetween={18} dir="RTL">
        {categories.map((cat, index) => (
          <SwiperSlide key={index} style={{ width: "auto" }}>
            <button
              className={`gn-nav-link ${active === index ? "active" : ""}`}
              onClick={() => setActive(index)}
            >
              {cat.name}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </nav>
  );
}
