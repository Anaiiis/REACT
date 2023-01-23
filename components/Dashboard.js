import { getAuth, onAuthStateChanged } from "firebase/auth";
import Router from 'next/router';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../config/firebase";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { Layout, Button, Card } from "antd";
import { AreaChartOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";

const firebaseApp = initializeApp(firebaseConfig);

const Dashboard = () => {

    const auth = getAuth(firebaseApp);
    const db = getFirestore(firebaseApp);

    const [user, setUser] = useState([]);
    const [countries, setCountries] = useState([]);

    const [name, setName] = useState('');
    const [foundCountries, setFoundCountries] = useState(countries);

    const gridStyle = {
        width: '25%',
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

    const getCountries = {
        method: 'GET',
        url: 'https://covid-193.p.rapidapi.com/countries',
        headers: {
            'X-RapidAPI-Key': '3a8a15d72emshb7d4d752f9d9694p1a2cedjsne65d58c8694c',
            'X-RapidAPI-Host': 'covid-193.p.rapidapi.com'
        }
    };

    /* RECHERCHE DES PAYS */

    useEffect(() => {
        axios.request(getCountries).then(function (response) {
            setCountries(response.data.response);
            setFoundCountries(countries);
        }).catch(function (error) {
            console.error(error);
        });
        return () => setCountries({});
    }, [])

    /* FILTRE LES PAYS AFFICHES */

    const filter = (e) => {
        const keyword = e.target.value;

        if (keyword !== '') {
            const results = countries.filter((country) => {
                // Use the toLowerCase() method to make it case-insensitive
                return country.toLowerCase().startsWith(keyword.toLowerCase());
            });
            setFoundCountries(results);
        } else {
            // If the text field is empty, show all countries
            setFoundCountries(countries);
        }

        setName(keyword);
    };

    const { Header, Content } = Layout;

    return (
        <Layout>
            <Header>
                <Navbar user={user} />
            </Header>

            <Content class='white'>
                <div class='center'>
                    <input
                        type="search"
                        value={name}
                        onChange={filter}
                        className="input"
                        placeholder="Entrer le nom du pays... (En anglais)"
                    />
                </div>

                <Card title='Sélectionner un pays'>
                    {foundCountries && foundCountries.length > 0 ? (
                        foundCountries.map((country) => (
                            <Card.Grid style={gridStyle}>
                                <Button key="displayStatistics" type="link" onClick={() => Router.push(
                                    {
                                        pathname: '/country',
                                        query: { name: country },
                                    }
                                )}>
                                    {country} {<AreaChartOutlined />}</Button>
                            </Card.Grid>
                        ))
                    ) : (
                        <Card.Grid style={gridStyle}>
                            Aucun résultat
                        </Card.Grid>
                    )}
                </Card>
            </Content>
        </Layout >
    )

}

export default Dashboard;