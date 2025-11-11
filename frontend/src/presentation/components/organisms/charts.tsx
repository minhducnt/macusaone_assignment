'use client';

import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../atoms/card';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

function ChartCard({ title, children, className }: ChartCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

// Line Chart for Trends
interface LineChartData {
  name: string;
  value: number;
  [key: string]: any;
}

interface TrendChartProps {
  data: LineChartData[];
  dataKey?: string;
  color?: string;
  className?: string;
}

export function TrendChart({
  data,
  dataKey = 'value',
  color = '#3b82f6',
  className
}: TrendChartProps) {
  return (
    <ChartCard title="Trends Over Time" className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis
            dataKey="name"
            className="text-gray-600 dark:text-gray-400"
            fontSize={12}
          />
          <YAxis
            className="text-gray-600 dark:text-gray-400"
            fontSize={12}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgb(255 255 255)',
              border: '1px solid rgb(229 231 235)',
              borderRadius: '6px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              color: 'rgb(17 24 39)'
            }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// Bar Chart for Comparisons
interface BarChartData {
  name: string;
  value: number;
  [key: string]: any;
}

interface ComparisonChartProps {
  data: BarChartData[];
  dataKey?: string;
  color?: string;
  className?: string;
}

export function ComparisonChart({
  data,
  dataKey = 'value',
  color = '#10b981',
  className
}: ComparisonChartProps) {
  return (
    <ChartCard title="Monthly Performance" className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis
            dataKey="name"
            className="text-gray-600 dark:text-gray-400"
            fontSize={12}
          />
          <YAxis
            className="text-gray-600 dark:text-gray-400"
            fontSize={12}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgb(255 255 255)',
              border: '1px solid rgb(229 231 235)',
              borderRadius: '6px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              color: 'rgb(17 24 39)'
            }}
          />
          <Bar
            dataKey={dataKey}
            fill={color}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// Pie Chart for Distribution
interface PieChartData {
  name: string;
  value: number;
  color?: string;
}

interface DistributionChartProps {
  data: PieChartData[];
  className?: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export function DistributionChart({ data, className }: DistributionChartProps) {
  return (
    <ChartCard title="User Distribution" className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgb(255 255 255)',
              border: '1px solid rgb(229 231 235)',
              borderRadius: '6px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              color: 'rgb(17 24 39)'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// Fake data generators for demo purposes
export const generateTrendData = (): LineChartData[] => [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 700 },
  { name: 'Jul', value: 900 },
];

export const generateComparisonData = (): BarChartData[] => [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
];

export const generateDistributionData = (): PieChartData[] => [
  { name: 'Active Users', value: 400, color: '#10b981' },
  { name: 'Inactive Users', value: 300, color: '#f59e0b' },
  { name: 'New Users', value: 200, color: '#3b82f6' },
  { name: 'Returning Users', value: 100, color: '#8b5cf6' },
];
