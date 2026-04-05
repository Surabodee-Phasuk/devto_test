
import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom' 
import Layout from '../layouts/Layout'
import Home from '../pages/Home'
import Content from '../pages/Content'
import Member from '../pages/Member'
import Student from '../pages/Student'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: 'content',
                element: <Content />
            },
            {
                path: 'member',
                element: <Member />
            },
            {
                path: 'student/:id',
                element: <Student />
            }
        ]
    }
])

const AppRoutes = () => {
  return (
    <>
        <RouterProvider router={router} />
    </>
  )
}

export default AppRoutes