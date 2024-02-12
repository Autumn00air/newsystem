import React, { useState } from 'react'
import { Layout, Button, theme, Dropdown, Avatar } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined, DownOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons'
import { withRouter } from 'react-router-dom'
import {connect} from "react-redux"

const { Header } = Layout

function TopHeader(props) {
  // const [collapsed, setCollapsed] = useState(false);
  const {role:{roleName},username} = JSON.parse(localStorage.getItem("token"))
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const onClick = ({ key }) => {
    if (key === '2') {
      // localStorage.removeItem("token")
      props.history.replace("/login")
      // console.log(props.history)
      console.log(`Click on item ${key}`);

    }
  };
  const items = [
    {
      key: '1',
      label: (<div>{roleName}</div>),
    },
    {
      key: '2',
      label: "退出"

    }
  ];

  return (
    <Header style={{ padding: 0, background: colorBgContainer }}>
      <Button
        type="text"
        icon={props.isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        // onClick={() => setCollapsed(!collapsed)}
        onClick={()=>props.changeCollaspsed()}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
        }}
      />
      <div style={{ float: "right" }}>
        <span>欢迎<span style={{color:"#1890ff"}}>{username}</span>回来</span>
        <Dropdown
          menu={{
            items,
            onClick
          }}
        >
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}

const mapStateToProps = ({CollApsedReducer:{isCollapsed}})=>{
  return {
    isCollapsed
  }
}
const mapDispatchToProps = {
  changeCollaspsed(){
    return {
      type:"change_collapsed"
    }
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(withRouter(TopHeader))