import { useEffect, useState } from "react";
import { Button, Row, Col, Flex } from "antd";
import queryString from "query-string";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import CreateModal from "./create.role/create.modal";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
import { useDispatch, useSelector } from "react-redux";
import SearchModal from "./search.modal";
import RoleCard from "./role.card";
import RoleTable from "./role.table";
import { fetchRole } from "@/redux/slice/roleSlice";
import CheckAccess from "@/router/check.access"
import { ALL_PERMISSIONS } from "@/utils/permission.module";

const RolePage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const isFetching = useSelector((state) => state.role.isFetching);
  const meta = useSelector((state) => state.role.meta);
  const listRole = useSelector((state) => state.role.result);
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState(null);

  useEffect(() => {
    const initData = async () => {
      let query;
      if (searchValue) {
        query = buildQuery(searchValue);
      }
      else {
        query = buildQuery();
      }
      dispatch(fetchRole({ query }));
    };
    initData();
  }, [searchValue, meta.current, meta.pageSize]);


  const reloadTable = () => {
    const query = buildQuery();
    dispatch(fetchRole({ query }));
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

    let temp = queryString.stringify(clone);

    let sortBy = "";

    if (sort && sort.name) {
      sortBy = sort.name === "ascend" ? "sort=name" : "sort=-name";
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
    dispatch(fetchRole({ query }));
  };

  return (
    <div style={{ paddingLeft: 30, paddingRight: 30 }}>
      <CheckAccess
        FeListPermission={ALL_PERMISSIONS.ROLES.GET_PAGINATE}
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
                FeListPermission={ALL_PERMISSIONS.ROLES.CREATE}
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
            <RoleCard
              listRole={listRole}
              isFetching={isFetching}
              reloadTable={reloadTable}
              meta={meta}
            />
          </Col>
          <Col xs={0} sm={0} md={0} lg={24} xl={24}>
            <RoleTable
              listRole={listRole}
              isFetching={isFetching}
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

export default RolePage;
