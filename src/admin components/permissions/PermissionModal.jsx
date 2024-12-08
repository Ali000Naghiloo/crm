import { Button, Form, Input, Modal, Select } from "antd";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import useHttp from "../../hooks/useHttps";
import { toast } from "react-toastify";

export default function CreatePermission({ open, setOpen, data, getNewList }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [groupList, setGroupList] = useState(null);
  const [claimList, setCalimList] = useState(null);
  const validationSchema = yup.object().shape({});

  const validation = useFormik({
    initialValues: {
      menuAccessGroupId: null,
      menuAccessGroupName: "",
      menuAccessGroupAccessClaims: [],
      menuAccessGroupCustomerGroups: [],
    },

    validationSchema,

    onSubmit: (values) => {
      if (data) {
        handleEdit(values);
      } else {
        handleCreate(values);
      }
    },
  });

  const handleClose = () => {
    setOpen(false);
    validation.resetForm();
    getNewList();
  };

  const handleCreate = async (values) => {
    setLoading(true);
    const formData = {
      ...values,
      menuAccessGroupAccessClaims:
        values && values?.length
          ? values?.menuAccessGroupAccessClaims.map((i) => {
              return {
                accessClaimId: i,
              };
            })
          : [],
      menuAccessGroupCustomerGroups:
        values && values?.length
          ? values?.menuAccessGroupCustomerGroups.map((i) => {
              return {
                customerGroupId: i,
              };
            })
          : [],
    };

    await httpService
      .post("/AccessClaim/CreateMenuAccessGroup", formData)
      .then((res) => {
        if (res.status == 200 && res.data?.code == 1) {
          toast.success("با موفقیت ایجاد شد");
          handleClose();
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  const handleEdit = async (values) => {
    setLoading(true);
    const formData = {
      ...values,
      menuAccessGroupAccessClaims:
        values && values?.length
          ? values?.menuAccessGroupAccessClaims.map((i) => {
              return {
                accessClaimId: i,
              };
            })
          : [],
      menuAccessGroupCustomerGroups:
        values && values?.length
          ? values?.menuAccessGroupCustomerGroups.map((i) => {
              return {
                customerGroupId: i,
              };
            })
          : [],
    };

    await httpService
      .post("/AccessClaim/EditMenuAccessGroup", formData)
      .then((res) => {
        if (res.status == 200 && res.data?.code == 1) {
          toast.success("با موفقیت ایجاد شد");
          handleClose();
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  const handleGetCustomerGroupList = async () => {
    setLoading(true);
    let datas = [];

    const pushData = (data) => {
      datas.push({
        label: cu.groupName,
        value: cu.id,
        children: data?.subGroup ? pushData(data?.subGroup) : [],
      });
    };

    await httpService
      .get("/CustomerGroup/CustomerGroups")
      .then((res) => {
        if (res.status === 200 && res.data?.code == 1) {
          res.data?.customerGroupViewModelList?.map((cu, index) => {
            datas.push({
              ...cu,
              key: index,
            });
          });
        }
      })
      .catch(() => {});

    setGroupList(datas);
    setLoading(false);
  };
  const handleGetAccessClaimList = async () => {
    setLoading(true);
    let datas = [];

    const pushData = (data) => {
      datas.push({
        label: cu.groupName,
        value: cu.id,
        children: data?.subGroup ? pushData(data?.subGroup) : [],
      });
    };

    await httpService
      .get("/AccessClaim/AccessClaims")
      .then((res) => {
        if (res.status === 200 && res.data?.code == 1) {
          res.data?.accessClaims?.map((cl, index) => {
            datas.push({
              ...cl,
              value: cl.claimId,
              label: cl.description,
              key: index,
            });
          });
        }
      })
      .catch(() => {});

    setCalimList(datas);
    setLoading(false);
  };

  useEffect(() => {
    handleGetAccessClaimList();
    handleGetCustomerGroupList();
  }, []);

  useEffect(() => {
    if (data) {
      validation.setValues({
        menuAccessGroupId: data?.menuAccessGroupId,
        menuAccessGroupName: data?.menuAccessGroupName,
        menuAccessGroupAccessClaims: data?.menuAccessGroupAccessClaims,
        menuAccessGroupCustomerGroups: data?.menuAccessGroupCustomerGroups,
      });
    }
  }, [data]);

  return (
    <>
      <Modal
        open={open}
        onCancel={handleClose}
        footer={
          <div className="flex justify-end items-center gap-1">
            <Button onClick={handleClose} danger type="primary">
              لغو
            </Button>
            <Button
              onClick={validation.submitForm}
              type="primary"
              loading={loading}
              disabled={loading}
            >
              ثبت
            </Button>
          </div>
        }
        title={data ? "ویرایش گروه سطح دسترسی" : "ایجاد گروه سطح دسترسی"}
        className="w-full lg:w-[950px]"
      >
        <Form
          onFinish={validation.handleSubmit}
          className="flex flex-wrap gap-5 py-10"
        >
          <div className="w-full flex flex-col items-center">
            <span>عنوان گروه دسترسی</span>
            <Input
              name="menuAccessGroupName"
              onChange={validation.handleChange}
              value={validation.values.menuAccessGroupName}
              className="w-[300px] mx-auto"
              placeholder="نام گروه سطح دسترسی..."
            />
            {validation.touched.menuAccessGroupName &&
              validation.errors.menuAccessGroupName && (
                <span className="text-error text-xs">
                  {validation.errors.menuAccessGroupName}
                </span>
              )}
          </div>

          <div className="flex flex-col mx-auto">
            <span>گروه های اشخاص این گروه سطح دسترسی : </span>
            <Select
              mode="multiple"
              fieldNames={{ label: "groupName", value: "id" }}
              options={groupList}
              onChange={(e) => {
                validation.setFieldValue("menuAccessGroupCustomerGroups", e);
              }}
              value={validation.values.menuAccessGroupCustomerGroups}
              className="w-[300px] mx-auto"
              placeholder="گروه های اشخاص این سطح دسترسی..."
            />
            {validation.touched.menuAccessGroupCustomerGroups &&
              validation.errors.menuAccessGroupCustomerGroups && (
                <span className="text-error text-xs">
                  {validation.errors.menuAccessGroupCustomerGroups}
                </span>
              )}
          </div>

          <div className="flex flex-col mx-auto">
            <span>بخش های در دسترس : </span>
            <Select
              mode="multiple"
              options={claimList}
              onChange={(e) => {
                validation.setFieldValue("menuAccessGroupAccessClaims", e);
              }}
              value={validation.values.menuAccessGroupAccessClaims}
              className="w-[300px] mx-auto"
              placeholder="گروه های اشخاص این سطح دسترسی..."
            />
            {validation.touched.menuAccessGroupAccessClaims &&
              validation.errors.menuAccessGroupAccessClaims && (
                <span className="text-error text-xs">
                  {validation.errors.menuAccessGroupAccessClaims}
                </span>
              )}
          </div>
        </Form>
      </Modal>
    </>
  );
}
