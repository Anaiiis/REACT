import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../config/firebase";
import Link from 'next/link'
import { doc, addDoc, setDoc, getFirestore } from "firebase/firestore";
import { UserOutlined } from "@ant-design/icons";
import { serverTimestamp } from "firebase/firestore";
import Router from 'next/router';
import Navbar from "../Navbar";

import {
    Layout,
    Row,
    Col,
    Form,
    Input,
    Button,
    Typography,
    message,
} from "antd";

import {
    MailOutlined,
    LockOutlined,
    LoadingOutlined,
} from "@ant-design/icons";


const firebaseApp = initializeApp(firebaseConfig);

const Signup = () => {

    const auth = getAuth(firebaseApp);
    const db = getFirestore(firebaseApp);

    const [state, setState] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        setLoading(true);
        createUserWithEmailAndPassword(auth, state.email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                console.log(user);
                setLoading(false);
                message.success("Inscription réussie");
                const addItem = await setDoc(doc(db, "users", user.uid), { ...state, createdAt: serverTimestamp() });
                Router.push("/dashboard");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                message.error(errorMessage);
                setLoading(false);
            });
    };

    const { Header, Content } = Layout;
    const { Title } = Typography;

    return (
        <Layout className="layout" style={{ minHeight: "100vh" }}>
            <Header>
                <Navbar />
            </Header>
            
            <Content>

                <Row>
                    <Col
                        xs={{ span: 20, offset: 2 }}
                        md={{ span: 12, offset: 6 }}
                        lg={{ span: 8, offset: 8 }}
                    >

                        <Typography
                            style={{
                                borderRadius: 8,
                                marginTop: "6vh",
                                marginBottom: 64,
                                textAlign: "center",

                            }}
                        >
                            <Title level={1} style={{ fontSize: 32, marginBottom: 32 }}>
                                Inscription
                            </Title>

                            <Form onFinish={handleSubmit} className="login-form">
                                <Form.Item name="Votre Prénom" rules={[{ required: true }]}>
                                    <Input
                                        prefix={<UserOutlined />}
                                        type="text"
                                        size="large"
                                        name="firstName"
                                        placeholder=" Votre Prénom"
                                        onChange={
                                            (e) => setState({ ...state, [e.target.name]: e.target.value })
                                        }
                                    />
                                </Form.Item>

                                <Form.Item name="Votre Nom" rules={[{ required: true }]}>
                                    <Input
                                        prefix={<UserOutlined />}
                                        type="text"
                                        size="large"
                                        name="name"
                                        placeholder=" Votre Nom"
                                        onChange={
                                            (e) => setState({ ...state, [e.target.name]: e.target.value })
                                        }
                                    />
                                </Form.Item>

                                <Form.Item name="Votre Email" rules={[{ required: true }]}>
                                    <Input
                                        prefix={<MailOutlined />}
                                        type="email"
                                        size="large"
                                        name="email"
                                        placeholder=" Votre Email"
                                        onChange={
                                            (e) => setState({ ...state, [e.target.name]: e.target.value })
                                        }
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="Votre Mot de passe"
                                    rules={[{ required: true }]}
                                >
                                    <Input
                                        prefix={<LockOutlined />}
                                        size="large"
                                        type="password"
                                        placeholder=" Votre Mot de passe"
                                        onChange={
                                            (e) => setPassword(e.target.value)
                                        }
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        shape="round"
                                        type="primary"
                                        htmlType="submit"
                                        className="login-form-button"
                                    >
                                        {loading ? <LoadingOutlined /> : null}
                                        Inscription
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Typography>

                        <Typography
                            style={{
                                textAlign: "center",
                            }}
                        >
                            <Title level={4} style={{ fontWeight: 500, fontSize: 18 }}>
                                Déjà inscrit ?
                            </Title>
                            <Button type="link">
                                <Link href="/login">Connexion</Link>
                            </Button>
                        </Typography>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );

}

export default Signup;