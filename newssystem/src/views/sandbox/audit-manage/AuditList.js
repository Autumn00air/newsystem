import React, { useEffect, useState } from 'react'
import axios from "axios"
import { Table, Button, Tag, notification } from 'antd'

export default function AuditList(props) {
  const { username } = JSON.parse(localStorage.getItem("token"))
  const [dataSource, setdataSource] = useState([]);
  const columns = [
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

    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => {
        return category.title
      }
    },
    {
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState) => {
        const colorList = ["", "orange", "green", "red"]
        const auditList = ["", "审核中", "已通过", "未通过"]
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
      }
    },
    {
      title: "操作",
      render: (item) => {

        return <div>
          {item.auditState === 1 && <Button type="primary" onClick={() => handleRevert(item)}>撤销</Button>}
          {item.auditState === 2 && <Button type="primary" danger onClick={() => handlePublished(item)} >发布</Button>}
          {item.auditState === 3 && <Button type="primary" onClick={() => handleUpdate(item)}>更新</Button>}
        </div>
      }
    }
  ]
  const handleRevert = (item) => {
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.patch(`/news/${item.id}`, {
      auditState: 0
    }).then(res => {

      notification.info({
        message: `通知`,
        description: `你可以到草稿箱中查看信息`,
        placement: 'bottomRight',
      });

    })
  }
  const handleUpdate = (item) => {
    props.history.push(`/news-manage/update/${item.id}`)
  }

  const handlePublished = (item) => {
    axios.patch(`/news/${item.id}`, {
      "publishState": 2,
      "publishTime":Date.now()
    }).then(res => {
      props.history.push("/publish-manage/published")
      notification.info({
        message: `通知`,
        description: `你可以到【发布管理/已经发布】中查看信息`,
        placement: 'bottomRight',
      });
    })
  }
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
      // console.log(res.data)
      setdataSource(res.data)
    })
  }, [username])
  return (
    <Table dataSource={dataSource} columns={columns}
      pagination={{
        pageSize: 4
      }}
      rowKey={item => item.id}
    />
  )
}
