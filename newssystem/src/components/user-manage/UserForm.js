import React, { forwardRef, useEffect, useState } from 'react'
import { Form, Input, Select } from "antd"

const UserForm = forwardRef((props, ref) => {
    const [isDisabled, setisDisabled] = useState(false);

    const { roleId, region, username } = JSON.parse(localStorage.getItem("token"))
    const roleObj = {
        "1": "superadmin",
        "2": "admin",
        "3": "editor"
    }

    useEffect(() => {
        setisDisabled(props.isUpdateDisabled)
    }, [props.isUpdateDisabled])


    const checkRegionDisabled = (item) => {
        if (props.isUpdate) {
            if (roleObj[roleId] === "superadmin") {
                return false
            }else{
                return true
            }
        } else {
            if (roleObj[roleId] === "superadmin") {
                return false
            }else{
                return item.value!==region
            }
        }
    }
    const checkRoleDisabled = (item) => {
        if (props.isUpdate) {
            if (roleObj[roleId] === "superadmin") {
                return false
            }else{
                return true
            }
        } else {
            if (roleObj[roleId] === "superadmin") {
                return false
            }else{
                return roleObj[item.id]!=="editor"
            }
        }
    }

    return (
        <Form
            ref={ref}
            layout="vertical"

        >
            <Form.Item
                name="title"
                label="用户名"
                rules={[
                    {
                        required: true,
                        message: 'Please input the title of collection!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[
                    {
                        required: true,
                        message: 'Please input the title of collection!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                rules={[
                    {
                        required: !isDisabled,
                        message: 'Please input the title of collection!',
                    },
                ]}
            >
                <Select
                    disabled={isDisabled}
                    options={props.regionList.map((item) => {
                        item.label = item.value
                        item.disabled = checkRegionDisabled(item)
                        return item
                    })}
                />
            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"
                rules={[
                    {
                        required: true,
                        message: 'Please input the title of collection!',
                    },
                ]}
            >
                <Select
                    onChange={(value) => {
                        if (value === 1) {
                            setisDisabled(true)
                            ref.current.setFieldsValue({
                                region: ""
                            })
                        } else {
                            setisDisabled(false)
                        }
                    }}
                    options={props.roleList.map((item) => {
                        item.value = item.id
                        item.label = item.roleName
                        item.disabled = checkRoleDisabled(item)
                        return item
                    })}
                />
            </Form.Item>

        </Form>
    )
})

export default UserForm
