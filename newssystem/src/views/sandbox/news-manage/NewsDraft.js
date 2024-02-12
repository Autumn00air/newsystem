import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch,notification } from "antd"
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled, UploadOutlined } from "@ant-design/icons"
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

export default function NewsDraft(props) {
  const [dataSource, setdataSource] = useState([]);
  const { username } = JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
      console.log(`/news?author=${username}&auditState=0&_expand=category`)
      res.data.map(item => {
        item.key = item.id
        return item
      })
      setdataSource(res.data)
    })
  }, [username])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
      render: (key) => {
        return <Tag color="magenta">{key}</Tag>
      }
    },
    {
      title: '分类信息',
      dataIndex: 'category',
      render: (category) => {
        return category.title
      }
    },
    {
      title: "操作",
      render: (item) => {

        return <div>
          <Button type="primary" danger onClick={() => confirmMethod(item)} shape="circle" icon={<DeleteOutlined />}></Button>

          <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => {
            props.history.push(`/news-manage/update/${item.id}`)
          }}></Button>

          <Button type="primary" shape="circle" icon={<UploadOutlined />} onClick={() => handleCheck(item.id)}></Button>

        </div>
      }
    }
  ]

  const handleCheck = (id) => {
    axios.patch(`/news/${id}`, {
      auditState: 1
    }).then(res => {
      props.history.push("/audit-manage/list")
      notification.info({
        message: `通知`,
        description: `你可以到"审核列表"中查看信息`,
        placement: 'bottomRight',
      });
    })
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

    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/news/${item.id}`)

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
