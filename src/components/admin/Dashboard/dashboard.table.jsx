import { useState } from "react";
import { Table } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");

const DashboardTable = (props) => {
  const { result, isFetching, reloadTable } = props;
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 15,
    pages: 0,
    total: 0,
  });

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 50,
      align: "center",
      render: (text, record, index) => {
        return <>{index + 1 + (meta.current - 1) * meta.pageSize}</>;
      },
      hideInSearch: true,
    },
    {
      title: "Mã căn hộ",
      dataIndex: "code",
      key: "code",
      render: (_value, record) => {
        return <div>{record.code}</div>;
      },
    },
    {
      title: "Số khách",
      dataIndex: "guests",
      key: "guests",
      render: (_value, record) => {
        return <div>{record.count}</div>;
      },
    }
  ];

  const dashboardOnchangeTable = (page, pageSize) => {
    setMeta({
      current: page,
      pageSize: pageSize,
      pages: meta.pages,
      total: meta.total,
    });
  }

  return (
    <>
      <Table
        size="small"
        scroll={{ x: true }}
        columns={columns}
        dataSource={result}
        rowKey={"_id"}
        loading={isFetching}
        bordered={true}
        pagination={{
          position: ["bottomCenter"],
          current: meta.current,
          pageSize: meta.pageSize,
          total: meta.total,
          showTotal: (total, range) =>
            `${range[0]} - ${range[1]} of ${total} items`,
          onChange: (page, pageSize) => dashboardOnchangeTable(page, pageSize),
          showSizeChanger: true,
          defaultPageSize: meta.pageSize,
        }}
      />
    </>
  );
};

export default DashboardTable;
