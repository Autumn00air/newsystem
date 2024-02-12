import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd'
import {withRouter} from "react-router-dom"
import "./index.css"
import axios from 'axios'
import {connect} from "react-redux"
const { Sider } = Layout

// function getItem(label, key, icon, children, type) {
//   return {
//     key,
//     icon,
//     children,
//     label,
//     type,
//   };
// }

// const myitems = [{ label: '首页', key: '/home', icon: <UserOutlined /> },
// { label: '用户管理', key: '/user-manage', icon: <VideoCameraOutlined /> },
// {
//   label: '权限管理', key: '/right-manage', icon: <UploadOutlined />, children: [
//     { label: '角色列表', key: '/right-manage/role/list' },
//     { label: '用户列表', key: '/right-manage/right/list' }]
// }
// ]


// const onClick = (e,props) => {
//   console.log('click ', e,"dd",props);
//   props.history.push(e.key)
// };


function SideMenu(props) {
  const onClick = (e) => {
    console.log('click ', e,props);
    props.history.push(e.key)
  };

  const {role:{rights}} = JSON.parse(localStorage.getItem("token"))

  // console.log(props)
  function titletolabel(list){
    list = list.filter((obj)=>obj.pagepermisson===1 && rights.includes(obj.key))
    list = list.map((obj)=>{
      if(obj.children){
        obj.children=titletolabel(obj.children)
      }
      var myobj={}
      if(obj.children&&obj.children.length>0){
        myobj={key:obj.key,label:obj.title,id:obj.id,children:obj.children}
      }else{
        myobj={key:obj.key,label:obj.title,id:obj.id}
      }
      return(myobj)})
    return list
  }
  const [menu,setMenu] =useState([])
  useEffect(()=>{
    axios.get("/rights?_embed=children").then((result) => {
      result.data = titletolabel(result.data)
      // result.data = result.data.filter((obj)=>obj.pagepermisson===1)
      // result.data = result.data.map((obj)=>({...obj,label:obj.title}))
      // console.log(result.data)
      setMenu(result.data)
    }).catch((err) => {
      console.log(err)
    });
    setselectKeys([props.location.pathname])
    setopenKeys(["/"+props.location.pathname.split("/")[1]])
  },[props.location])

  // const selectKeys = [props.location.pathname]
  // const openKeys = ["/"+props.location.pathname.split("/")[1]]
  
  const [selectKeys,setselectKeys] = useState([props.location.pathname])
  const [openKeys,setopenKeys] = useState(["/"+props.location.pathname.split("/")[1]])

  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div style={{display:"flex",height:"100%","flexDirection":"column"}}>
      <div className="demo-logo-vertical">全球新闻发布管理系统</div>
      <div style={{"flex":"1","overflow":"auto"}}>
      <Menu
        theme="dark"
        mode="inline"
        // defaultSelectedKeys={selectKeys}
        // defaultOpenKeys={openKeys}
        selectedKeys={selectKeys}
        openKeys={openKeys}
        // onClick={onClick}  两种传参都可以，注意props什么时候有效以及onclick函数定义在函数外还是内
        onClick={(e)=>{
          onClick(e)
        }}

        onOpenChange={(keys)=>setopenKeys(keys)}
        onSelect={(item,key)=>setselectKeys(key)}
        
      // items={[
      //   getItem('首页', '/home', <UserOutlined />),
      //   getItem('用户管理', '/user-manage', <VideoCameraOutlined />),
      //   getItem('权限管理', '/right-manage', <UploadOutlined />, [
      //     getItem('角色列表', '/right-manage/role/list'),
      //     getItem('用户列表', '/right-manage/right/list')
      //   ])
      // ]}
      // items={[...myitems]}
      items={[...menu]}
      />
      </div>
      </div>
    </Sider>
  )
}
const mapStateToProps = ({CollApsedReducer:{isCollapsed}})=>({
  isCollapsed
})
export default connect(mapStateToProps)(withRouter(SideMenu))