import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
// auth checker
import Checker from "./common/Checker";
// common
import LoginPage from "./pages/Login";
import Loading from "./common/Loading";
// admin
import AdminDashboard from "./admin components/dashboard/Dashboard";
import AdminRequestContactPage from "./pages/admin/initial request/RequestContactPage";
import FactorSettingsPage from "./pages/admin/factor setting/FactorSettingsPage";
// user
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
import ConditionsPage from "./pages/user/conditions/ConditionsPage";
import CreateFactorPage from "./pages/user/factors/CreateFactorPage";
import ReportFactorsPage from "./pages/user/reports/ReportFactorsPage";
import ChatPage from "./pages/user/taskmanager/ChatPage";
import MyTasksPage from "./pages/user/taskmanager/MyTasksPage";
import CreateNotePage from "./pages/user/taskmanager/CreateNotePage";
import ProjectsPage from "./pages/user/taskmanager/projects/ProjectsPage";
import BoardsPage from "./pages/user/taskmanager/projects/BoardsPage";
import BoardPage from "./pages/user/taskmanager/projects/BoardPage";
import RequestProductPage from "./pages/user/requests/RequestProductPage";
import RequestContactPage from "./pages/user/requests/RequestContactPage";
import MyRequestsPage from "./pages/user/requests/MyRequestsPage";
import UnitsPage from "./pages/user/units/UnitsPage";
import RejectedBuyFactorPage from "./pages/user/factors/RejectedBuyFactorPage";
import BuyFactorsPage from "./pages/user/factors/BuyFactorsPage";
import PermissionsPage from "./pages/admin/PermissionsPage";

export default function AllRoutes() {
  const userRole = useSelector((state) => state.userData.userRole);

  if (userRole === "user") {
    return (
      <div className="w-full flex">
        <Checker />

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* customers */}
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/customers/groups" element={<CustomerGroups />} />
          <Route path="/customers/roles" element={<CustomerRoles />} />
          {/* units */}
          <Route path="/units" element={<UnitsPage />} />
          {/* products */}
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/categories" element={<ProductCategories />} />
          <Route path="/products/creators" element={<ProductCreators />} />
          {/* prices */}
          <Route path="/prices" element={<PricesPage />} />
          <Route path="/prices/groups" element={<PriceGroups />} />
          {/* commissions */}
          <Route path="/commissions" element={<CommissionsPage />} />
          {/* factors */}
          <Route path="/factors/preFactors" element={<PreFactorsPage />} />
          <Route path="/factors/sell-factors" element={<FactorsPage />} />
          <Route
            path="/factors/sell-rejected"
            element={<RejectedFactorsPage />}
          />
          <Route path="/factors/buy-factors" element={<BuyFactorsPage />} />
          <Route
            path="/factors/buy-rejected"
            element={<RejectedBuyFactorPage />}
          />
          <Route path="/factors/create" element={<CreateFactorPage />} />
          <Route path="/factors/edit" element={<CreateFactorPage />} />
          {/* conditions */}
          <Route path="/conditions" element={<ConditionsPage />} />
          {/* reports */}
          <Route path="/reports/factors" element={<ReportFactorsPage />} />
          {/* requests */}
          <Route path="/requests/product" element={<RequestProductPage />} />
          <Route path="/requests/contact" element={<RequestContactPage />} />
          <Route path="/requests/myRequests" element={<MyRequestsPage />} />
          {/* warehouses */}
          <Route path="/warehouses" element={<WarehousesPage />} />
          {/* taskmanager */}
          <Route path="/taskmanager/chat" element={<ChatPage />} />
          <Route path="/taskmanager/projects" element={<ProjectsPage />} />
          <Route path="/taskmanager/projects/boards" element={<BoardsPage />} />
          <Route
            path="/taskmanager/projects/boards/board"
            element={<BoardPage />}
          />
          <Route path="/taskmanager/my-tasks" element={<MyTasksPage />} />
          <Route path="/taskmanager/create-note" element={<CreateNotePage />} />
        </Routes>
      </div>
    );
  } else if (userRole === "admin") {
    return (
      <div className="w-full flex">
        <Checker />

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/employees" element={<EmployeesPage />} />
          {/* customers */}
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/customers/groups" element={<CustomerGroups />} />
          <Route path="/customers/roles" element={<CustomerRoles />} />
          {/* permissions */}
          <Route path="/permissions" element={<PermissionsPage />} />
          {/* initial request */}
          <Route
            path="/requests/contact"
            element={<AdminRequestContactPage />}
          />
          {/* factor settings */}
          <Route path="/factor-settings" element={<FactorSettingsPage />} />
        </Routes>
      </div>
    );
  } else {
    return (
      <>
        <Checker />

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
