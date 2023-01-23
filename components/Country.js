import { getAuth, onAuthStateChanged } from "firebase/auth";
import Router from 'next/router';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../config/firebase";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { Layout } from "antd";
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const firebaseApp = initializeApp(firebaseConfig);

const Country = () => {

    const auth = getAuth(firebaseApp);
    const db = getFirestore(firebaseApp);

    const [user, setUser] = useState([]);
    const [statistics1, setStatistics1] = useState([]);
    const [statistics2, setStatistics2] = useState([]);
    const [statistics3, setStatistics3] = useState([]);

    const queryParameters = new URLSearchParams(window.location.search);
    const country = queryParameters.get("name");

    const style = {
        textAlign: 'center',
    };

    /* RENVOIE A LA PAGE DE CONNEXION SI PAS CONNECTE */

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

    const separator = '-';

    const date1 = new Date();
    const day1 = date1.getDate();
    const month1 = date1.getMonth() + 1;
    const year1 = date1.getFullYear();

    const date2 = new Date();
    date2.setDate(date1.getDate() - 1);
    const day2 = date2.getDate();
    const month2 = date2.getMonth() + 1;
    const year2 = date2.getFullYear();

    const date3 = new Date();
    date3.setDate(date1.getDate() - 2);
    const day3 = date3.getDate();
    const month3 = date3.getMonth() + 1;
    const year3 = date3.getFullYear();

    const getStatistics1 = {
        method: 'GET',
        url: 'https://covid-193.p.rapidapi.com/history',
        params: { country: country, day: `${year1}${separator}${month1 < 10 ? `0${month1}` : `${month1}`}${separator}${day1}` },
        headers: {
            'X-RapidAPI-Key': '3a8a15d72emshb7d4d752f9d9694p1a2cedjsne65d58c8694c',
            'X-RapidAPI-Host': 'covid-193.p.rapidapi.com'
        }
    };

    const getStatistics2 = {
        method: 'GET',
        url: 'https://covid-193.p.rapidapi.com/history',
        params: { country: country, day: `${year2}${separator}${month2 < 10 ? `0${month2}` : `${month2}`}${separator}${day2}` },
        headers: {
            'X-RapidAPI-Key': '3a8a15d72emshb7d4d752f9d9694p1a2cedjsne65d58c8694c',
            'X-RapidAPI-Host': 'covid-193.p.rapidapi.com'
        }
    };

    const getStatistics3 = {
        method: 'GET',
        url: 'https://covid-193.p.rapidapi.com/history',
        params: { country: country, day: `${year3}${separator}${month3 < 10 ? `0${month3}` : `${month3}`}${separator}${day3}` },
        headers: {
            'X-RapidAPI-Key': '3a8a15d72emshb7d4d752f9d9694p1a2cedjsne65d58c8694c',
            'X-RapidAPI-Host': 'covid-193.p.rapidapi.com'
        }
    };

    /* RECHERCHE DES STATISTIQUES SUR LE PAYS */

    useEffect(() => {
        axios.request(getStatistics1).then(function (response) {
            console.log(response.data.response[0]);
            setStatistics1(response.data.response[0]);
        }).catch(function (error) {
            console.error(error);
        });
        return () => setStatistics1({});
    }, [])

    useEffect(() => {
        axios.request(getStatistics2).then(function (response) {
            console.log(response.data.response[0]);
            setStatistics2(response.data.response[0]);
        }).catch(function (error) {
            console.error(error);
        });
        return () => setStatistics2({});
    }, [])

    useEffect(() => {
        axios.request(getStatistics3).then(function (response) {
            console.log(response.data.response[0]);
            setStatistics3(response.data.response[0]);
        }).catch(function (error) {
            console.error(error);
        });
        return () => setStatistics3({});
    }, [])

    /* DONNES DU GRAPHIQUE */

    const data = [
        { date: statistics3?.day, cas: statistics3?.cases?.active },
        { date: statistics2?.day, cas: statistics2?.cases?.active },
        { date: statistics1?.day, cas: statistics1?.cases?.active },
    ];

    const renderLineChart = (
        <LineChart width={600} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <Line type="monotone" dataKey="cas" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
        </LineChart>
    );

    const { Header, Sider, Content } = Layout;

    return (
        <Layout class='white'>
            <Header>
                <Navbar user={user} />
            </Header>

            <Layout class='white'>
                <Sider class='centerStatistics'>
                    <p>Nom : {statistics1?.country}</p>
                    <p>Continent : {statistics1?.continent}</p>
                    <p>Population : {statistics1?.population}</p>
                    <p>Nouveaux cas covid : {statistics1?.cases?.new}</p>
                    <p>Touchés par le covid : {statistics1?.cases?.active}</p>
                    <p>Guéris : {statistics1?.cases?.recovered}</p>
                    <p>Total : {statistics1?.cases?.total}</p>
                </Sider>

                <Content class='centerStatistics'>
                    <p style={style}><strong>Nombre de cas sur 3 jours</strong></p>
                    {renderLineChart}
                </Content>
            </Layout>
        </Layout>
    )

}

export default Country;