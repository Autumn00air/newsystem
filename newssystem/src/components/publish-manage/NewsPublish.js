import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal,Popover, Switch } from "antd"
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled} from "@ant-design/icons"
import { configConsumerProps } from 'antd/es/config-provider';
const { confirm } = Modal


export default function NewsPublisht(props) {

  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title,item) => {
        // console.log(`#/news-manage/preview/${item.id}`)
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
        return <Tag color="magenta">{category.title}</Tag>
      }
    },
    {
      title: "操作",
      render: (item) => {

        return <div>
          {props.button(item.id)}
          
        </div>
      }
    }
  ]

 
  
  return (
    <div>
      <Table dataSource={props.dataSource} columns={columns}
        pagination={{
          pageSize: 4
        }}
        rowKey={item=>item.id}
      />
    </div>
  )
}
