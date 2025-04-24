import { Layout } from "@/Layouts/Layout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { ChartAreaInteractive } from "../Components/ui/chart-area-interactive";
import {
  ArrowUp,
  ArrowDown,
  Users,
  DollarSign,
  ShoppingBag,
  Activity,
  User,
  Server,
  Cpu,
  HardDrive
} from "lucide-react";

const data = [
  { month: 'Jan', value: 4000 },
  { month: 'Feb', value: 3000 },
  { month: 'Mar', value: 5000 },
  { month: 'Apr', value: 2780 },
  { month: 'May', value: 1890 },
  { month: 'Jun', value: 2390 },
  { month: 'Jul', value: 6000 },
  { month: 'Aug', value: 4500 },
  { month: 'Sep', value: 3500 },
  { month: 'Oct', value: 2000 },
  { month: 'Nov', value: 1500 },
  { month: 'Dec', value: 3000 },
];

const sales = [
  { name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: 1999.00 },
  { name: 'Jackson Lee', email: 'jackson.lee@gmail.com', amount: 39.00 },
  { name: 'Isabella Nguyen', email: 'isabella.nguyen@gmail.com', amount: 299.00 },
  { name: 'William Kim', email: 'will@email.com', amount: 99.00 },
  { name: 'Sofia Davis', email: 'sofia.davis@gmail.com', amount: 39.00 },
  { name: 'Isabella Nguyen', email: 'isabella.nguyen@gmail.com', amount: 299.00 },
  { name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: 1999.00 },
];

const pieData = [
  { name: 'Product A', value: 4000 },
  { name: 'Product B', value: 3000 },
  { name: 'Product C', value: 2000 },
  { name: 'Product D', value: 2780 },
];

const lineData = [
  { month: 'Jan', value: 4000 },
  { month: 'Feb', value: 3500 },
  { month: 'Mar', value: 3200 },
  { month: 'Apr', value: 3800 },
  { month: 'May', value: 3900 },
  { month: 'Jun', value: 4500 },
  { month: 'Jul', value: 4800 },
  { month: 'Aug', value: 4600 },
  { month: 'Sep', value: 4400 },
  { month: 'Oct', value: 4000 },
  { month: 'Nov', value: 4100 },
  { month: 'Dec', value: 4200 },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export default function Page() {
  return (
    <Layout>
      <div className="flex flex-col gap-6 p-4 md:p-6 bg-gray-50">

        {/* Metrics Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Total Revenue", value: "45,231.89 DH", icon: <DollarSign className="h-5 w-5 text-blue-600" />, change: "+20.1%", trend: "up" },
            { title: "Clients Actifs", value: "2,350", icon: <Users className="h-5 w-5 text-green-600" />, change: "+160.1%", trend: "up" },
            { title: "Commandes", value: "12,234", icon: <ShoppingBag className="h-5 w-5 text-purple-600" />, change: "+9%", trend: "down" },
            { title: "Activité", value: "573", icon: <Activity className="h-5 w-5 text-orange-600" />, change: "+201", trend: "up" }
          ].map((card, i) => (
            <div key={i} className="rounded-xl p-6 border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
                <div className="p-2 bg-gray-100 rounded-lg">{card.icon}</div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                <div className={`flex items-center mt-2 text-sm ${card.trend === "up" ? 'text-green-600' : 'text-red-600'}`}>
                  {card.trend === "up" ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                  {card.change} {card.trend === "up" ? "vs mois dernier" : "vs mois dernier"}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            {/* Bar Chart */}
            <div className="rounded-xl p-6 border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Performance Mensuelle</h2>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded-lg">2024</button>
                  <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Comparer</button>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Sales */}
            <div className="rounded-xl p-6 border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Transactions Récentes</h2>
                  <p className="text-sm text-gray-600 mt-1">265 transactions ce mois</p>
                </div>
              </div>

              <div className="overflow-y-auto max-h-64 pr-2">
                <div className="space-y-4">
                  {sales.map((sale, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-white transition-all border border-transparent hover:border-gray-200 gap-4"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="p-2 bg-white rounded-lg border border-gray-200 shrink-0">
                          <User className="h-5 w-5 text-gray-700" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-medium text-gray-900 ">{sale.name}</h3>
                          <p className="text-sm text-gray-600">{sale.email}</p>
                        </div>
                      </div>
                      <span className="font-medium text-green-600 whitespace-nowrap shrink-0 ml-4">
                        +{sale.amount.toFixed(2)} DH
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* Pie Chart */}
            <div className="rounded-xl p-6 border border-gray-200 bg-white shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Répartition des Ventes</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="60%"
                      outerRadius="80%"
                      paddingAngle={5}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend
                      iconType="circle"
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                      formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Line Chart */}
            <div className="rounded-xl p-6 border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Tendance des Ventes</h2>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-sm text-gray-600 bg-gray-50 rounded-lg">1 an</button>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ fill: '#10B981', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
