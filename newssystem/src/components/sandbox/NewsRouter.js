import React, { useState, useEffect } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Home from '../../views/sandbox/home/Home'
import UserList from '../../views/sandbox/user-manage/UserList'
import RoleList from '../../views/sandbox/right-manage/RoleList'
import RightList from '../../views/sandbox/right-manage/RightList'
import Nopermission from '../../views/sandbox/nopermission/Nopermission'
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd'
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft'
import NewsPreview from '../../views/sandbox/news-manage/NewsPreivew'
import NewsUpdate from '../../views/sandbox/news-manage/NewsUpdate'
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory'
import Audit from '../../views/sandbox/audit-manage/Audit'
import AuditList from '../../views/sandbox/audit-manage/AuditList'
import Unpublished from '../../views/sandbox/publish-manage/Unpublished'
import Published from '../../views/sandbox/publish-manage/Published'
import Sunset from '../../views/sandbox/publish-manage/Sunset'
import axios from 'axios'
import { Spin } from 'antd'
import { RadiusUprightOutlined } from '@ant-design/icons'
import { connect } from "react-redux"
import { HashRouter } from 'react-router-dom/cjs/react-router-dom.min'

const LocalRouterMap = {
    "/home": Home,
    "/user-manage/list": UserList,
    "/right-manage/role/list": RoleList,
    "/right-manage/right/list": RightList,
    "/news-manage/add": NewsAdd,
    "/news-manage/draft": NewsDraft,
    "/news-manage/category": NewsCategory,
    "/audit-manage/audit": Audit,
    "/audit-manage/list": AuditList,
    "/publish-manage/unpublished": Unpublished,
    "/publish-manage/published": Published,
    "/publish-manage/sunset": Sunset,
    "/news-manage/preview/:id": NewsPreview,
    "/news-manage/update/:id": NewsUpdate
}


function NewsRouter(props) {
    const [backRouterList, setbackRouterList] = useState([]);
    useEffect(() => {
        Promise.all([
            axios.get("/rights"),
            axios.get("/children")
        ]).then(res => {
            // console.log(res)
            setbackRouterList([...res[0].data, ...res[1].data])
            // console.log(backRouterList)

        })
    }, []);

    const { role: { rights } } = JSON.parse(localStorage.getItem("token"))
    const checkRoute = (item) => {
        // console.log(item)
        return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    }

    const checkUserPermission = (item) => {
        return rights.includes(item.key)
    }
    return (
        <Spin size="large" spinning={props.isLoading}>
            {/* <Switch>
            {
                backRouterList.map(item => {
                    if(checkRoute(item) && checkUserPermission(item)){
                        return <Route exact path={item.key} key={item.key} component={LocalRouterMap[item.key]}></Route>
                    }
                    return null
                })
            }
            <Redirect from="/" to="/home" exact />
            {/* { console.log(backRouterList)} */}
            {/* {   
               
                backRouterList.length > 0 && <Route path="*" component={Nopermission} />
            }
        </Switch> */} */}
            <HashRouter>
                <Switch>
                    {
                        backRouterList.map(item => {
                            if (checkRoute(item) && checkUserPermission(item)) {
                                return <Route exact path={item.key} key={item.key} component={LocalRouterMap[item.key]}></Route>
                            }
                            return null
                        })
                    }
                    <Redirect from="/" to="/home" exact />
                    {/* { console.log(backRouterList)} */}
                    {

                        backRouterList.length > 0 && <Route path="*" component={Nopermission} />
                    }
                </Switch>
            </HashRouter>
        </Spin>
    )
}
const mapStateToProps = ({ LoadingReducer: { isLoading } }) => {
    return {
        isLoading
    }
}
export default connect(mapStateToProps)(NewsRouter)