import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "./layout/Layout.jsx";
import Loading from "./components/Loading.jsx";
import NotFound from "./pages/NotFound.jsx";
import YoutubeRedirect from "./pages/YoutubeRedirect.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Tour = lazy(() => import("./pages/Tour.jsx"));
const Photos = lazy(() => import("./pages/Photos.jsx"));
const Videos = lazy(() => import("./pages/Videos.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Discography = lazy(() => import("./pages/Discography.jsx"));
const News = lazy(() => import("./pages/News.jsx"));
const Merch = lazy(() => import("./pages/Merch.jsx"));
const Singer = lazy(() => import("./pages/band/Singer.jsx"));
const Guitar1 = lazy(() => import("./pages/band/Guitar1.jsx"));
const Guitar2 = lazy(() => import("./pages/band/Guitar2.jsx"));
const Bass = lazy(() => import("./pages/band/Bass.jsx"));
const Drums = lazy(() => import("./pages/band/Drums.jsx"));

function App() {
    return (
        <Suspense fallback={<Loading />}>
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
                <Route path="nejnovejsi-video" element={<YoutubeRedirect />} />
                <Route path="*" element={<Layout />}>
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </Suspense>
    );
}

export default App;
