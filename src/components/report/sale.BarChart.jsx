import React from 'react';
import { Column } from '@ant-design/plots';
import dayjs from 'dayjs';
import { formatCurrency } from '@/utils/api';

export const SaleBarChart = (props) => {
    const { listSales } = props;


    const data = listSales.map(item => ({
        user: item.user[0].name,
        totalCommission: item.totalCommission,
    }));

    const config = {
        data: data,
        xField: 'user',
        yField: 'totalCommission',
        // scrollbar: {
        //     x: {
        //         ratio: 20,
        //     },
        // },
        label: {
            text: (d) => `${formatCurrency(d.totalCommission)}`,
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
