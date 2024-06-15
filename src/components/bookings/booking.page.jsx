import { useEffect, useState } from "react";
import { Button, Row, Col } from "antd";
import queryString from "query-string";
import {
  PlusOutlined,
} from "@ant-design/icons";
import CreateDrawer from "./create.drawer";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
import { useDispatch, useSelector } from "react-redux";
import SearchModal from "./search.modal";
import BookingTable from "./booking.table";
import CheckAccess from "@/router/check.access";
import { ALL_PERMISSIONS } from "@/utils/permission.module";
import { fetchApartment } from "@/redux/slice/apartmentSlice";
import { fetchBooking } from "@/redux/slice/bookingSlice";

const BookingPage = () => {
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const loading = useSelector((state) => state.booking.isFetching);
  const meta = useSelector((state) => state.booking.meta);
  const listBookings = useSelector((state) => state.booking.result);
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState(null);



  useEffect(() => {
    const initData = async () => {
      if (searchValue) {
        const query = buildQuery(searchValue);
        dispatch(fetchBooking({ query }));
      } else {
        const query = buildQuery();
        dispatch(fetchBooking({ query }));
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
      temp = `current=${page}&pageSize=${pageSize}&${temp}&sort=-createdAt`;
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
      {/* <CheckAccess
        FeListPermission={ALL_PERMISSIONS.APARTMENT.GET_PAGINATE}
      > */}
      <div style={{ padding: 20 }}>
        <Row gutter={[8, 8]} justify="start" wrap={true}>
          {/* <CheckAccess
            FeListPermission={ALL_PERMISSIONS.APARTMENT.CREATE}
            hideChildren
          > */}
          <Col xs={24} sm={24} md={12} lg={8} xl={4}>
            <Button
              icon={<PlusOutlined />}
              onClick={() => setIsCreateDrawerOpen(true)}
            >
              Thêm mới
            </Button>
          </Col>
          {/* </CheckAccess> */}
        </Row>
      </div>
      <Row>
        {/* <Col xs={24} sm={24} md={24} lg={0} xl={0}>
          <AccommodationCard
            listAccommodation={listAccommodation}
            loading={loading}
            reloadTable={reloadTable}
            meta={meta}
          />
        </Col> */}
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <BookingTable
            listBookings={listBookings}
            loading={loading}
            reloadTable={reloadTable}
            meta={meta}
          />
        </Col>
      </Row>
      <CreateDrawer
        reloadTable={reloadTable}
        isCreateDrawerOpen={isCreateDrawerOpen}
        setIsCreateDrawerOpen={setIsCreateDrawerOpen}
      />
      <SearchModal
        isSearchModalOpen={isSearchModalOpen}
        setIsSearchModalOpen={setIsSearchModalOpen}
        onSearch={onSearch}
      />
      {/* </CheckAccess> */}
    </div>
  );
};

export default BookingPage;
