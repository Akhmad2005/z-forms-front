import React from 'react';
import { MenuProps } from 'antd';
import {UserOutlined, FileOutlined, FileDoneOutlined} from '@ant-design/icons'
import { Cookies } from 'next-client-cookies';
import { parseJwt } from '../functions/jwtParser';
import { RoleEnum } from '../enums/role';

export const menuItems = (router: any, t: any, cookies: Cookies): MenuProps['items'] => {
  const token = cookies.get('auth-token');
  let role: RoleEnum = RoleEnum.user
  if (token) {
    role = parseJwt(token).role as RoleEnum || RoleEnum.user;
  }
  
  const uniqueMenuItems: MenuProps['items'] = [
    {
      onClick: () => {
        router.push('/cabinet/templates')
      },
      key: 'templates',
      icon: React.createElement(FileOutlined),
      label: t('menu.Templates'),
    },
    {
      onClick: () => {
        router.push('/cabinet/forms')
      },
      key: 'forms',
      icon: React.createElement(FileDoneOutlined),
      label: t('menu.Forms'),
    },
  ]

  const adminMenuItems: MenuProps['items'] = [
    {
      onClick: () => {
        router.push('/cabinet/users')
      },
      key: 'users',
      icon: React.createElement(UserOutlined),
      label: t('menu.Users'),
    },
  ] 

  if (role == RoleEnum.user) {
    return [...uniqueMenuItems]
  } else if (role == RoleEnum.admin) {
    return [ ...adminMenuItems, ...uniqueMenuItems,]
  }
} 