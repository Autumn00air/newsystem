import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Modal, Switch, Form, Input, Select } from "antd"
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from "@ant-design/icons"
import UserForm from '../../../components/user-manage/UserForm';
const { confirm } = Modal

export default function UserList() {
  const [dataSource, setdataSource] = useState([]);
  const [roleList, setdroleList] = useState([]);
  const [regionList, setregionList] = useState([]);
  const [open, setopen] = useState(false);
  const [updateopen, setupdateopen] = useState(false);
  const [isUpdateDisabled, setisUpdateDisabled] = useState(false);
  const [current, setcurrent] = useState(null)
  const addForm = useRef(null)
  const updateForm = useRef(null)

  const { roleId, region, username } = JSON.parse(localStorage.getItem("token"))

  useEffect(() => {
    const roleObj = {
      "1": "superadmin",
      "2": "admin",
      "3": "editor"
    }
    axios.get("/users?_expand=role").then(res => {
      const list = res.data
      console.log("one", list)
      setdataSource(roleObj[roleId] === "superadmin" ? list : [...list.filter(item => item.username === username), ...list.filter(item => item.region === region && roleObj[item.id] === "editor")])
    })
  }, [roleId, region, username])
  useEffect(() => {
    axios.get("/regions").then(res => {
      const list = res.data
      console.log("region", list)
      setregionList(list)
    })
  }, [])
  useEffect(() => {
    axios.get("/roles").then(res => {
      const list = res.data
      console.log("one", list)
      setdroleList(list)
    })
  }, [])


  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
        ...regionList.map(item => ({
          text: item.title,
          value: item.value
        })),
        {
          text: "全球",
          value: "全球"
        }
      ],
      onFilter: (value, item) => {
        if (value === "全球") {
          return item.region === ""
        }
        return item.region === value
      },
      render: (region) => {
        return <b>{region === "" ? "全球" : region}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => role?.roleName
    },
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default} onChange={() => { handleChange(item) }}></Switch>
      }
    },
    {
      title: "操作",
      render: (item) => {

        return <div>
          <Button type="primary" danger onClick={() => confirmMethod(item)} disabled={item.default} shape="circle" icon={<DeleteOutlined />}></Button>
          <Button type="primary" shape="circle" disabled={item.default} icon={<EditOutlined />} onClick={() => handleUpdate(item)}></Button>
        </div>
      }
    }
  ]

  const handleChange = (item) => {
    console.log(item)
    item.roleState = !item.roleState
    setdataSource([...dataSource])
    axios.patch(`/users/${item.id}`, {
      roleState: item.roleState
    })
  }

  const handleUpdate = (item) => {
    // setTimeout(() => {
    //   updateForm.current.setFieldsValue({ ...item, title: item.username })
    // },1)
    // setupdateopen(true)
    // setTimeout(() => {
    //   setupdateopen(true)
    //   updateForm.current.setFieldsValue({ ...item, title: item.username })
    // }, 1)
    const promise = new Promise((resolve, reject) => {
      resolve(); // 解析 Promise
    });
    promise
      .then(() => {
        setupdateopen(true);
      })
      .then(() => {
        if (item.roleId === 1) {
          setisUpdateDisabled(true)
        } else {
          setisUpdateDisabled(false)
        }
      })
      .then(() => {
        updateForm.current.setFieldsValue({ ...item, title: item.username });
      });
    setcurrent(item)
  }
  const confirmMethod = (item) => {
    confirm({
      title: 'Are you sure delete this task?',
      icon: <ExclamationCircleFilled />,
      // content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',

      cancelText: 'No',
      onOk() {
        deleteMethod(item)
      },
      onCancel() {
        console.log(item)
        console.log('Cancel');
      },
    });
  }
  const deleteMethod = (item) => {
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/users/${item.id}`)
  }
  const addFormOk = () => {
    addForm.current.validateFields().then(value => {
      setopen(false)
      addForm.current.resetFields()
      const myvalue = value
      myvalue.username = myvalue.title
      delete myvalue.title
      axios.post(`/users`, {
        ...myvalue,
        "roleState": true,
        "default": false
      }).then(res => {
        console.log(res.data)
        setdataSource([...dataSource, res.data])
        axios.get("/users?_expand=role").then(res => {
          const list = res.data
          console.log("one", list)
          setdataSource(list)
        })
      })
    }).catch(err => {
      console.log(err)
    })
  }

  const updateFormOk = () => {
    updateForm.current.validateFields().then(value => {
      setupdateopen(false)
      updateForm.current.resetFields()
      const myvalue = value
      myvalue.username = myvalue.title
      delete myvalue.title
      console.log(value)
      axios.patch(`/users/${current.id}`, {
        ...myvalue
      }).then(res => {
        console.log(res.data)
        setdataSource([...dataSource, res.data])
        axios.get("/users?_expand=role").then(res => {
          const list = res.data
          console.log("one", list)
          setdataSource(list)
        })
      })

    })
  }

  return (
    <div>
      <Button type='primary' onClick={() => {
        setopen(true)
      }}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          pageSize: 4
        }}
        rowKey={item => item.id}
      />
      <Modal
        open={open}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setopen(false)
        }}
        onOk={() => {
          // console.log("add",addForm)
          addFormOk()
        }}
      >
        <UserForm regionList={regionList} roleList={roleList}
          ref={addForm}
        ></UserForm>
      </Modal>
      <Modal
        open={updateopen}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setupdateopen(false)
          setisUpdateDisabled(!isUpdateDisabled)
        }}
        onOk={() => {
          // console.log("add",addForm)
          updateFormOk()
        }}
      >
        <UserForm regionList={regionList} roleList={roleList}
          ref={updateForm} isUpdate={true} isUpdateDisabled={isUpdateDisabled}
        ></UserForm>
      </Modal>
    </div>

  )
}
