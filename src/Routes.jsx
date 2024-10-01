import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
// common
import LoginPage from "./pages/Login";
import Loading from "./common/Loading";
import Header from "./common/Header";
// admin
import AdminSideMenu from "./admin components/AdminSideMenu";
import AdminDashboard from "./admin components/dashboard/Dashboard";
import FactorSettingsPage from "./pages/admin/factor setting/FactorSettingsPage";
// user
import SideMenu from "./components/SideMenu";
import DashboardPage from "./pages/user/DashboardPage";
import CustomersPage from "./pages/user/customers/CustomersPage";
import EmployeesPage from "./pages/admin/EmployeesPage";
import CustomerGroups from "./pages/user/customers/CustomerGroups";
import CustomerRoles from "./pages/user/customers/CustomerRoles";
import ProductsPage from "./pages/user/products/ProductsPage";
import ProductCategories from "./pages/user/products/ProductCategories";
import ProductCreators from "./pages/user/products/ProductCreators";
import PricesPage from "./pages/user/prices/PricesPage";
import PriceGroups from "./pages/user/prices/PriceGroups";
import FactorsPage from "./pages/user/factors/FactorsPage";
import WarehousesPage from "./pages/user/warehouse/WarehousesPage";
import CommissionsPage from "./pages/user/commissions/CommissionsPage";
import RejectedFactorsPage from "./pages/user/factors/RejectedFactorsPage";
import PreFactorsPage from "./pages/user/factors/PreFactorsPage";
import InitialRequestPage from "./pages/user/factors/InitialRequestPage";
import ConditionsPage from "./pages/user/conditions/ConditionsPage";
import ConditionLimits from "./pages/user/conditions/ConditionLimits";
import CreateFactorPage from "./pages/user/factors/CreateFactorPage";
import FactorReportsPage from "./pages/user/factors/FactorReportsPage";

export default function AllRoutes() {
  const userRole = useSelector((state) => state.userData.userRole);

  if (userRole === "user") {
    return (
      <div className="w-full h-full flex flex-col">
        <Header />

        <div className="w-full flex">
          <SideMenu />

          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* customers */}
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/customers/groups" element={<CustomerGroups />} />
            <Route path="/customers/roles" element={<CustomerRoles />} />
            {/* products */}
            <Route path="/products" element={<ProductsPage />} />
            <Route
              path="/products/categories"
              element={<ProductCategories />}
            />
            <Route path="/products/creators" element={<ProductCreators />} />
            {/* prices */}
            <Route path="/prices" element={<PricesPage />} />
            <Route path="/prices/groups" element={<PriceGroups />} />
            {/* commissions */}
            <Route path="/commissions" element={<CommissionsPage />} />
            {/* requests */}
            <Route path="/requests/request" element={<InitialRequestPage />} />
            <Route path="/requests/initial" element={<InitialRequestPage />} />
            {/* factors */}
            <Route path="/factors/reports" element={<FactorReportsPage />} />
            <Route path="/factors/preFactors" element={<PreFactorsPage />} />
            <Route path="/factors/sell-factors" element={<FactorsPage />} />
            <Route
              path="/factors/sell-rejected"
              element={<RejectedFactorsPage />}
            />
            <Route path="/buy-factors" element={<FactorsPage />} />
            <Route
              path="/factors/buy-rejected"
              element={<RejectedFactorsPage />}
            />
            <Route path="/factors/create" element={<CreateFactorPage />} />
            <Route path="/factors/edit" element={<CreateFactorPage />} />
            {/* conditions */}
            <Route path="/conditions" element={<ConditionsPage />} />
            <Route path="/conditions/limits" element={<ConditionLimits />} />
            {/* warehouses */}
            <Route path="/warehouses" element={<WarehousesPage />} />
          </Routes>
        </div>
      </div>
    );
  } else if (userRole === "admin") {
    return (
      <div className="w-full h-full flex flex-col">
        <Header />

        <div className="w-full flex">
          <AdminSideMenu />

          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/employees" element={<EmployeesPage />} />
            {/* factor settings */}
            <Route path="/factor-settings" element={<FactorSettingsPage />} />
          </Routes>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <Header />

        <div className="w-full">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/*" element={<Loading />} />
          </Routes>
        </div>
      </>
    );
  }
}
