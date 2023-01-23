import Head from "next/head";
import Signup from "../components/Session/Signup";
import { Layout } from "antd";

export default function SignupPage() {

    return (
        <Layout>
            <Head>
                <title>Inscription</title>
                <link rel="icon" href="/favicon.ico"></link>
            </Head>
            <Signup />
        </Layout>
    );
}