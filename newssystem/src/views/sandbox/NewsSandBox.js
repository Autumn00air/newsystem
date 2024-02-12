import React,{useEffect} from 'react'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import Nprogress from 'nprogress'
import "nprogress/nprogress.css"
import { Layout, theme } from 'antd'
import "./NewsSandBox.css"
import NewsRouter from '../../components/sandbox/NewsRouter'

const { Content } = Layout;
export default function NewsSandBox() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  Nprogress.start();

  useEffect(() => {
    Nprogress.done();
  });

  return (
    <Layout>
      <SideMenu></SideMenu>

      <Layout>
        <TopHeader></TopHeader>

        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow: "auto",
            background: colorBgContainer,

          }}
        >

          <NewsRouter></NewsRouter>
        </Content>
      </Layout>
    </Layout>
  )
}
