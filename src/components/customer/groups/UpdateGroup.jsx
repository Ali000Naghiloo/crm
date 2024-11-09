import {
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  TreeSelect,
} from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import useHttp from "../../../hooks/useHttps";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function compareChildrens(data) {
  // Create a map to quickly lookup groups by ID
  const groupMap = new Map();
  data.forEach((group) => groupMap.set(group.id, group));

  // Iterate over the data, creating the child relationships
  data.forEach((group) => {
    const parentGroup = groupMap.get(group.parentGroupId);
    if (parentGroup) {
      parentGroup.children = parentGroup.children || [];
      parentGroup.children.push(group);
    }
  });

  // Return the root groups (those without parents)
  return data.filter((group) => !group.parentGroupId);
}

export default function UpdateGroup({
  open,
  setOpen,
  getNewList,
  data,
  hasChildren,
}) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [customerList, setCustomerList] = useState(null);
  const [groupList, setGroupList] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const allEnum = useSelector((state) => state.allEnum.allEnum);

  const validationSchema = yup.object().shape({
    groupName: yup.string().required("این فیلد را پر کنید"),
  });

  const validation = useFormik({
    initialValues: {
      id: 0,
      groupName: "",
      description: "",
      parentGroupId: null,
      customersGroups: [],
    },
    validationSchema,
    onSubmit: (values) => {
      handleEdit(values);
    },
  });

  const handleClose = () => {
    if (!loading) {
      setOpen(false);
      validation.resetForm();
    }
  };

  const handleEdit = async (values) => {
    setLoading(true);
    const formData = {
      ...values,
      id: values?.id,
      customersGroups:
        values?.customersGroups && values?.customersGroups?.length !== 0
          ? values?.customersGroups?.map((i) => {
              return {
                customerId: i,
              };
            })
          : [],
    };

    await httpService
      .post("/CustomerGroup/EditCustomerGroup", formData)
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          toast.success("با موفقیت ویرایش شد");
          handleClose();
        }
      })
      .catch(() => {});

    getNewList();
    setLoading(false);
  };

  const handleGetCustomerList = async () => {
    setLoading(true);
    let datas = [];

    await httpService
      .get("/Customer/GetAllCustomers")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          res.data?.customerList?.map((cu) => {
            datas.push({ label: cu.customerName, value: cu.customerId });
          });
        }
      })
      .catch(() => {});

    setCustomerList(datas);
    setLoading(false);
  };

  const handleGetGroupList = async () => {
    setLoading(true);
    let datas = [];

    await httpService
      .get("/CustomerGroup/CustomerGroupsForCreate")
      .then((res) => {
        if (res.status === 200 && res.data?.code == 1) {
          datas = res.data?.customerGroupViewModelList;
        }
      })
      .catch(() => {});

    setGroupList(datas);
  };

  const handleDelete = async (id) => {
    setLoading(true);

    await httpService
      .get("/CustomerGroup/DeleteCustomerGroup", {
        params: { customerGroupId: data?.id },
      })
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1)
          toast.success("با موفقیت حذف شد");
      })
      .catch(() => {});

    setLoading(false);
    handleClose();
    getNewList();
  };

  const handleSelectAll = (e) => {
    if (e?.target?.checked) {
      validation.setFieldValue(
        "customersGroups",
        customerList?.map((cu) => cu?.value)
      );
      setSelectAll(true);
    }
  };

  useEffect(() => {
    if (open) {
      handleGetCustomerList();
      handleGetGroupList();
    }
  }, [open]);

  useEffect(() => {
    if (data) {
      validation.setFieldValue("id", data?.id);
      validation.setFieldValue("groupName", data?.groupName);
      validation.setFieldValue("parentGroupId", data?.parentGroupId);
      validation.setFieldValue(
        "customersGroups",
        data?.customersGroups?.map((data) => data?.customerId)
      );
      validation.setFieldValue("description", data?.description);
    }
  }, [data]);

  return (
    <>
      <Modal
        open={open}
        loading={loading}
        onCancel={handleClose}
        onClose={handleClose}
        title={`ویرایش گروه : ${data ? data?.groupName : ""}`}
        footer={
          <div className="w-full flex gap-3 justify-between pt-5">
            <Popconfirm
              title="آیا از حذف این گروه اطمینان دارید؟"
              okText="بله"
              cancelText="خیر"
              onConfirm={handleDelete}
            >
              <Button type="primary" danger>
                حذف
              </Button>
            </Popconfirm>
            <div className="flex items-center justify-center gap-2">
              <Button type="primary" danger onClick={handleClose}>
                لغو
              </Button>
              <Button
                onClick={validation.submitForm}
                type="primary"
                disabled={loading}
                loading={loading}
              >
                تایید
              </Button>
            </div>
          </div>
        }
      >
        <Form
          onFinish={validation.handleSubmit}
          className="w-full flex flex-wrap gap-4"
        >
          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>نام گروه اشخاص</span>
            <Input
              value={validation.values.groupName}
              name="groupName"
              onChange={validation.handleChange}
              className="w-full"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.groupName && validation.errors.groupName && (
              <span className="text-error text-xs">
                {validation.errors.groupName}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>اشخاص این گروه</span>
            <Select
              disabled={hasChildren}
              allowClear
              optionFilterProp="label"
              mode="multiple"
              maxTagCount={3}
              options={customerList}
              value={validation.values.customersGroups}
              onChange={(e) => {
                validation.setFieldValue("customersGroups", e);
              }}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.customersGroups &&
              validation.errors.customersGroups && (
                <span className="text-error text-xs">
                  {validation.errors.customersGroups}
                </span>
              )}
            <div>
              <span>انتخاب همه اشخاص : </span>
              <Checkbox
                disabled={hasChildren}
                checked={selectAll}
                onChange={handleSelectAll}
              ></Checkbox>
            </div>
          </div>

          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>گروه والد</span>
            <Select
              fieldNames={{ label: "groupName", value: "id" }}
              allowClear
              optionFilterProp="groupName"
              showSearch
              options={groupList}
              treeDefaultExpandAll
              value={validation.values.parentGroupId}
              onChange={(e) => {
                validation.setFieldValue("parentGroupId", e);
              }}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.parentGroupId &&
              validation.errors.parentGroupId && (
                <span className="text-error text-xs">
                  {validation.errors.parentGroupId}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>توضیحات</span>
            <Input.TextArea
              value={validation.values.description}
              name="description"
              onChange={validation.handleChange}
              className="w-full"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.description &&
              validation.errors.description && (
                <span className="text-error text-xs">
                  {validation.errors.description}
                </span>
              )}
          </div>
        </Form>
      </Modal>
    </>
  );
}
