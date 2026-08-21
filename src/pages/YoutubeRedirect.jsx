import { useEffect } from "react";
import { fetchLatestVideo } from "../api";

export default function YoutubeRedirect() {
  useEffect(() => {
    let cancelled = false;

    fetchLatestVideo()
      .then((data) => {
        if (cancelled || !data.videoId) return;
        window.location.replace("https://www.youtube.com/watch?v=" + data.videoId);
      })
      .catch((err) => {
        console.error("YoutubeRedirect:", err);
      });

    return () => { cancelled = true; };
  }, []);

  return (
    <div style={{
      minHeight: "100vh", background: "#000"
    }} />
  );
}
