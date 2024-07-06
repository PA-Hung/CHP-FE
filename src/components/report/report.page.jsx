import { useEffect, useState } from "react";
import { Button, Row, Col, Tabs, DatePicker } from "antd";
import queryString from "query-string";
import {
  PlusOutlined,
} from "@ant-design/icons";
// import CreateModal from "./create.modal";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
import { useDispatch, useSelector } from "react-redux";
// import SearchModal from "./search.modal";
// import AccommodationTable from "./apartment.table";
import CheckAccess from "@/router/check.access";
import { ALL_PERMISSIONS } from "@/utils/permission.module";
import ProfitTable from "./profit.table";
import { fetchPayment } from "@/redux/slice/paymentSlice";
import { ProfitBarChart } from "./profit.BarChart";
const { RangePicker } = DatePicker;

const ReportPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const defaultStartDate = dayjs().startOf('month');
  const defaultEndDate = dayjs().endOf('month');

  const loading = useSelector((state) => state.payment.isFetching);
  const meta = useSelector((state) => state.payment.meta);
  const listPayments = useSelector((state) => state.payment.result);
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState(null);


  useEffect(() => {
    const initData = async () => {
      if (searchValue) {
        const query = buildQuery(searchValue);
        dispatch(fetchPayment({ query }));
      } else {
        const query = buildQuery();
        dispatch(fetchPayment({ query }));
      }
    };
    initData();
  }, [meta.current, meta.pageSize]);

  const reloadTable = () => {
    const query = buildQuery();
    dispatch(fetchPayment({ query }));
  };

  const buildQuery = (
    params,
    sort,
    filter,
    page = meta.current,
    pageSize = meta.pageSize
  ) => {
    const clone = { ...params };
    if (clone.start_date) clone.start_date = `/${clone.start_date}/i`;
    if (clone.end_date) clone.end_date = `/${clone.end_date}/i`;

    let temp = queryString.stringify(clone);

    let sortBy = "";
    if (sort && sort.start_date) {
      sortBy = sort.start_date === "ascend" ? "sort=start_date" : "sort=-start_date";
    }

    if (sort && sort.end_date) {
      sortBy = sort.end_date === "ascend" ? "sort=end_date" : "sort=-end_date";
    }

    if (sort && sort.createdAt) {
      sortBy =
        sort.createdAt === "ascend" ? "sort=createdAt" : "sort=-createdAt";
    }
    if (sort && sort.updatedAt) {
      sortBy =
        sort.updatedAt === "ascend" ? "sort=updatedAt" : "sort=-updatedAt";
    }

    //mặc định sort theo updatedAt
    if (Object.keys(sortBy).length === 0) {
      temp = `current=${page}&pageSize=${pageSize}&${temp}&sort=-createdAt`;
    } else {
      temp = `current=${page}&pageSize=${pageSize}&${temp}&${sortBy}`;
    }
    return temp;
  };

  const tabsItems = [
    {
      key: '1',
      label: (<div style={{ fontWeight: 600 }}>Doanh Thu</div>),
      children: (
        <>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Row gutter={[16, 16]} justify={"space-between"}>
                <Col >
                  <div style={{ fontSize: 17, fontWeight: 550 }}>
                    Báo cáo doanh thu theo ngày
                  </div>
                </Col>
                <Col >
                  <RangePicker
                    size="large"
                    status="warning"
                    onChange={(e) => handleTimeChange(e)}
                    format={'DD/MM/YYYY'}
                    defaultValue={[defaultStartDate, defaultEndDate]}
                  />
                </Col>
              </Row>
            </Col>
            <Col span={24} >
              {/* <Row gutter={[16, 16]}>
                <Col span={24}>
                  <ProfitBarChart
                    listPayments={listPayments}
                    loading={loading}
                  />
                </Col>
              </Row> */}
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <ProfitTable
                    listPayments={listPayments}
                    loading={loading}
                    reloadTable={reloadTable}
                    meta={meta}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      ),
    },
    {
      key: '2',
      label: (<div>Nhân Viên</div>),
      children: (
        <>
          <ProfitBarChart
            listPayments={listPayments}
            loading={loading}
          />
        </>
      ),
    },
  ];

  const handleTimeChange = (e) => {
    const inputQuery = {
      start_date: e ? e[0] : defaultStartDate,
      end_date: e ? e[1] : defaultEndDate,
    }
    setSearchValue(inputQuery);
    const query = buildQuery(inputQuery);
    dispatch(fetchPayment({ query }));
  }


  return (
    <div style={{ paddingLeft: 30, paddingRight: 30 }}>
      {/* <CheckAccess
        FeListPermission={ALL_PERMISSIONS.APARTMENT.GET_PAGINATE}
      ></CheckAccess> */}
      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Tabs defaultActiveKey="1" items={tabsItems} size="large" />
        </Col>
      </Row>
    </div>
  );
};

export default ReportPage;
