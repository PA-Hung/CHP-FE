import { useEffect, useState } from "react";
import {
  Table,
  Button,
  notification,
  Popconfirm,
  message,
  Form,
  Input,
  Space,
  Row,
  Col,
} from "antd";
import queryString from "query-string";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import CreateUserModal from "./create.user.modal";
import UpdateUserModal from "./update.user.modal";
import { deleteUser } from "@/utils/api";
import CheckAccess from "@/router/check.access";
import { ALL_PERMISSIONS } from "@/utils/permission.module";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, userOnchangeTable } from "../../redux/slice/userSlice";
import { UserCard } from "./user.card";

const UserTable = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const loading = useSelector((state) => state.user.isFetching);
  const meta = useSelector((state) => state.user.meta);
  const listUsers = useSelector((state) => state.user.result);
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState(null);

  const [updateData, setUpdateData] = useState(null);

  useEffect(() => {
    const initData = async () => {
      let query;
      if (searchValue) {
        query = buildQuery(searchValue);
      }
      else {
        query = buildQuery();
      }
      dispatch(fetchUser({ query }));
    };
    initData();
  }, [searchValue, meta.current, meta.pageSize]);


  const reloadTable = () => {
    const query = buildQuery();
    dispatch(fetchUser({ query }));
  };

  const confirmDelete = async (user) => {
    const res = await deleteUser(user._id);
    if (res.data) {
      reloadTable();
      message.success("Xoá người dùng thành công !");
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
  };

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
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      render: (_value, record) => {
        return <div>{record.phone}</div>;
      },
    },
    {
      title: "Quyền hạn",
      dataIndex: "role",
      key: "role",
      render: (_value, record) => {
        return <div>{record?.role?.name}</div>;
      },
    },
    {
      title: "Mã căn hộ",
      dataIndex: "apartments",
      key: "apartments",
      render: apartments => apartments.map(apartment => apartment.code).join(', ')
    },
    {
      title: "Hành động",
      render: (record) => {
        return (
          <Space>
            <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
              <CheckAccess
                FeListPermission={ALL_PERMISSIONS.USERS.UPDATE}
                hideChildren
              >
                <div>
                  <Button
                    danger
                    onClick={() => {
                      setIsUpdateModalOpen(true);
                      setUpdateData(record);
                    }}
                  >
                    Cập nhật
                  </Button>
                </div>
              </CheckAccess>
              <CheckAccess
                FeListPermission={ALL_PERMISSIONS.USERS.DELETE}
                hideChildren
              >
                <div>
                  <Popconfirm
                    title={`Bạn muốn xoá ${record.name} không ?`}
                    onConfirm={() => confirmDelete(record)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type={"primary"} danger>
                      Xoá
                    </Button>
                  </Popconfirm>
                </div>
              </CheckAccess>
            </div>
          </Space>
        );
      },
    },
  ];

  const [form] = Form.useForm();

  const buildQuery = (
    params,
    sort,
    filter,
    page = meta.current,
    pageSize = meta.pageSize
  ) => {
    const clone = { ...params };
    if (clone.phone) clone.phone = `/${clone.phone}/i`;
    if (clone.name) clone.name = `/${clone.name}/i`;

    let temp = queryString.stringify(clone);

    let sortBy = "";
    if (sort && sort.phone) {
      sortBy = sort.phone === "ascend" ? "sort=phone" : "sort=-phone";
    }
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
    setSearchValue(value)
    const query = buildQuery(value);
    dispatch(fetchUser({ query }));
  };

  return (
    <div style={{ paddingLeft: 30, paddingRight: 30 }}>
      <CheckAccess
        FeListPermission={ALL_PERMISSIONS.USERS.GET_PAGINATE}
      >
        <div style={{ padding: 20 }}>
          <Form
            name="search-form"
            onFinish={onSearch}
            layout="inline"
            form={form}
          >
            <Row gutter={[8, 8]} justify="center" wrap={true}>
              <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                <Form.Item label="SĐT" name="phone" >
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
              </Col >
              <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                <Form.Item label="Tên" name="name" >
                  <Input placeholder="Nhập tên" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={4}>
                <Button
                  icon={<SearchOutlined />}
                  htmlType="submit"
                >
                  Tìm kiếm
                </Button>
              </Col>
              <CheckAccess
                FeListPermission={ALL_PERMISSIONS.USERS.CREATE}
                hideChildren
              >
                <Col xs={24} sm={24} md={12} lg={12} xl={4}>
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    Thêm mới
                  </Button>
                </Col>
              </CheckAccess>
            </Row>
          </Form>
        </div>
        <Row>
          <Col xs={24} sm={24} md={24} lg={0} xl={0}>
            <UserCard
              listUsers={listUsers}
              loading={loading}
              reloadTable={reloadTable}
              meta={meta}
            />
          </Col>
          <Col xs={0} sm={0} md={0} lg={24} xl={24}>
            <Table
              size="small"
              columns={columns}
              dataSource={listUsers}
              rowKey={"_id"}
              loading={loading}
              bordered={true}
              pagination={{
                current: meta.current,
                pageSize: meta.pageSize,
                total: meta.total,
                showTotal: (total, range) =>
                  `${range[0]} - ${range[1]} of ${total} items`,
                onChange: (page, pageSize) =>
                  dispatch(
                    userOnchangeTable({
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
          </Col>
        </Row>
        <CreateUserModal
          reloadTable={reloadTable}
          isCreateModalOpen={isCreateModalOpen}
          setIsCreateModalOpen={setIsCreateModalOpen}
        />
        <UpdateUserModal
          updateData={updateData}
          reloadTable={reloadTable}
          isUpdateModalOpen={isUpdateModalOpen}
          setIsUpdateModalOpen={setIsUpdateModalOpen}
          setUpdateData={setUpdateData}
        />
      </CheckAccess>
    </div>
  );
};

export default UserTable;
