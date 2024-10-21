import { useEffect, useState } from "react";
import { Table } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
// import UpdateModal from "./update.modal";
import CheckAccess from "@/router/check.access";
import { ALL_PERMISSIONS } from "@/utils/permission.module";
import { useDispatch } from "react-redux";
import { formatCurrency } from "@/utils/api";
import { FundViewOutlined } from "@ant-design/icons";
import RevenueDetailDrawer from "./revenue.detail.drawer";
import { paymentOnchangeTable } from "@/redux/slice/paymentSlice";


const RevenueTable = (props) => {
  const { listPayments, loading, meta, totalPaid, setTotalPaid } = props;
  const [isRevenueDetailDrawer, setIsRevenueDetailDrawer] = useState(false);
  const dispatch = useDispatch();

  const [totalContract, setTotalContract] = useState(0)
  const [dataDetail, setDataDetail] = useState()


  useEffect(() => {
    if (listPayments) {
      const totalCount = listPayments.reduce((accumulator, item) => {
        return accumulator + item.count;
      }, 0);
      const totalPaid = listPayments.reduce((accumulator, item) => {
        return accumulator + item.totalPaid;
      }, 0);
      setTotalContract(totalCount)
      setTotalPaid(totalPaid)
    }
  }, [listPayments]);

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
      title: "Ngày",
      render: (_value, record) => (
        <div style={{ fontWeight: 550 }}>
          {dayjs(record._id).format("DD/MM/YYYY")}
        </div>
      ),
      sorter: (a, b) => dayjs(a._id).unix() - dayjs(b._id).unix(), // So sánh bằng timestamp
      defaultSortOrder: "descend", // Sắp xếp giảm dần mặc định (nếu cần)
    },
    {
      title: "Hợp đồng",
      render: (_value, record) => {
        return <div style={{ fontWeight: 550, color: "blueviolet" }}>{record?.count}</div>;
      },
    },
    {
      title: "Doanh thu",
      render: (_value, record) => {
        return <div style={{ fontWeight: 550, color: "blueviolet" }}>{formatCurrency(record.totalPaid)}</div>;
      },
    },
    {
      title: "Chức năng",
      width: 200,
      render: (record) => {
        return (
          <div style={{ display: "flex", placeContent: "center" }}>
            <FundViewOutlined style={{ fontSize: 25 }} onClick={() => { setIsRevenueDetailDrawer(true), setDataDetail(record) }} />
          </div>
        );
      },
    },
  ];


  return (
    <>
      <Table
        size="small"
        scroll={{ x: true }}
        columns={columns}
        dataSource={listPayments}
        rowKey={"_id"}
        loading={loading}
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
              paymentOnchangeTable({
                current: page,
                pageSize: pageSize,
                pages: meta.pages,
                total: meta.total,
              })
            ),
          showSizeChanger: true,
          defaultPageSize: meta.pageSize,
        }}
        summary={() => {
          return (
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={2}>
                <div style={{ textAlign: "right", fontWeight: 550 }}>Tổng :</div>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <div style={{ fontWeight: 550, color: "red" }}>
                  {totalContract}
                </div>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <div style={{ fontWeight: 550, color: "red" }}>
                  {formatCurrency(totalPaid)}
                </div>
              </Table.Summary.Cell>
              <Table.Summary.Cell>

              </Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
      />
      <RevenueDetailDrawer
        dataDetail={dataDetail}
        isRevenueDetailDrawer={isRevenueDetailDrawer}
        setIsRevenueDetailDrawer={setIsRevenueDetailDrawer}
      />
    </>
  );
};

export default RevenueTable;
