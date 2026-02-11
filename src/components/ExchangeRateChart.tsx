'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { format } from 'date-fns';

interface ExchangeRateChartProps {
  data: Array<{
    date: string;
    buy_rate: number;
    sell_rate: number;
  }>;
  currencyPair: string;
}

export default function ExchangeRateChart({ data, currencyPair }: ExchangeRateChartProps) {
  const formattedData = data.map(item => ({
    ...item,
    date: format(new Date(item.date), 'MM/dd'),
  }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 card-hover">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {currencyPair} - Ханшийн түүх
          </h3>
          <p className="text-sm text-slate-400 mt-0.5">Хувь хүний ханшийн өөрчлөлт</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-slate-500">Худалдан авах</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-500">Зарах</span>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={380}>
        <AreaChart data={formattedData}>
          <defs>
            <linearGradient id="buyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="sellGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#94a3b8"
            style={{ fontSize: '11px' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#94a3b8"
            style={{ fontSize: '11px' }}
            domain={['dataMin - 5', 'dataMax + 5']}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              fontSize: '13px',
              padding: '10px 14px',
            }}
            formatter={(value: any) => (typeof value === 'number' ? value.toFixed(2) : '0.00')}
          />
          <Area 
            type="monotone" 
            dataKey="buy_rate" 
            stroke="#3b82f6" 
            strokeWidth={2.5}
            name="Худалдан авах"
            fill="url(#buyGradient)"
            dot={false}
            activeDot={{ r: 5, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
          />
          <Area 
            type="monotone" 
            dataKey="sell_rate" 
            stroke="#10b981" 
            strokeWidth={2.5}
            name="Зарах"
            fill="url(#sellGradient)"
            dot={false}
            activeDot={{ r: 5, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-blue-50/70 rounded-xl p-4 border border-blue-100/50">
          <p className="text-xs font-medium text-slate-500 mb-1">Худалдан авах ханш</p>
          <p className="text-2xl font-bold text-blue-600">
            {data[data.length - 1]?.buy_rate.toFixed(2)}
          </p>
        </div>
        <div className="bg-emerald-50/70 rounded-xl p-4 border border-emerald-100/50">
          <p className="text-xs font-medium text-slate-500 mb-1">Зарах ханш</p>
          <p className="text-2xl font-bold text-emerald-600">
            {data[data.length - 1]?.sell_rate.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
