import React from 'react';
import { Column } from '@ant-design/plots';

export const SimpleBarChart = (props) => {
    const { result } = props;

    const data = result.map(item => ({
        code: item.code,
        count: item.count,
    }));

    const config = {
        data: data,
        xField: 'code',
        yField: 'count',
        label: {
            text: (d) => `${d.count}`,
            position: 'inside',
            transform: [
                {
                    type: 'overflowHide',
                },
            ],
        },
        axis: {
            y: {
                labelFormatter: (val) => (val),
            },
        },
        tooltip: {
            title: '_id',
            items: [{
                channel: 'y',
                name: "Lượt khách :",
                valueFormatter: (d) => (d),
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
