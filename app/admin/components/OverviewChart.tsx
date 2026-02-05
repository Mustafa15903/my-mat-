'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { luxuryColors } from '@/lib/theme';

const data = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
];

export default function OverviewChart() {
    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 10,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={luxuryColors.border} />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: luxuryColors.textSecondary, fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: luxuryColors.textSecondary, fontSize: 12 }}
                        dx={-10}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: '8px',
                            border: `1px solid ${luxuryColors.border}`,
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            backgroundColor: luxuryColors.bgLight,
                            color: luxuryColors.textPrimary
                        }}
                        formatter={(value: any) => [`$${value}`, 'Sales']}
                    />
                    <Area
                        type="monotone"
                        dataKey="sales"
                        stroke={luxuryColors.accentGold}
                        fill="url(#colorSales)"
                        strokeWidth={2}
                    />
                    <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={luxuryColors.accentGold} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={luxuryColors.accentGold} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
