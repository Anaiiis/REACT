import Head from "next/head";
import Login from "../components/Session/Login";
import { Layout } from "antd";

export default function LoginPage() {

    return (
        <Layout>
            <Head>
                <title>Connexion</title>
                <link rel="icon" href="/favicon.ico"></link>
            </Head>
            <Login />
        </Layout>

    );
}