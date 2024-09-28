import { Breadcrumb } from "antd";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function PageRoutes() {
  const routes = useSelector((state) => state.pageRoutes.pageRoutes);

  useEffect(() => {
    // console.log(routes);
  }, [routes]);

  if (routes && routes?.length !== 0)
    return (
      <>
        <div className="w-full flex items-center">
          <Breadcrumb>
            {routes.map((route, index) => (
              <Breadcrumb.Item key={index}>{route?.label}</Breadcrumb.Item>
            ))}
          </Breadcrumb>
        </div>
      </>
    );
}
