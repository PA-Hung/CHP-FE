import React from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

const data = [
    {
        code: 'Page A',
        count: 4000,
    },
    {
        code: 'Page B',
        count: 3000,
    },
    {
        code: 'Page C',
        count: 2000,
    },
    {
        code: 'Page D',
        count: 2780,
    },
    {
        code: 'Page E',
        count: 1890,
    },
    {
        code: 'Page F',
        count: 2390,
    },
    {
        code: 'Page G',
        count: 3490,
    },
    {
        code: 'Page G',
        count: 3490,
    },
    {
        code: 'Page G',
        count: 3490,
    },
    {
        code: 'Page G',
        count: 3490,
    },
    {
        code: 'Page G',
        count: 3490,
    },
    {
        code: 'Page G',
        count: 3490,
    },
    {
        code: 'Page G',
        count: 3490,
    },
    {
        code: 'Page G',
        count: 3490,
    },
];

export const SimpleBarChart = (props) => {
    const { result, isFetching } = props;
    console.log('result', result);
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                width={500}
                height={300}
                data={result}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                loading={isFetching}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="code"
                    interval={0}
                    fontSize={9}
                    fontWeight={'bold'}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                    dataKey="count"
                    name={"Số lượng khách theo mã căn"}
                    fill="#8884d8"
                    activeBar={<Rectangle
                        fill="pink"
                        stroke="blue"
                    />}
                />

            </BarChart>
        </ResponsiveContainer>
    )
}
