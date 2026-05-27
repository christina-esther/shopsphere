import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  HiOutlineUsers, HiOutlineShoppingBag, HiOutlineClipboardList,
  HiOutlineCurrencyRupee, HiArrowUp, HiArrowDown, HiOutlineStar,
} from "react-icons/hi";
import api from "../../services/api";

const STATUS_COLORS = {
  pending: "#f59e0b", processing: "#3b82f6", shipped: "#8b5cf6",
  delivered: "#10b981", cancelled: "#ef4444", refunded: "#6b7280",
};

const PIE_COLORS = ["#f59e0b", "#3b82f6", "#8b5cf6", "#10b981", "#ef4444", "#6b7280"];

function StatCard({ icon: Icon, label, value, sub, trend, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white dark:bg-dark-700 rounded-2xl p-5 border border-gray-100 dark:border-dark-600 shadow-card dark:shadow-card-dark"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full
            ${trend >= 0 ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"}`}>
            {trend >= 0 ? <HiArrowUp className="w-3 h-3" /> : <HiArrowDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-black text-gray-900 dark:text-white mb-0.5">{value}</p>
      <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-dark-700 rounded-xl px-4 py-3 shadow-xl border border-gray-100 dark:border-dark-600 text-sm">
      <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.name === "revenue" ? `₹${p.value.toLocaleString()}` : p.value}
        </p>
      ))}
    </div>
  );
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/dashboard")
      .then(({ data }) => { setData(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 skeleton rounded-2xl" />)}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 skeleton rounded-2xl" />
          <div className="h-72 skeleton rounded-2xl" />
        </div>
      </div>
    );
  }

  const { stats, recentOrders, topProducts, ordersByStatus, revenueChart } = data || {};

  const pieData = ordersByStatus?.map((s) => ({
    name: s._id,
    value: s.count,
  })) || [];

  return (
    <div className="space-y-6 max-w-screen-xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={HiOutlineCurrencyRupee} label="Total Revenue"
          value={`₹${((stats?.totalRevenue || 0) / 1000).toFixed(1)}K`}
          sub={`₹${((stats?.monthRevenue || 0) / 1000).toFixed(1)}K this month`}
          trend={Number(stats?.revenueGrowth)} delay={0}
          color="bg-primary-100 dark:bg-primary-900/30 text-primary-600"
        />
        <StatCard
          icon={HiOutlineClipboardList} label="Total Orders"
          value={stats?.totalOrders?.toLocaleString() || "0"}
          sub={`${stats?.monthOrders || 0} this month`}
          delay={0.05}
          color="bg-blue-100 dark:bg-blue-900/30 text-blue-600"
        />
        <StatCard
          icon={HiOutlineUsers} label="Total Users"
          value={stats?.totalUsers?.toLocaleString() || "0"}
          sub={`${stats?.monthUsers || 0} new this month`}
          delay={0.1}
          color="bg-purple-100 dark:bg-purple-900/30 text-purple-600"
        />
        <StatCard
          icon={HiOutlineShoppingBag} label="Products"
          value={stats?.totalProducts?.toLocaleString() || "0"}
          sub="Active listings"
          delay={0.15}
          color="bg-amber-100 dark:bg-amber-900/30 text-amber-600"
        />
      </div>

      {/* Revenue Chart + Order Status */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Area chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white dark:bg-dark-700 rounded-2xl p-5 border border-gray-100 dark:border-dark-600 shadow-card dark:shadow-card-dark"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Revenue Overview</h3>
              <p className="text-xs text-gray-400">Monthly revenue for {new Date().getFullYear()}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-green-600 dark:text-green-400">
              <HiArrowUp className="w-3.5 h-3.5" />
              {stats?.revenueGrowth}% vs last month
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueChart || []}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6b5fff" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6b5fff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(107,95,255,0.06)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="revenue" stroke="#6b5fff"
                strokeWidth={2.5} fill="url(#colorRevenue)" dot={false} activeDot={{ r: 5, fill: "#6b5fff" }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white dark:bg-dark-700 rounded-2xl p-5 border border-gray-100 dark:border-dark-600 shadow-card dark:shadow-card-dark"
        >
          <h3 className="font-bold text-gray-900 dark:text-white mb-1">Orders by Status</h3>
          <p className="text-xs text-gray-400 mb-4">Distribution overview</p>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                  paddingAngle={3} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={STATUS_COLORS[entry.name] || PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-44 flex items-center justify-center text-gray-400 text-sm">No order data</div>
          )}
          <div className="space-y-1.5 mt-2">
            {pieData.slice(0, 4).map((s, i) => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: STATUS_COLORS[s.name] || PIE_COLORS[i] }} />
                  <span className="capitalize text-gray-500 dark:text-gray-400">{s.name}</span>
                </div>
                <span className="font-bold text-gray-700 dark:text-gray-300">{s.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Monthly bar chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-white dark:bg-dark-700 rounded-2xl p-5 border border-gray-100 dark:border-dark-600 shadow-card dark:shadow-card-dark"
      >
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Orders Per Month</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={revenueChart || []} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(107,95,255,0.06)" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="orders" name="orders" fill="#6b5fff" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Orders + Top Products */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-white dark:bg-dark-700 rounded-2xl p-5 border border-gray-100 dark:border-dark-600 shadow-card dark:shadow-card-dark"
        >
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recent Orders</h3>
          {recentOrders?.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order._id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-dark-600">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {order.user?.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{order.user?.name}</p>
                    <p className="text-xs text-gray-400">#{order._id.slice(-6).toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">₹{order.totalPrice?.toLocaleString()}</p>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full capitalize
                      ${order.orderStatus === "delivered" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                        order.orderStatus === "pending" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-8">No orders yet</p>
          )}
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white dark:bg-dark-700 rounded-2xl p-5 border border-gray-100 dark:border-dark-600 shadow-card dark:shadow-card-dark"
        >
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Top Products</h3>
          {topProducts?.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((product, i) => (
                <div key={product._id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-dark-600">
                  <span className="text-sm font-black text-gray-400 w-5 flex-shrink-0">#{i + 1}</span>
                  <img src={product.images?.[0]?.url} alt={product.name}
                    className="w-10 h-10 object-cover rounded-xl flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{product.name}</p>
                    <div className="flex items-center gap-1 text-xs text-amber-500">
                      <HiOutlineStar className="w-3 h-3 fill-current" />
                      {product.ratings?.toFixed(1)}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary-600">₹{product.price?.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">{product.sold} sold</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-8">No product data</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
