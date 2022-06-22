import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "antd";
import { BreadcrumbHelpers, FieldHelpers } from "../../utility/Helpers";
import { Content } from "antd/lib/layout/layout";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useDispatch, useSelector } from "react-redux";
// import { logout } from "../../redux/actions/authAction";
import { getAction } from "../../redux/actions/readAction";
import { createAction } from "../../redux/actions/createAction";
import { DeleteOutlined } from "@ant-design/icons";
import { EditOutlined } from "@ant-design/icons";
import { deleteAction } from "../../redux/actions/deleteAction";
import { updateAction } from "../../redux/actions/updateAction";
import { uploadImage } from "./../../utility/uploadImage";
import {
  DELETE_PROJECT,
  UPDATE_PROJECT,
  GET_PROJECT,
  CREATE_PROJECT,
} from "./../../redux/actions/types";

export const Project = () => {
  const [createVisible, setCreateVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedID, setSelectedID] = useState(null);
  const [selectedEditID, setselectedEditID] = useState(null);
  const [name, setName] = useState("");
  const [nameRu, setNameRu] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionRu, setDescriptionRu] = useState("");
  const [attachment, setAttachment] = useState(null);

  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { data } = useSelector((state) => state.projectReducer);

  const onChange = async (e) => {
    setName(e.target.form[1].value)
    setNameRu(e.target.form[2].value)
    setDescription(e.target.form[3].value)
    setDescriptionRu(e.target.form[4].value)
    setAttachment(e.target.files[0]);
  };

  useEffect(() => {
    dispatch(getAction("project", GET_PROJECT));
  }, [dispatch]);

  const showModal = (id) => {
    setVisible(true);
    setSelectedID(id);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    dispatch(deleteAction("project", DELETE_PROJECT, selectedID));
    setTimeout(() => {
      setVisible(false);
      setConfirmLoading(false);
      dispatch(getAction("project", GET_PROJECT));
    }, 1000);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const showEditModal = (data) => {
    setEditVisible(true);
    setselectedEditID(data);
    setName(data.name);
    setNameRu(data.nameRu);
    setDescription(data.description);
    setDescriptionRu(data.descriptionRu);
  };

  const editHandleOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        setEditVisible(false);
        dispatch(
          updateAction("project", UPDATE_PROJECT, selectedEditID.id, values)
        );
        dispatch(getAction("project", GET_PROJECT));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const editHandleCancel = () => {
    setEditVisible(false);
  };

  const showCreateModal = () => {
    setCreateVisible(true);
  };

  const createHandleOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        setCreateVisible(false);
        uploadImage(attachment).then((res) => {
          dispatch(
            createAction("project", CREATE_PROJECT, {
              name: values.name,
              nameRu: values.nameRu,
              description: values.description,
              descriptionRu: values.descriptionRu,
              attachmentId: res.attachmentId,
            })
          );
          dispatch(getAction("project", GET_PROJECT));
        });
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const createHandleCancel = () => {
    setCreateVisible(false);
  };

  const columns = [
    { title: "Nom Uz", dataIndex: "name", key: "name" },
    { title: "Nom Ru", dataIndex: "nameRu", key: "nameRu" },
    { title: "Tavsif Uz", dataIndex: "description", key: "description" },
    { title: "Tavsif Ru", dataIndex: "descriptionRu", key: "description" },
    {
      title: "Rasm",
      dataIndex: "attachmentId",
      key: "attachmentId",
      render: (text, record) => {
        return (
          <div>
            <img
              className="tableImg"
              src={process.env.REACT_APP_API_URL || "https://backbuild.softcity.uz" + record.attachment.url}
              alt={"rasm yo"}
            />
          </div>
        );
      },
    },
    {
      title: (
        <>
          <Button type="primary" onClick={showCreateModal}>
            <AddBoxIcon />
          </Button>
          <Modal
            title={"Yaratish"}
            visible={createVisible}
            onOk={createHandleOk}
            onCancel={createHandleCancel}
            okText={"yaratish"}
            cancelText={"bekor qilish"}
            htmlType="submit"
          >
            <Form
              form={form}
              layout="vertical"
              name="form_in_modal"
              initialValues={{
                modifier: "public",
              }}
              fields={[
                {
                  name: ["name"],
                  value: name,
                },
                {
                  name: ["nameRu"],
                  value: nameRu,
                },
                {
                  name: ["description"],
                  value: description,
                },
                {
                  name: ["descriptionRu"],
                  value: descriptionRu,
                },
                {
                  name: ["attachment"],
                  value: "",
                },
              ]}
            >
              <input type="file" name="attachment" onChange={onChange} />
              <FieldHelpers
                label="Nom Uz"
                name="name"
                message="Iltimos Nom Uz qatorini yo'ldiring!"
              />
              <FieldHelpers
                label="Nom Ru"
                name="nameRu"
                message="Iltimos Nom Ru qatorini yo'ldiring!"
              />
              <FieldHelpers
                label="Tavsif Uz"
                name="description"
                message="Iltimos Tavsif Uz qatorini yo'ldiring!"
              />
              <FieldHelpers
                label="Tavsif Ru"
                name="descriptionRu"
                message="Iltimos Tavsif Ru qatorini yo'ldiring!"
              />
            </Form>
          </Modal>
        </>
      ),
      dataIndex: "",
      key: "x",
      render: (text) => (
        <>
          <Button type="danger" onClick={(e) => showModal(text.id)}>
            <DeleteOutlined />
          </Button>
          <Button type="primary" onClick={(e) => showEditModal(text)}>
            <EditOutlined />
          </Button>
          <Modal
            title={"O'chirish"}
            visible={visible}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            okText={"o'chirish"}
            okType={"danger"}
            cancelText={"bekor qilish"}
          >
            <h2>Haqiqatan ham bu ma'lumotni o'chirib tashlamoqchimisiz?</h2>
            <p>
              Agar siz ushbu ma'lumotlarni o'chirib tashlasangiz, qayta
              tiklanmaydi
            </p>
          </Modal>
          <Modal
            title={"Tahrirlash"}
            visible={editVisible}
            onOk={editHandleOk}
            onCancel={editHandleCancel}
            okText={"tahrirlash"}
            cancelText={"bekor qilish"}
          >

            <Form
              form={form}
              layout="vertical"
              name="name"
              initialValues={{
                modifier: "public",
              }}
              fields={[
                {
                  name: ["name"],
                  value: name,
                },
                {
                  name: ["nameRu"],
                  value: nameRu,
                },
                {
                  name: ["description"],
                  value: description,
                },
                {
                  name: ["descriptionRu"],
                  value: descriptionRu,
                },
              ]}
            >
              <FieldHelpers
                label="Nom Uz"
                name="name"
                message="Iltimos Nom Uz qatorini yo'ldiring!"
              />
              <FieldHelpers
                label="Nom Ru"
                name="nameRu"
                message="Iltimos Nom Ru qatorini yo'ldiring!"
              />
              <FieldHelpers
                label="Tavsif Uz"
                name="description"
                message="Iltimos Tavsif Uz qatorini yo'ldiring!"
              />
              <FieldHelpers
                label="Tavsif Ru"
                name="descriptionRu"
                message="Iltimos Tavsif Ru qatorini yo'ldiring!"
              />
            </Form>
          </Modal>
        </>
      ),
    },
  ];

  return (
    <>
      <Content style={{ margin: "0 16px" }}>
        <BreadcrumbHelpers to={"project"} from={"home"} />

        <Table columns={columns} dataSource={data} />
      </Content>
    </>
  );
};
