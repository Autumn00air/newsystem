import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal,Popover, Switch } from "antd"
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled} from "@ant-design/icons"
import { configConsumerProps } from 'antd/es/config-provider';
const { confirm } = Modal

function listhandle(list) {
  list.forEach(element => {
    if (element.children && element.children.length !== 0) {
      listhandle(element.children)
    }
    if (element.children && element.children.length === 0) {
      delete element.children
    }
  });
}

export default function RightList() {
  const [dataSource, setdataSource] = useState([]);

  useEffect(() => {
    axios.get("/rights?_embed=children").then(res => {
      listhandle(res.data)
      setdataSource(res.data)
    })
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => {
        return <Tag color="magenta">{key}</Tag>
      }
    },
    {
      title: "操作",
      render: (item) => {

        return <div>
          <Button type="primary" danger onClick={() => confirmMethod(item)} shape="circle" icon={<DeleteOutlined />}></Button>
          <Popover content={<div style={{textAlign:"center"}}>
            <Switch checked={item.pagepermisson} onChange={()=>switchMethod(item)}></Switch>
          </div>} title="配置项" trigger={item.pagepermisson===undefined?"":"click"}>
            <Button type="primary" shape="circle" disabled={item.pagepermisson===undefined} icon={<EditOutlined />}></Button>
          </Popover>
        </div>
      }
    }
  ]

  const switchMethod = (item)=>{
    item.pagepermisson = item.pagepermisson===1?0:1
    setdataSource([...dataSource])
    if(item.grade===1){
      axios.patch(`/rights/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    }else{
      axios.patch(`/children/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    }
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
    console.log(item)
    if (item.grade === 1) {
      setdataSource(dataSource.filter(data => data.id !== item.id))
      axios.delete(`/rights/${item.id}`)
    } else {
      var dataSourcetp = [...dataSource]
      dataSourcetp.forEach(element => {
        if (element.id === item.rightId) {
          element.children = element.children.filter((it1) => it1.id !== item.id)
        }
      });
      setdataSource(dataSourcetp)
      axios.delete(`/children/${item.id}`)
    }
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          pageSize: 4
        }}
      />
    </div>
  )
}
