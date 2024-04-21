import { useEffect, useState } from "react";
import { Button, notification, message, Upload, Row, Col, Select } from "antd";
import queryString from "query-string";
import {
  PlusOutlined,
  SearchOutlined,
  ImportOutlined,
  DownloadOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
import { useDispatch, useSelector } from "react-redux";
import CheckAccess from "@/router/check.access";
import { ALL_PERMISSIONS } from "@/utils/permission.module";
import { fetchApartment } from "@/redux/slice/apartmentSlice";
import { fetchDashboard } from "@/redux/slice/dashboardSlice";
import DashboardTable from "./dashboard.table";

const DashboardPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const isFetching = useSelector((state) => state.dashboard.isFetching);
  const meta = useSelector((state) => state.dashboard.meta);
  const dashboard = useSelector((state) => state.dashboard.result);
  const listApartment = useSelector((state) => state.apartment.result);
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState({});

  const result = [];

  listApartment.forEach(dashboardItem => {
    const foundApartment = dashboard.find(apartment => apartment._id === dashboardItem._id);
    if (foundApartment) {
      result.push(foundApartment);
    } else {
      const { _id, code } = dashboardItem;
      result.push({ _id, code, count: 0 });
    }
  });
  result.sort((a, b) => a.count - b.count);

  useEffect(() => {
    const initData = async () => {
      const query = buildQuery();
      dispatch(fetchDashboard({ query }));
      dispatch(fetchApartment({ query }));
    };
    initData();
  }, [meta.current, meta.pageSize]);

  const reloadTable = () => {
    const query = buildQuery();
    dispatch(fetchDashboard({ query }));
  };

  const buildQuery = (
    params,
    sort,
    filter,
    page = meta.current,
    pageSize = meta.pageSize
  ) => {
    const clone = { ...params };
    if (clone.code) clone.code = `/${clone.code}/i`;

    let temp = queryString.stringify(clone);

    let sortBy = "";
    if (sort && sort.code) {
      sortBy = sort.code === "ascend" ? "sort=code" : "sort=-code";
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


  return (
    <div style={{ paddingLeft: 30, paddingRight: 30, color: 'black' }}>
      <div style={{ paddingTop: 30 }}>
        <Row gutter={[8, 8]}>
          <Col span={12} >
            <DashboardTable
              result={result}
              isFetching={isFetching}
              reloadTable={reloadTable}
              meta={meta}
            />
          </Col>
          <Col span={12} >Conten2</Col>
        </Row>
      </div>
    </div>
  );
};

export default DashboardPage;
