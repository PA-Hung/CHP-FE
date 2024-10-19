import React from 'react';
import { Column } from '@ant-design/plots';
import dayjs from 'dayjs';
import { formatCurrency } from '@/utils/api';

export const ProfitBarChart = (props) => {
    const { listPayments } = props;


    const data = listPayments.map(item => ({
        _id: dayjs(item._id).format("DD/MM/YYYY"),
        totalPaid: item.totalPaid,
    }));

    const config = {
        data: data,
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
