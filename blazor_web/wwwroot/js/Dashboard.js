function groupBy(map, key, value) {
  map[key] = (map[key] || 0) + value;
}
function formatDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
}

function monthKey(d) {
  return `${d.getFullYear()}-${d.getMonth()}`; // 2025-11
}

window.dashboard = {
  /* ===================== REVENUE ===================== */
  renderRevenueChart(period, values) {
    if (window.revenueChartInstance) {
      window.revenueChartInstance.destroy();
    }

    let fullDates = [];

    const ctx = document.getElementById("revenueChart");
    if (!ctx) return;

    const now = new Date();
    let labels = [];
    let data = [];

    /* ===== 7D / 28D (theo ngày) ===== */
    if (period === "7d" || period === "28d") {
      const dayMap = {};
      values.forEach((v) => groupBy(dayMap, v.time, v.amount));
      console.log("Day map:", dayMap);

      const range = period === "7d" ? 6 : 27;

      for (let i = range; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        const key = formatDate(d);

        labels.push(
          period === "28d" && i % 7 !== 0
            ? ""
            : d.toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
              })
        );

        data.push(dayMap[key] ?? 0);
        fullDates.push(key);
        console.log("Key:", key, "Amount:", dayMap[key] ?? 0);
      }
    } else if (period === "90d") {
      /* ===== 90D (gom theo tháng) ===== */
      const monthMap = {};
      values.forEach((v) =>
        groupBy(monthMap, monthKey(new Date(v.time)), v.amount)
      );

      for (let i = 2; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = monthKey(d);

        labels.push(d.toLocaleString("en-US", { month: "short" }));
        data.push(monthMap[key] ?? 0);
        fullDates.push(key);
      }
    } else if (period === "year") {
      /* ===== YEAR (12 tháng) ===== */
      const yearMap = {};
      values.forEach((v) =>
        groupBy(yearMap, new Date(v.time).getMonth(), v.amount)
      );

      for (let m = 0; m < 12; m++) {
        labels.push(
          new Date(now.getFullYear(), m, 1).toLocaleString("en-US", {
            month: "short",
          })
        );
        data.push(yearMap[m] ?? 0);
        fullDates.push(`${now.getFullYear()}-${m}`);
      }
    }

    window.revenueChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Doanh thu",
            data,
            borderWidth: 2,
            tension: 0.35,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } },
        plugins: {
          tooltip: {
            callbacks: {
              title: (items) => {
                const index = items[0].dataIndex;
                const iso = fullDates[index];
                return new Date(iso).toLocaleDateString("vi-VN", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                });
              },
            },
          },
        },
      },
    });
  },

  /* ===================== ORDERS ===================== */
  renderOrdersChart(period, values) {
    if (window.ordersChartInstance) {
      window.ordersChartInstance.destroy();
    }
    console.log("Rendering orders chart for period:", period, values);
    const ctx = document.getElementById("ordersChart");
    if (!ctx) return;

    const now = new Date();
    let labels = [];
    let data = [];
    let fullDates = [];

    /* ===== 7D / 28D ===== */
    if (period === "7d" || period === "28d") {
      const dayMap = {};
      values.forEach((v) => groupBy(dayMap, v.time, v.count));

      const range = period === "7d" ? 6 : 27;

      for (let i = range; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        const key = formatDate(d);

        labels.push(
          period === "28d" && i % 7 !== 0
            ? ""
            : d.toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
              })
        );

        data.push(dayMap[key] ?? 0);
        fullDates.push(key);
      }
    } else if (period === "90d") {
      /* ===== 90D ===== */
      const monthMap = {};
      values.forEach((v) =>
        groupBy(monthMap, monthKey(new Date(v.time)), v.count)
      );

      for (let i = 2; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = monthKey(d);

        labels.push(d.toLocaleString("en-US", { month: "short" }));
        data.push(monthMap[key] ?? 0);
      }
    } else if (period === "year") {
      /* ===== YEAR ===== */
      const yearMap = {};
      values.forEach((v) =>
        groupBy(yearMap, new Date(v.time).getMonth(), v.count)
      );

      for (let m = 0; m < 12; m++) {
        labels.push(
          new Date(now.getFullYear(), m, 1).toLocaleString("en-US", {
            month: "short",
          })
        );
        data.push(yearMap[m] ?? 0);
      }
    }

    window.ordersChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Đơn hàng",
            data,
          },
        ],
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } },
        plugins: {
          tooltip: {
            callbacks: {
              title: (items) => {
                const index = items[0].dataIndex;
                const iso = fullDates[index];
                return new Date(iso).toLocaleDateString("vi-VN", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                });
              },
            },
          },
        },
      },
    });
  },
};
