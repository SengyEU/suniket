import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Tour from "./pages/Tour.jsx";
import Photos from "./pages/Photos.jsx";
import Videos from "./pages/Videos.jsx";
import Contact from "./pages/Contact.jsx";
import Discography from "./pages/Discography.jsx";
import News from "./pages/News.jsx";
import Merch from "./pages/Merch.jsx";
import Singer from "./pages/band/Singer.jsx";
import Guitar1 from "./pages/band/Guitar1.jsx";
import Guitar2 from "./pages/band/Guitar2.jsx";
import Bass from "./pages/band/Bass.jsx";
import Drums from "./pages/band/Drums.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="o-nas" element={<About />} />
                <Route path="tour" element={<Tour />} />
                <Route path="galerie/foto" element={<Photos />} />
                <Route path="galerie/video" element={<Videos />} />
                <Route path="kontakt" element={<Contact />} />
                <Route path="diskografie" element={<Discography />} />
                <Route path="novinky" element={<News />} />
                <Route path="merch" element={<Merch />} />
                <Route path="kapela/victor-hrazdil" element={<Singer />} />
                <Route path="kapela/lukas-janata" element={<Guitar1 />} />
                <Route path="kapela/marek-dudkovic" element={<Guitar2 />} />
                <Route path="kapela/dominik-hrazdil" element={<Bass />} />
                <Route path="kapela/krystof-dolezel" element={<Drums />} />
            </Route>
        </Routes>
    );
}

export default App;
