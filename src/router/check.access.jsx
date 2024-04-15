import { useEffect, useState } from "react";
import { Result } from "antd";
import { useSelector } from "react-redux";

const CheckAccess = (props) => {
  //set default: hideChildren = false => vẫn render children
  // hideChildren = true => ko render children, ví dụ hide button (button này check quyền)
  const { FeListPermission, hideChildren = false } = props;
  const [allow, setAllow] = useState(true);

  const userPermissions = useSelector((state) => state.auth.user.permissions);

  useEffect(() => {
    if (userPermissions.length) {
      const check = userPermissions.find(
        (item) =>
          item.apiPath === FeListPermission.apiPath &&
          item.method === FeListPermission.method &&
          item.module === FeListPermission.module
      );
      if (check) {
        setAllow(true);
      } else
        setAllow(false);
    }
  }, [userPermissions]);

  console.log('hideChildren', hideChildren);

  return (
    <>
      {allow === true ? (
        <>{props.children}</>
      ) : (
        <>
          {hideChildren === false ? (
            <Result
              status="403"
              title="Truy cập bị từ chối"
              subTitle="Xin lỗi, bạn không có quyền hạn (permission) truy cập thông tin này"
            />
          ) : (
            <>
              {/* render nothing */}
            </>
          )}
        </>
      )}
    </>
  );
};

export default CheckAccess;
