import Dashboard from "../components/Dashboard";
import Head from "next/head";
import { Layout } from "antd";

const dashboardPage = () => {
    return (
        <Layout>
            <Head>
                <title>Dashboard</title>
            </Head>
            <Dashboard />
        </Layout>
    )
}

export default dashboardPage