import React from 'react';
import { Column } from '@ant-design/plots';
import { formatCurrency } from '@/utils/api';
import { forEach, groupBy } from 'lodash-es';

export const SaleBarChart = (props) => {
    const { listSales } = props;

    const data = listSales.flatMap(item => ([
        {
            user: item.user[0].name,
            value: item.totalPaid,
            type: 'Doanh thu',
        },
        {
            user: item.user[0].name,
            value: item.totalCommission,
            type: 'Hoa Hồng',
        }
    ]));

    const config = {
        data: data,
        isGroup: true,
        xField: 'user',
        yField: 'value',
        colorField: 'type',
        group: true,
        seriesField: 'type',
        color: ['#6ab7ff', '#ffc069'], // Define colors for each series type
        label: {
            text: (d) => `${formatCurrency(d.value)}`,
            position: 'inside',
            textBaseline: 'bottom',
            style: {
                fill: '#fff', // Label text color
                fontWeight: 'bold', // Make user name bold
            },
            transform: [
                {
                    type: 'overflowHide',
                },
            ],
        },
        yAxis: {
            label: {
                formatter: (val) => formatCurrency(val),
            },
        },
        tooltip: {
            title: 'user',
            items: [{
                channel: 'y',
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
    );
}
