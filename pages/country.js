import Country from "../components/Country";
import Head from "next/head";
import { Layout } from "antd";

const countryPage = () => {
    return (
        <Layout>
            <Head>
                <title>Statistics</title>
            </Head>
            <Country />
        </Layout>
    )
}

export default countryPage