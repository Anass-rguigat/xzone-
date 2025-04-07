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
  Cell 
} from 'recharts';
import { ChartAreaInteractive } from "../Components/ui/chart-area-interactive";
import { ArrowUp, ArrowDown, Users, DollarSign, ShoppingBag, Activity ,User} from "lucide-react";
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
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
export default function Page() {
  return (
    <Layout>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 ">
        <div className="grid auto-rows-min gap-4 md:grid-cols-4">
          {/* Carte Total Revenue */}
          <div className="rounded-xl p-6 border border-gray-200 bg-white hover:border-gray-300 transition-colors shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
              <DollarSign className="h-4 w-4 text-gray-500" />
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-gray-900">$45,231.89</div>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <ArrowUp className="h-4 w-4 mr-1" />
                +20.1% from last month
              </div>
            </div>
          </div>

          {/* Carte Subscriptions */}
          <div className="rounded-xl p-6 border border-gray-200 bg-white hover:border-gray-300 transition-colors shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600">Subscriptions</h3>
              <Users className="h-4 w-4 text-gray-500" />
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-gray-900">+2350</div>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <ArrowUp className="h-4 w-4 mr-1" />
                +160.1% from last month
              </div>
            </div>
          </div>

          {/* Carte Sales */}
          <div className="rounded-xl p-6 border border-gray-200 bg-white hover:border-gray-300 transition-colors shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600">Sales</h3>
              <ShoppingBag className="h-4 w-4 text-gray-500" />
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-gray-900">+12,234</div>
              <div className="flex items-center mt-2 text-sm text-red-600">
                <ArrowDown className="h-4 w-4 mr-1" />
                +9% from last month
              </div>
            </div>
          </div>

          {/* Carte Active Now */}
          <div className="rounded-xl p-6 border border-gray-200 bg-white hover:border-gray-300 transition-colors shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600">Active Now</h3>
              <Activity className="h-4 w-4 text-gray-500" />
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-gray-900">+573</div>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <ArrowUp className="h-4 w-4 mr-1" />
                +201 since last hour
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Charts Column */}
          <div className="flex flex-col gap-6">
            {/* Bar Chart Card */}
            <div className="rounded-xl p-6 border border-gray-200 bg-white shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Monthly Overview</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#6b7280"
                      tick={{ fill: '#6b7280' }}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      tick={{ fill: '#6b7280' }}
                      domain={[0, 6000]}
                      ticks={[0, 1500, 3000, 4500, 6000]}
                    />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                      barSize={24}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="rounded-xl p-6 border border-gray-200 bg-white shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Sales Breakdown</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
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
          </div>

          {/* Section Recent Sales */}
          <div className="rounded-xl p-6 border border-gray-200 bg-white shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Sales</h2>
              <p className="text-gray-600">You made 265 sales this month</p>
            </div>

            <div className="space-y-4">
              {sales.map((sale, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-medium">{sale.name}</h3>
                      <p className="text-gray-600 text-sm">{sale.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 font-medium">+${sale.amount.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}