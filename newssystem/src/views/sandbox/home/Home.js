import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'antd'
// import { AndroidOutlined } from '@ant-design/icons'
import axios from 'axios'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import * as echarts from "echarts"
import _ from "lodash"
const { Meta } = Card;
export default function Home() {
  // const ajax=()=>{
  // axios.get("/posts/1").then(res=>{
  //   console.log(res.data)
  // })

  // axios.post("/posts",{
  //   "id": 2, "title": "ttttt2", "author": "tyyyyyy"
  // }).then(res=>{
  //   console.log(res.data)
  // })

  //axios.put会全覆盖
  // axios.patch("/posts/1",{
  //   "author": "huangxinzi"
  // }).then(res=>{
  //   console.log(res.data)
  // })

  // axios.delete("/posts/2").then(res=>{
  //   console.log(res.data)
  // })

  // axios.get("/users?_embed=children").then(res=>{
  //   console.log(res.data)
  // })
  const [open, setopen] = useState(false)
  const [viewList, setviewList] = useState([])
  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`).then(res => {
      // console.log(res.data)
      setviewList(res.data)
    })
  }, [])
  const [starList, setstarList] = useState([])
  const [allList, setallList] = useState([])
  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6`).then(res => {
      // console.log(res.data)
      setstarList(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category").then((res) => {
      // console.log(_.groupBy(res.data, item => item.category.title))
      renderBar(_.groupBy(res.data, item => item.category.title))
      setallList(res.data)
    })
    return () => {
      window.onresize = null
    }
  }, [])
  const renderBar = (obj) => {
    var myChart = echarts.init(barRef.current);

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '新闻分类图示'
      },
      tooltip: {},
      legend: {
        data: ['数量']
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          rotate: "45",
          // interval:0
        }
      },
      yAxis: {
        minInterval: 1
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(obj).map(item => item.length)
        }
      ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    window.onresize = () => {
      myChart.resize()
    }
  }
  const renderpie = (obj) => {
    var currentList = allList.filter(item=>item.author===username)
    var groupObj = _.groupBy(currentList,item=>item.category.title)
    var myChart = echarts.init(pieRef.current);
    var option;
    var list = []
    for(var i in groupObj){
      list.push({
        name:i,
        value:groupObj[i].length
      })
    }

    option = {
      title: {
        text: '当前用户新闻分类图示',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    option && myChart.setOption(option);
  }
  // const data = [
  //   'Racing car sprays burning fuel into crowd.',
  //   'Japanese princess to wed commoner.',
  //   'Australian walks 100km after outback crash.',
  //   'Man charged over missing wedding girl.',
  //   'Los Angeles battles huge wildfires.',
  // ];
  const { username, role: { roleName }, region } = JSON.parse(localStorage.getItem("token"))
  const barRef = useRef()
  const pieRef = useRef()
  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" size="small" bordered={false}>
            <List
              s dataSource={viewList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户最多点赞" size="small" bordered={false}>
            <List
              s dataSource={starList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small" bordered={false} cover={
            <img
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            />
          }
            actions={[
              <SettingOutlined key="setting" onClick={() => {
                // new Promise((resolve, reject) => {
                //   resolve();
                // })
                //   .then((result) => {
                //     setopen(true)
                //   })
                //   .then((result) => {
                //     renderpie()
                //   })
                Promise.all([
                  setopen(true)
                ]).then(()=>{
                  renderpie()
                })
                //react18貌似上面两种可行，下面不可行
                // setTimeout(() => {
                //   setopen(true)
                //   renderpie()
                // }, 0);
              }} />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />}
              title={username}
              description={<div>
                <b>{region ? region : "全球"}</b>
                <span style={{ padding: "10px" }}>{roleName}</span>
              </div>}
            />
          </Card>
        </Col>
      </Row>

      <Drawer title="个人新闻分类" placement="right" width="600px" onClose={() => setopen(false)} open={open}>
        <div ref={pieRef} style={{
          height: "100%",
          width: "500px",
          marginTop: "30px"
        }}></div>
      </Drawer>

      <div ref={barRef} style={{
        height: "400px",
        width: "100%",
        marginTop: "30px"
      }}></div>
    </div>
    // <div><Button type="primary" ghost icon={<AndroidOutlined />} onClick={ajax}>button</Button></div>

  )
}
