import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Table, Button, notification } from 'antd';

export default function Audit() {
  const { roleId, region, username } = JSON.parse(localStorage.getItem("token"))

  const [dataSource, setdataSource] = useState([]);
  useEffect(() => {
    const roleObj = {
      "1": "superadmin",
      "2": "admin",
      "3": "editor"
    }
    axios.get(`/news?auditState=1&_expand=category`).then(res => {
      const list = res.data
      console.log(list)
      setdataSource(roleObj[roleId] === "superadmin" ? list : [...list.filter(item => item.author === username), ...list.filter(item => item.region === region && roleObj[item.id] === "editor")])
    })
  }, [])

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
      title: "操作",
      render: (item) => {

        return <div>
          <Button type="primary" onClick={() => handlAudit(item, 2, 1)}>通过</Button>
          <Button type="primary" danger onClick={() => handlAudit(item, 3, 0)}>驳回</Button>

        </div>
      }
    }

  ]
  const handlAudit = (item, auditState, publishState) => {
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.patch(`/news/${item.id}`, {
      auditState: auditState,
      publishState: publishState
    }).then(() => {
      notification.info({
        message: `通知`,
        description: `你可以到【审核管理/审核列表】中查看信息`,
        placement: 'bottomRight',
      });
    })
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          pageSize: 4
        }}
        rowKey={item => item.id}
      />
    </div>
  )
}