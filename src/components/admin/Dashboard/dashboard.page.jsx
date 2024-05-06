import { useEffect, useState } from "react";
import { Row, Col, DatePicker } from "antd";
import queryString from "query-string";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
import { useDispatch, useSelector } from "react-redux";
import CheckAccess from "@/router/check.access";
import { ALL_PERMISSIONS } from "@/utils/permission.module";
import { fetchDashboard } from "@/redux/slice/dashboardSlice";
import DashboardTable from "./dashboard.table";
import { getApartment } from "@/utils/api";
import { SimpleBarChart } from "./simpleBarChart";
const { RangePicker } = DatePicker;

const DashboardPage = () => {
  const isFetching = useSelector((state) => state.dashboard.isFetching);
  const meta = useSelector((state) => state.dashboard.meta);
  const dashboard = useSelector((state) => state.dashboard.result);
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState(null);
  const [defaultDate, setDefaultDate] = useState({ arrival: dayjs(), departure: dayjs().add(1, "day") });
  const [apartment, setApartment] = useState();

  useEffect(() => {
    const initData = async () => {
      if (searchValue) {
        const query = buildQuery(searchValue);
        dispatch(fetchDashboard({ query }));
      } else {
        const query = buildQuery(defaultDate);
        dispatch(fetchDashboard({ query }));
      }
    };
    initData();
  }, [searchValue, meta.current, meta.pageSize]);

  useEffect(() => {
    const initApartment = async () => {
      const res = await getApartment(`current=1&pageSize=100`);
      if (res.data?.result) {
        setApartment(res.data?.result);
      }
    };
    initApartment();
  }, []);

  const result = [];
  apartment?.forEach(dashboardItem => {
    const foundApartment = dashboard.find(apartment => apartment._id === dashboardItem._id);
    if (foundApartment) {
      result.push(foundApartment);
    } else {
      const { _id, code } = dashboardItem;
      result.push({ _id, count: 0, code });
    }
  });
  result.sort((a, b) => a.count - b.count);

  // console.log('apartment', apartment);
  // console.log('dashboard', dashboard);
  // console.log('result', result);

  // const reloadTable = () => {
  //   const query = buildQuery();
  //   dispatch(fetchDashboard({ query }));
  //   setSearchValue(null);
  // };

  const buildQuery = (
    params,
    sort,
    filter,
    page = meta.current,
    pageSize = meta.pageSize
  ) => {
    const clone = { ...params };

    if (clone.arrival) clone.arrival = `/${clone.arrival}/i`;
    if (clone.departure) clone.departure = `/${clone.departure}/i`;

    let temp = queryString.stringify(clone);

    let sortBy = "";
    if (sort && sort.arrival) {
      sortBy = sort.arrival === "ascend" ? "sort=arrival" : "sort=-arrival";
    }
    if (sort && sort.departure) {
      sortBy = sort.departure === "ascend" ? "sort=departure" : "sort=-departure";
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
      temp = `current=${page}&pageSize=${pageSize}&${temp}&sort=-arrival`;
    } else {
      temp = `current=${page}&pageSize=${pageSize}&${temp}&${sortBy}`;
    }
    return temp;
  };

  const handleTimeChange = (e) => {
    const inputQuery = {
      arrival: e ? e[0] : dayjs(),
      departure: e ? e[1] : dayjs().add(1, "day"),
    }
    setSearchValue(inputQuery);
    const query = buildQuery(inputQuery);
    dispatch(fetchDashboard({ query }));
  }

  return (
    <div style={{ paddingLeft: 30, paddingRight: 30, color: 'black' }}>
      <div style={{ paddingTop: 30, textAlign: 'center' }}>
        Với đội ngũ nhân sự trẻ trung, năng động đầy nhiệt huyết và chân thành, Châu Homestay cam kết sẽ mang lại cho quý khách trải nghiệm tuyệt vời nhất khi lưu trú tại hệ thống của chúng tôi.
      </div>
      <CheckAccess
        FeListPermission={ALL_PERMISSIONS.DASHBOARD.GET_PAGINATE}
        hideChildren
      >
        <div style={{ paddingTop: 30 }}>
          <div style={{ paddingBottom: 20 }}>
            Chọn ngày : <RangePicker
              onChange={(e) => handleTimeChange(e)}
              format={'DD/MM/YYYY'}
              defaultValue={[dayjs(), dayjs().add(1, 'day')]}
            />
          </div>
          <Row gutter={[8, 8]} justify="left" wrap={true}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} >
              <DashboardTable
                result={result}
                isFetching={isFetching}
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} >
              <SimpleBarChart
                result={result}
                isFetching={isFetching}
              />
            </Col>
          </Row>
        </div>
      </CheckAccess>
    </div>
  );
};

export default DashboardPage;
