import { useState } from "react";
import { Table, Button, notification, Popconfirm, message } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
import CheckAccess from "@/router/check.access";
import { ALL_PERMISSIONS } from "@/utils/permission.module";
import { useDispatch } from "react-redux";
import { apartmentOnchangeTable } from "@/redux/slice/apartmentSlice";

const DashboardTable = (props) => {
  const { result, isFetching, reloadTable, meta, dashboard } = props;
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateData, setUpdateData] = useState(null);
  const dispatch = useDispatch();

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
          onChange: (page, pageSize) =>
            dispatch(
              apartmentOnchangeTable({
                current: page,
                pageSize: pageSize,
                pages: meta.pages,
                total: meta.total,
              })
            ),
          showSizeChanger: true,
          defaultPageSize: meta.pageSize,
        }}
      />
    </>
  );
};

export default DashboardTable;
