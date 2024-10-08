import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "@/styles/mainMap/mainMap.module.css";
import SimulationHeaderBar from "@/components/simulation/simulationHeaderBar";
import SideBar from "@/components/mainMap/sideBar";

const KakaoMap = dynamic(() => import("../components/mainMap/kakaoMap"), {
  ssr: false,
});

const UserSimulation: React.FC = () => {
  const router = useRouter();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [favoritePolygons, setFavoritePolygons] = useState<Set<string>>(
    new Set()
  );

  // LocalStorage에서 즐겨찾기 상태 불러오기
  useEffect(() => {
    const savedFavorites = localStorage.getItem(
      "favoritePolygons_userSimulation"
    );
    if (savedFavorites) {
      setFavoritePolygons(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // 즐겨찾기 상태를 LocalStorage에 저장
  useEffect(() => {
    localStorage.setItem(
      "favoritePolygons_userSimulation",
      JSON.stringify(Array.from(favoritePolygons))
    );
  }, [favoritePolygons]);

  const toggleSidebarVisibility = () => {
    setIsSidebarVisible((prevState) => !prevState);
  };

  const handleToggleFavorite = (polygonId: string) => {
    setFavoritePolygons((prevFavorites) => {
      const updatedFavorites = new Set(prevFavorites);
      if (updatedFavorites.has(polygonId)) {
        updatedFavorites.delete(polygonId);
      } else {
        updatedFavorites.add(polygonId);
      }
      return updatedFavorites;
    });
  };

  useEffect(() => {
    if (router.isReady) {
      const { temperature, humidity, a, b, c, d } = router.query;
      console.log("Received params:", { temperature, humidity, a, b, c, d });
      // 서버에 시뮬레이션 요청 보내기
    }
  }, [router.isReady, router.query]);

  return (
    <div className={styles.container}>
      <Head>
        <title>User Simulation</title>
      </Head>
      <SimulationHeaderBar
        onToggleSidebar={toggleSidebarVisibility}
        isSidebarVisible={isSidebarVisible}
      />
      {isSidebarVisible && <SideBar />}
      <div id="map-container" className={styles.mapContainer}>
        <KakaoMap
          pageType="userSimulation"
          favoritePolygons={favoritePolygons}
          onToggleFavorite={handleToggleFavorite}
        />
      </div>
    </div>
  );
};

export default UserSimulation;
