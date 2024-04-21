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
import CreateModal from "./create.modal";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
import { useDispatch, useSelector } from "react-redux";
import SearchModal from "./search.modal";
import AccommodationTable from "./apartment.table";
import CheckAccess from "@/router/check.access";
import { ALL_PERMISSIONS } from "@/utils/permission.module";
import { fetchApartment } from "@/redux/slice/apartmentSlice";

const ApartmentPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const loading = useSelector((state) => state.apartment.isFetching);
  const meta = useSelector((state) => state.apartment.meta);
  const listApartment = useSelector((state) => state.apartment.result);
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState({});

  useEffect(() => {
    const initData = async () => {
      if (searchValue) {
        const query = buildQuery(searchValue);
        dispatch(fetchApartment({ query }));
      } else {
        const query = buildQuery();
        dispatch(fetchApartment({ query }));
      }
    };
    initData();
  }, [meta.current, meta.pageSize]);

  const reloadTable = () => {
    const query = buildQuery();
    dispatch(fetchApartment({ query }));
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

  const onSearch = async (value) => {
    setSearchValue(value);
    const query = buildQuery(value);
    dispatch(fetchApartment({ query }));
  };

  return (
    <div style={{ paddingLeft: 30, paddingRight: 30 }}>
      <CheckAccess
        FeListPermission={ALL_PERMISSIONS.APARTMENT.GET_PAGINATE}
      >
        <div style={{ padding: 20 }}>
          <Row gutter={[8, 8]} justify="start" wrap={true}>
            {/* <Col xs={24} sm={24} md={12} lg={8} xl={4}>
            <Button
              icon={<SearchOutlined />}
              onClick={() => setIsSearchModalOpen(true)}
            >
              Tìm kiếm
            </Button>
          </Col> */}
            <CheckAccess
              FeListPermission={ALL_PERMISSIONS.APARTMENT.CREATE}
              hideChildren
            >
              <Col xs={24} sm={24} md={12} lg={8} xl={4}>
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  Thêm mới
                </Button>
              </Col>
            </CheckAccess>
          </Row>
        </div>
        <Row>
          {/* <Col xs={24} sm={24} md={24} lg={0} xl={0}>
          <AccommodationCard
            listAccommodation={listAccommodation}
            loading={loading}
            reloadTable ={reloadTable}
            meta={meta}
          />
        </Col> */}
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <AccommodationTable
              listApartment={listApartment}
              loading={loading}
              reloadTable={reloadTable}
              meta={meta}
            />
          </Col>
        </Row>
        <CreateModal
          reloadTable={reloadTable}
          isCreateModalOpen={isCreateModalOpen}
          setIsCreateModalOpen={setIsCreateModalOpen}
        />
        <SearchModal
          isSearchModalOpen={isSearchModalOpen}
          setIsSearchModalOpen={setIsSearchModalOpen}
          onSearch={onSearch}
        />
      </CheckAccess>
    </div>
  );
};

export default ApartmentPage;
