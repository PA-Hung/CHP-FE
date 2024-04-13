import { useEffect, useState } from "react";
import { Button, notification, message, Row, Col, Flex } from "antd";
import queryString from "query-string";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import CreateModal from "./create.modal";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
import { useDispatch, useSelector } from "react-redux";
import SearchModal from "./search.modal";
import PermissionTable from "./permission.table";
import PermissionCard from "./permission.card";
import { fetchPermission } from "../../redux/slice/permissionSlice";
import CheckAccess from "../../utils/check.access";
import { ALL_PERMISSIONS } from "../../utils/permission.module";

const PermissionPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const isFetching = useSelector((state) => state.permission.isFetching);
  const meta = useSelector((state) => state.permission.meta);
  const permissions = useSelector((state) => state.permission.result);
  const dispatch = useDispatch();

  const [searchValue, setSearchValue] = useState({});

  useEffect(() => {
    const initData = async () => {
      if (searchValue) {
        const query = buildQuery(searchValue);
        dispatch(fetchPermission({ query }));
      } else {
        const query = buildQuery();
        dispatch(fetchPermission({ query }));
      }
    };
    initData();
  }, [meta.current, meta.pageSize]);

  const reloadTable = () => {
    const query = buildQuery();
    dispatch(fetchPermission({ query }));
  };

  const buildQuery = (
    params,
    sort,
    filter,
    page = meta.current,
    pageSize = meta.pageSize
  ) => {
    const clone = { ...params };

    if (clone.name) clone.name = `/${clone.name}/i`;
    if (clone.apiPath) clone.apiPath = `/${clone.apiPath}/i`;
    if (clone.method) clone.method = `/${clone.method}/i`;
    if (clone.module) clone.module = `/${clone.module}/i`;

    let temp = queryString.stringify(clone);

    let sortBy = "";
    if (sort && sort.name) {
      sortBy = sort.name === "ascend" ? "sort=name" : "sort=-name";
    }
    if (sort && sort.apiPath) {
      sortBy = sort.apiPath === "ascend" ? "sort=apiPath" : "sort=-apiPath";
    }
    if (sort && sort.method) {
      sortBy = sort.method === "ascend" ? "sort=method" : "sort=-method";
    }
    if (sort && sort.module) {
      sortBy = sort.module === "ascend" ? "sort=module" : "sort=-module";
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
    dispatch(fetchPermission({ query }));
  };

  return (
    <div style={{ paddingLeft: 30, paddingRight: 30 }}>
      <CheckAccess
        FeListPermission={ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE}
        hideChildren
      >
        <div style={{ padding: 20 }}>
          <Flex justify="space-between" align="center">
            <Row gutter={[8, 8]}>
              <Col xs={0} sm={24} md={24} lg={12} xl={12}>
                <Button
                  icon={<SearchOutlined />}
                  onClick={() => setIsSearchModalOpen(true)}
                >
                  Tìm kiếm
                </Button>
              </Col>
              <Col xs={24} sm={0} md={0} lg={0} xl={0}>
                <Button
                  icon={<SearchOutlined />}
                  onClick={() => setIsSearchModalOpen(true)}
                />
              </Col>
            </Row>
            <Row gutter={[8, 8]}>
              <CheckAccess
                FeListPermission={ALL_PERMISSIONS.PERMISSIONS.CREATE}
                hideChildren
              >
                <Col xs={0} sm={24} md={24} lg={12} xl={12}>
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    Thêm mới
                  </Button>
                </Col>
                <Col xs={24} sm={0} md={0} lg={0} xl={0}>
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => setIsCreateModalOpen(true)}
                  />
                </Col>
              </CheckAccess>
            </Row>
          </Flex>
        </div>
        <Row>
          <Col xs={24} sm={24} md={24} lg={0} xl={0}>
            {/* <PermissionCard
              permissions={permissions}
              isFetching={isFetching}
              meta={meta}
              reloadTable={reloadTable}
            /> */}
          </Col>
          <Col xs={0} sm={0} md={0} lg={24} xl={24}>
            <PermissionTable
              permissions={permissions}
              isFetching={isFetching}
              meta={meta}
              reloadTable={reloadTable}
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

export default PermissionPage;
