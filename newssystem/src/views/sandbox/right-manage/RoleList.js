import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Tree } from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from "@ant-design/icons"
const { confirm } = Modal

export default function RoleList() {
  const [dataSource, setdataSource] = useState([]);
  const [rightList, setrightList] = useState([]);
  const [currentRights, setcurrentRights] = useState([]);
  const [currentId, setcurrentId] = useState(0);
  const [isModalOpen, setisModalOpen] = useState(false);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: "角色名称",
      dataIndex: "roleName"
    },
    {
      title: "操作",
      render: (item) => {

        return <div>
          <Button type="primary" danger shape="circle" onClick={() => confirmMethod(item)} icon={<DeleteOutlined />}></Button>
          <Button type="primary" shape="circle" icon={<EditOutlined onClick={() => {
            setisModalOpen(true)
            setcurrentRights(item.rights)
            setcurrentId(item.id)
          }} />}></Button>
        </div>
      }
    }
  ]
  useEffect(() => {
    axios.get("/roles").then(res => {
      console.log(res.data)
      setdataSource(res.data)
    })
  }, []);
  useEffect(() => {
    axios.get("/rights?_embed=children").then(res => {
      console.log(res.data)
      setrightList(res.data)
    })
  }, []);

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
    console.log(item)
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/roles/${item.id}`)
  }

  const handleOk = () => {
    console.log(currentRights)
    setisModalOpen(false)
    setdataSource(dataSource.map(item=>{
      if(item.id===currentId){
        return {
          ...item,
          rights:currentId
        }
      }
      return item
    }))
    axios.patch(`/roles/${currentId}`,{
      rights:currentRights
    })
  }
  const handleCancel = () => {
    setisModalOpen(false)
  }
  const onCheck = (checkedKeys, info) => {
    // console.log('onCheck', checkedKeys, info);
    setcurrentRights(checkedKeys.checked)
  };
  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        rowKey={(item) => item.id}
      ></Table>
      <Modal title="权限分配" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          onCheck={onCheck}
          checkStrictly={true}
          checkedKeys={currentRights}
          treeData={rightList}
        />
      </Modal>
    </div>

  )
}
