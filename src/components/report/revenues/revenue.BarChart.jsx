import React from 'react';
import { Column } from '@ant-design/plots';
import dayjs from 'dayjs';
import { formatCurrency } from '@/utils/api';

export const RevenueBarChart = (props) => {
    const { listPayments } = props;


    // Sắp xếp dữ liệu theo ngày
    const sortedData = listPayments
        .map(item => ({
            _id: dayjs(item._id).format("DD/MM/YYYY"),
            totalPaid: item.totalPaid,
            rawDate: item._id, // Giữ lại raw date để sort đúng
        }))
        .sort((b, a) => dayjs(a.rawDate).unix() - dayjs(b.rawDate).unix()); // Sắp xếp theo timestamp

    const config = {
        data: sortedData,
        xField: '_id',
        yField: 'totalPaid',
        label: {
            text: (d) => `${formatCurrency(d.totalPaid)}`,
            position: 'inside',
            transform: [
                {
                    type: 'overflowHide',
                },
            ],
        },
        axis: {
            y: {
                labelFormatter: (val) => formatCurrency(val),
            },
        },
        tooltip: {
            title: '_id',
            items: [{
                channel: 'y',
                name: "Doanh thu :",
                valueFormatter: (d) => formatCurrency(d),
            }],
        },
        style: {
            radiusTopLeft: 10,
            radiusTopRight: 10,
        },
    };

    return (
        <>
            <Column {...config} />
        </>
    )
}
