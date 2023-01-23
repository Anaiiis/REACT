import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Router from 'next/router';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../config/firebase";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { Layout, Row, Col, Button, Dropdown, message, Space } from "antd";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { LineChart, XAxis, Tooltip, CartesianGrid, Line } from "recharts";

const firebaseApp = initializeApp(firebaseConfig);

const Country = () => {

    const auth = getAuth(firebaseApp);
    const db = getFirestore(firebaseApp);

    const [user, setUser] = useState([]);
    const [statistics, setStatistics] = useState([]);

    const queryParameters = new URLSearchParams(window.location.search);
    const country = queryParameters.get("name");

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const docSnap = await getDoc(doc(db, "users", user.uid));
                if (docSnap.exists()) {
                    setUser({ ...docSnap.data(), id: user.id });
                }
            } else {
                Router.push("/login");
            }
            return () => setUser({});
        }, []);
    }
    )

    /* PREPARATION REQUETES API COVID */

    const axios = require("axios");

    const getStatistics = {
        method: 'GET',
        url: 'https://covid-193.p.rapidapi.com/statistics?country=' + country,
        headers: {
            'X-RapidAPI-Key': '3a8a15d72emshb7d4d752f9d9694p1a2cedjsne65d58c8694c',
            'X-RapidAPI-Host': 'covid-193.p.rapidapi.com'
        }
    };

    /* RECHERCHE DES STATISTIQUES SUR LE PAYS */

    useEffect(() => {
        axios.request(getStatistics).then(function (response) {
            console.log(response.data.response[0]);
            setStatistics(response.data.response[0]);
        }).catch(function (error) {
            console.error(error);
        });
        return () => setStatistics({});
    }, [])

    const { Header, Content } = Layout;

    return (
        <Layout>
            <Header>
                <Navbar user={user} />
            </Header>

            <Content>
                <br />
                <Col class="statistics">
                    <p>Nom : {statistics?.country}</p>
                    <p>Continent : {statistics?.continent}</p>
                    <p>Population : {statistics?.population}</p>
                    <p>Nouveaux cas covid : {statistics?.new}</p>
                    <p>Touchés par le covid : {statistics?.active}</p>
                    <p>Guéris : {statistics?.recovered}</p>
                    <p>Total : {statistics?.total}</p>
                </Col>
                <Row justify="space-between">
                    <br />
                    {/* <p>
                        <LineChart
                            width={400}
                            height={400}
                            data={null}
                            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                        >
                            <XAxis dataKey="name" />
                            <Tooltip />
                            <CartesianGrid stroke="#f5f5f5" />
                            <Line type="monotone" dataKey="uv" stroke="#ff7300" yAxisId={0} />
                            <Line type="monotone" dataKey="pv" stroke="#387908" yAxisId={1} />
                        </LineChart>
                    </p> */}
                    <br />
                </Row>
            </Content>
        </Layout>
    )

}

export default Country;