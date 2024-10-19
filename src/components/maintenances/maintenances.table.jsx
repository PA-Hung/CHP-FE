import { useState } from "react";
import { Table, Button, notification, Popconfirm, message, Tag, Select, Modal, DatePicker } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
import CheckAccess from "@/router/check.access";
import { ALL_PERMISSIONS } from "@/utils/permission.module";
import { useDispatch } from "react-redux";
import { deleteMaintenance, updateMaintenance } from "@/utils/api";
import { maintenanceOnchangeTable } from "@/redux/slice/maintenanceSlice";
import UpdateDrawer from "./update.drawer";


const MaintenancesTable = (props) => {
  const { listMaintenances, loading, reloadTable, meta } = props;
  const [isUpdateDrawerOpen, setIsUpdateDrawerOpen] = useState(false);
  const [updateData, setUpdateData] = useState(null);
  const dispatch = useDispatch();

  const confirmDelete = async (item) => {
    const res = await deleteMaintenance(item._id);
    if (res.data) {
      reloadTable();
      message.success("Xoá phiếu bảo trì thành công !");
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        placement: "top",
        description: res.message,
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleStatusChange = (value, record) => {
    let selectedEndDate = dayjs(); // Khởi tạo giá trị mặc định
    if (record.status === "Bảo trì hoàn tất") {
      Modal.confirm({
        title: 'Xác nhận thay đổi',
        okText: 'Xác nhận',
        cancelText: 'Hủy bỏ',
        content: (
          <div>Bạn có muốn thay đổi từ <span style={{ fontWeight: 550 }}>{record.status}</span> sang <span style={{ fontWeight: 550 }}>{value}</span> ?</div>),
        onOk: () => {
          handleOkStatusChange(value, record, selectedEndDate);
        },
      });
    }
    if (record.status === "Đang bảo trì") {
      Modal.confirm({
        title: 'Xác nhận thay đổi',
        okText: 'Xác nhận',
        cancelText: 'Hủy bỏ',
        content: (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <div>Bạn có muốn thay đổi trạng thái từ <span style={{ fontWeight: 550 }}>{record.status}</span> sang <span style={{ fontWeight: 550 }}>{value}</span> ?</div>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 5 }}>
                <div>Thời gian hoàn tất : </div>
                <div>
                  <DatePicker
                    defaultValue={dayjs()}
                    format="DD-MM-YYYY"
                    onChange={(date) => {
                      selectedEndDate = date; // Cập nhật biến cục bộ
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        ),
        onOk: () => {
          handleOkStatusChange(value, record, selectedEndDate);
        },
      });
    }
  };


  const handleOkStatusChange = async (value, record, selectedEndDate) => {
    const data = {
      _id: record._id,
      status: value,
      end_date: selectedEndDate
    };

    const res = await updateMaintenance(data);
    if (res.data) {
      reloadTable();
      message.success("Cập nhật trạng trạng thành công !");
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        placement: "top",
        description: res.message,
      });
    }
  }

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
      title: "Tên xe / biển số",
      dataIndex: "license",
      key: "license",
      width: 170,
      render: (_value, record) => {
        return <div style={{ display: "flex", gap: 10 }}>
          <div style={{ fontWeight: 550 }}>{record.motor_id.brand}</div>
          <Tag color="blue" style={{ fontWeight: 500 }}>{record.motor_id.license}</Tag>
        </div>;
      },
    },
    {
      title: "Nhân viên",
      render: (_value, record) => {
        return <div>{record?.user_id.name}</div>;
      },
    },
    {
      title: "Thời gian bảo trì",
      render: (_value, record) => {
        return <div>{dayjs(record?.start_date).format("DD/MM")} - {dayjs(record?.end_date).format("DD/MM/YYYY")}</div>;
      },
    },
    {
      title: "Đơn vị bảo trì",
      width: 250,
      render: (_value, record) => {
        return <div>{record?.supplier}</div>;
      },
    },
    {
      title: "Phí bảo trì",
      render: (_value, record) => {
        return <div>{formatCurrency(record?.total_bill)}</div>;
      },
    },
    {
      title: "Tình trạng",
      render: (_value, record) => {
        return <>
          <Select
            disabled={record.status === "Bảo trì hoàn tất" ? true : false}
            status="warning"
            size="large"
            style={{ width: 170 }}
            onChange={(value) => handleStatusChange(value, record)}
            options={[
              { value: "Đang bảo trì", label: "Đang bảo trì" },
              { value: "Bảo trì hoàn tất", label: "Bảo trì hoàn tất" },
            ]}
            value={record.status}
          />
        </>;

      },
    },
    {
      title: "Actions",
      render: (record) => {
        return (
          <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
            {/* <CheckAccess
              FeListPermission={ALL_PERMISSIONS.APARTMENT.UPDATE}
              hideChildren
            > */}
            <div>
              <Button
                danger
                onClick={() => {
                  setIsUpdateDrawerOpen(true);
                  setUpdateData(record);
                }}
              >
                Cập nhật
              </Button>
            </div>
            {/* </CheckAccess>
            <CheckAccess
              FeListPermission={ALL_PERMISSIONS.APARTMENT.DELETE}
              hideChildren
            > */}
            <div>
              <Popconfirm
                title={`Bạn muốn xoá phiếu xe ${record.motor_id.license} không ?`}
                onConfirm={() => confirmDelete(record)}
                okText="Yes"
                cancelText="No"
              >
                <Button type={"primary"} danger>
                  Xoá
                </Button>
              </Popconfirm>
            </div>
            {/* </CheckAccess> */}
          </div>
        );
      },
    },
  ];

  const expandColumns = [
    {
      title: "Tên dịch vụ",
      dataIndex: "service",
      key: "service",
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
    },
  ]

  const expandableTable = (record) => (
    <Table
      columns={expandColumns}
      dataSource={record.maintenance_list}
      pagination={false}
      bordered
      summary={() => (
        <Table.Summary.Row>
          <Table.Summary.Cell colSpan={3}>
          </Table.Summary.Cell>
          <Table.Summary.Cell>
            <div style={{ textAlign: 'left', fontWeight: 550 }}>Tổng :</div>
          </Table.Summary.Cell>
          <Table.Summary.Cell>
            <div style={{ fontWeight: 550, color: 'red' }}>{formatCurrency(record.total_bill)}</div>
          </Table.Summary.Cell>
          <Table.Summary.Cell colSpan={2} />
        </Table.Summary.Row>
      )}
    />
  );


  return (
    <>
      <Table
        size="small"
        scroll={{ x: true }}
        columns={columns}
        dataSource={listMaintenances}
        rowKey={"_id"}
        loading={loading}
        bordered={true}
        expandable={{
          expandedRowRender: expandableTable,
          expandRowByClick: true,
        }}
        pagination={{
          position: ["bottomCenter"],
          current: meta.current,
          pageSize: meta.pageSize,
          total: meta.total,
          showTotal: (total, range) =>
            `${range[0]} - ${range[1]} of ${total} items`,
          onChange: (page, pageSize) =>
            dispatch(
              maintenanceOnchangeTable({
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
      <UpdateDrawer
        isUpdateDrawerOpen={isUpdateDrawerOpen}
        setIsUpdateDrawerOpen={setIsUpdateDrawerOpen}
        updateData={updateData}
        reloadTable={reloadTable}
      />
    </>
  );
};

export default MaintenancesTable;
