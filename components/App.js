import { Layout, Row, Button, Dropdown, message, Space } from "antd";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../config/firebase";
import { doc, getDoc, getFirestore } from "firebase/firestore";

const firebaseApp = initializeApp(firebaseConfig);

const App = () => {

    const auth = getAuth(firebaseApp);
    const db = getFirestore(firebaseApp);

    const [user, setUser] = useState([]);

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const docSnap = await getDoc(doc(db, "users", user.uid));
                if (docSnap.exists()) {
                    setUser({ ...docSnap.data(), id: user.id });
                }
            }
            return () => setUser({});
        }, []);
    }
    )

    const { Header, Content } = Layout;

    return (
        <Layout>
            <Header>
                <Navbar user={user} />
            </Header>

            <Content>
            </Content>
        </Layout>
    )

}

export default App