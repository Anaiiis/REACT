import React from 'react';
import { getAuth, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../config/firebase";
import { getFirestore } from "firebase/firestore";
import { UserOutlined } from "@ant-design/icons";
import { Layout, Row, Col, Button, message } from "antd";
import Link from 'next/link'

const firebaseApp = initializeApp(firebaseConfig);

const Navbar = ({ user }) => {

    const auth = getAuth(firebaseApp);
    const db = getFirestore(firebaseApp);

    const { Header } = Layout;

    const logout = async () => {
        signOut(auth)
            .then(
                () => {
                    message.info("Vous êtes bien déconnecté");

                })
            .catch(
                (err) => {
                    message.error("Une erreur s'est produite : " + err.message);

                });
    };

    return (
        <Layout>
            <Header>
                <Row justify="space-between" style={{ color: "white" }}>
                    <Col><Link href="/dashboard"><img alt="Covid-19" src={"covid-19-logo-blanc.png"} height={40} /></Link></Col>
                    <Col><Link href="/dashboard">{user ? `Bienvenue ${user.firstName}` : <UserOutlined />}</Link>
                    &nbsp;&nbsp;&nbsp;{user ? <Button onClick={logout}>Déconnexion</Button> : ''}</Col>
                </Row>
            </Header>
        </Layout>
    )
}

export default Navbar;