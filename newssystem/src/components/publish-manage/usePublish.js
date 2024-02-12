import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { notification } from 'antd';

function usePublish(type) {
    const { username } = JSON.parse(localStorage.getItem("token"))
    const [dataSource, setdataSource] = useState([]);
    useEffect(() => {
        axios.get(`/news?author=${username}&publishState=${type}&_expand=category`).then(res => {
            console.log(res.data)
            setdataSource(res.data)
        })
    }, [username, type])
    const handlePublish = (id) => {
        console.log("ppp", id)
        setdataSource(dataSource.filter(item => item.id !== id))
        axios.patch(`/news/${id}`, {
            publishState: 2,
            publishTime:Date.now()
          }).then(() => {
            notification.info({
              message: `通知`,
              description: `你可以到【发布管理/已经发布】中查看信息`,
              placement: 'bottomRight',
            });
          })
    }
    const handleSunset = (id) => {
        console.log("sss", id)
        setdataSource(dataSource.filter(item => item.id !== id))
        axios.patch(`/news/${id}`, {
            publishState: 3
          }).then(() => {
            notification.info({
              message: `通知`,
              description: `你可以到【发布管理/已经下线】中查看信息`,
              placement: 'bottomRight',
            });
          })

    }
    const handleDelete = (id) => {
        console.log("ddd", id)
        setdataSource(dataSource.filter(item => item.id !== id))
        axios.delete(`/news/${id}`).then(() => {
            notification.info({
              message: `通知`,
              description: `你已经删除了已下线的新闻`,
              placement: 'bottomRight',
            });
          })
    }
    return {
        dataSource,
        handlePublish, handleSunset, handleDelete
    }
}

export default usePublish
