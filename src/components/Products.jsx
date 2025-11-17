import React, { useEffect, useState, useMemo } from "react";
import ProductCard from "./ProductCard";

const API = "https://6905b069ee3d0d14c13361c0.mockapi.io/productsss";

function parsePrice(priceStr) {
  if (!priceStr) return 0;
  const digits = priceStr.replace(/[^0-9]/g, "");
  const num = parseInt(digits || "0", 10);
  return isNaN(num) ? 0 : num;
}

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [colorFilter, setColorFilter] = useState("");
  const [search, setSearch] = useState("");

  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(0);
  const [selectedMin, setSelectedMin] = useState(0);
  const [selectedMax, setSelectedMax] = useState(0);
  const [expandedCategory, setExpandedCategory] = useState("all");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);

  const brands = ["Беймакс", "DEME", "DEMARK", "Kojima", "Naris", "Jadore"];
  const countries = [
    "Австралия",
    "Англия",
    "Беларусь",
    "Болгария Германия",
    "Бразилия",
    "Вьетнам",
  ];

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleCountry = (country) => {
    setSelectedCountries((prev) =>
      prev.includes(country)
        ? prev.filter((c) => c !== country)
        : [...prev, country]
    );
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(API)
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        const withPrice = data.map((p) => {
          const brandList = [
            "Беймакс",
            "DEME",
            "DEMARK",
            "Kojima",
            "Naris",
            "Jadore",
          ];
          const countryList = [
            "Австралия",
            "Англия",
            "Беларусь",
            "Болгария Германия",
            "Бразилия",
            "Вьетнам",
          ];

          return {
            ...p,
            title: p.name || p.title,
            img: p.image || p.img,
            price: p.price
              ? `${Math.round((parseInt(p.price) / 1000) * 10) / 10} сум/мес`
              : "0",
            rating: p.rating || 4.5,
            reviews: p.reviewCount || 0,
            priceValue: parsePrice(p.price),
            brand: p.brand || brandList[parseInt(p.id) % brandList.length],
            country:
              p.country || countryList[parseInt(p.id) % countryList.length],
          };
        });
        setProducts(withPrice);
        const vals = withPrice.map((p) => p.priceValue || 0);
        const minV = vals.length ? Math.min(...vals) : 0;
        const maxV = vals.length ? Math.max(...vals) : 0;
        setPriceMin(minV);
        setPriceMax(maxV);
        setSelectedMin(minV);
        setSelectedMax(maxV);
        setLoading(false);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e.message || "Error");
        setLoading(false);
      });
    return () => (mounted = false);
  }, []);

  const colors = useMemo(() => {
    const set = new Set();
    products.forEach((p) => p.color && set.add(p.color));
    return Array.from(set);
  }, [products]);

  const filtered = products.filter((p) => {
    if (colorFilter && p.color !== colorFilter) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()))
      return false;
    const val = p.priceValue || 0;
    if (val < selectedMin) return false;
    if (val > selectedMax) return false;
    if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand))
      return false;
    if (selectedCountries.length > 0 && !selectedCountries.includes(p.country))
      return false;
    return true;
  });

  return (
    <div className="pm-container">
      <aside className="pm-sidebar">
        <div className="pm-sidebar-block">
          <h4>Категории</h4>
          <ul>
            <li
              onClick={() => setExpandedCategory("all")}
              className={expandedCategory === "all" ? "active" : ""}
            >
              ◀ Все категории
            </li>
            <li>Бытовая техника</li>
            <li>Климатическая техника</li>
            <li>Крупная бытовая техника</li>
            <li>Прочие аксессуары и запчасти для бытовой техники</li>
            <li>Техника для дома</li>
            <li>Техника для красоты</li>
            <li>Техника для кухни</li>
          </ul>
          <div
            style={{
              fontSize: "11px",
              color: "#999",
              marginTop: "8px",
              cursor: "pointer",
            }}
          >
            Еще 16
          </div>
        </div>
        <div className="pm-sidebar-block">
          <h4>Цена, сум</h4>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input
              type="number"
              className="pm-input"
              placeholder="от"
              value={selectedMin}
              min={priceMin}
              max={selectedMax}
              onChange={(e) =>
                setSelectedMin(Math.min(Number(e.target.value), selectedMax))
              }
            />
            <input
              type="number"
              className="pm-input"
              placeholder="до"
              value={selectedMax}
              min={selectedMin}
              max={priceMax}
              onChange={(e) =>
                setSelectedMax(Math.max(Number(e.target.value), selectedMin))
              }
            />
          </div>
          <div className="pm-range-sliders">
            <input
              type="range"
              className="pm-input pm-input-min"
              min={priceMin}
              max={priceMax}
              value={selectedMin}
              onChange={(e) =>
                setSelectedMin(Math.min(Number(e.target.value), selectedMax))
              }
            />
            <input
              type="range"
              className="pm-input pm-input-max"
              min={priceMin}
              max={priceMax}
              value={selectedMax}
              onChange={(e) =>
                setSelectedMax(Math.max(Number(e.target.value), selectedMin))
              }
            />
          </div>
        </div>
        <div className="pm-sidebar-block">
          <h4>Цвет</h4>
          <div className="pm-colors">
            {colors.map((c) => (
              <button
                key={c}
                className={`pm-swatch ${colorFilter === c ? "active" : ""}`}
                style={{ background: c }}
                onClick={() => setColorFilter(colorFilter === c ? "" : c)}
                title={c}
              />
            ))}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "#999",
              marginTop: "8px",
              cursor: "pointer",
            }}
          >
            Еще 18
          </div>
        </div>
        <div className="pm-sidebar-block">
          <h4>Бренд</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {brands.map((brand) => (
              <label
                key={brand}
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  style={{
                    marginRight: 8,
                    width: 16,
                    height: 16,
                    cursor: "pointer",
                  }}
                />
                {brand}
              </label>
            ))}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "#999",
              marginTop: "8px",
              cursor: "pointer",
            }}
          >
            Еще 450
          </div>
        </div>
        <div className="pm-sidebar-block">
          <h4>Страна производства</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {countries.map((country) => (
              <label
                key={country}
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedCountries.includes(country)}
                  onChange={() => toggleCountry(country)}
                  style={{
                    marginRight: 8,
                    width: 16,
                    height: 16,
                    cursor: "pointer",
                  }}
                />
                {country}
              </label>
            ))}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "#999",
              marginTop: "8px",
              cursor: "pointer",
            }}
          >
            Еще 39
          </div>
        </div>
      </aside>

      <main className="pm-main">
        {loading && <div className="pm-loading">Загрузка...</div>}
        {error && <div className="pm-error">Ошибка: {error}</div>}

        <div className="pm-grid">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Products;
