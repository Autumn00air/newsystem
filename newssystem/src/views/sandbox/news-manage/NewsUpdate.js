import React, { useState, useEffect } from 'react'
import { PageHeader } from "@ant-design/pro-layout"
import { Button, Steps, Form, Input, message, Select, notification } from "antd"
import style from './News.module.css'
import axios from 'axios'
import NewsEditor from '../../../components/news-manage/NewsEditor'

export default function NewsUpdate(props) {
    const [categoryList, setcategoryList] = useState([]);
    const [current, setcurrent] = useState(0);
    const [form] = Form.useForm();
    const [formInfo, setformInfo] = useState({});
    const [content, setcontent] = useState("");
    const user = JSON.parse(localStorage.getItem("token"))

    const handleNext = () => {
        if (current === 0) {
            form.validateFields().then(res => {
                setformInfo(res)
                setcurrent(current + 1)
            }).catch(err => {
                console.log(err)
            })
        } else {
            if (content.toString() === "") {
                console.log(typeof content)
                message.error("新闻内容不能为空")
            } else {
                console.log(typeof content)

                console.log(formInfo, content)
                setcurrent(current + 1)
            }

        }
    }
    // const [api, contextHolder] = notification.useNotification();

    const handlePrevious = () => {
        setcurrent(current - 1)
    }
    const handleSave = (auditState) => {
        console.log(user.username)
        axios.patch(`/news/${props.match.params.id}`, {
            ...formInfo,
            "content": content,
            "auditState": auditState,
           
            // "publishTime": 0
        }).then(res => {
            props.history.push(auditState === 0 ? "/news-manage/draft" : "/audit-manage/list")
            notification.info({
                message: `通知`,
                description: `你可以到${auditState === 0 ? "草稿箱" : "审核列表"}中查看信息`,
                placement: 'bottomRight',
            });
        })
    }

    useEffect(() => {
        axios.get("/categories").then(res => {
            console.log(res.data)
            setcategoryList(res.data)
        })
    }, []);

    useEffect(() => {
        console.log(props.match.params.id)
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
            // setnewsInfo(res.data)
            console.log(res.data)
            let {title,categoryId,content} = res.data
            form.setFieldsValue({
                title,
                categoryId
            })
            setcontent(content)
        })
    }, [props.match.params.id])


    return (
        <div>
            {/* {contextHolder} */}
            <PageHeader
                className="site-page-header"
                title="更新新闻"
                subTitle="This is a subtitle"
                onBack={() => {
                    props.history.goBack()
                }}
            />
            <Steps
                current={current}
                items={[
                    {
                        title: '基本信息',
                        description: "新闻标题，新闻分类",
                    },
                    {
                        title: '新闻内容',
                        description: "新闻主题内容",
                    },
                    {
                        title: '新闻提交',
                        description: "保存草稿或者提交审核",
                    },
                ]}
            />

            <div style={{ marginTop: "50px" }}>
                <div className={current === 0 ? "" : style.active}>
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{
                            span: 4,
                        }}
                        wrapperCol={{
                            span: 20,
                        }}
                        style={{
                            maxWidth: 600,
                        }}

                        autoComplete="off"
                    >
                        <Form.Item
                            label="新闻标题"
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="新闻分类"
                            name="categoryId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >

                            <Select options={
                                categoryList.map(item => {
                                    return { value: item.id, label: item.title }
                                })
                            }>
                            </Select>
                        </Form.Item>

                    </Form>
                </div>
            </div>
            <div className={current === 1 ? "" : style.active}>
                <NewsEditor getContent={(value) => {
                    setcontent(value)
                }} content={content}></NewsEditor>
            </div>
            

            <div style={{ marginTop: "50px" }}>
                {
                    current === 2 && <span>
                        <Button type='primary' onClick={() => handleSave(0)}>保存草稿</Button>
                        <Button danger onClick={() => handleSave(1)}>提交审核</Button>
                    </span>
                }
                {current < 2 && <Button type="primary" onClick={handleNext}>下一步</Button>}
                {current > 0 && <Button onClick={handlePrevious}>上一步</Button>}
            </div>

        </div>

    )
}
