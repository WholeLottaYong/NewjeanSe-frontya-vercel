import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import styles from "./infoWindow.module.css";
import MonthlyDemandChart from "../charts/monthlyDemandChart";

declare global {
  interface Window {
    kakao: any;
    infoWindowClose: () => void;
    toggleFavorite: (polygonId: string) => void;
  }
}

interface InfoWindowProps {
  map: any;
  position: any;
  content: string;
  polygonId: string;
  onLoad: (dimensions: { width: number; height: number }) => void;
  onClose: () => void;
  onToggleFavorite: (polygonId: string) => void;
  isFavorite: boolean;
}

const InfoWindow: React.FC<InfoWindowProps> = ({
  map,
  position,
  content,
  polygonId,
  onLoad,
  onClose,
  onToggleFavorite,
  isFavorite,
}) => {
  const infowindowRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      const infowindow = new window.kakao.maps.InfoWindow({
        position,
        content: containerRef.current,
      });
      infowindow.open(map);
      infowindowRef.current = infowindow;

      const rect = containerRef.current.getBoundingClientRect();
      onLoad({ width: rect.width, height: rect.height });
    }

    return () => {
      if (infowindowRef.current) {
        infowindowRef.current.close();
        infowindowRef.current.setMap(null);
        infowindowRef.current = null;
      }

      if (containerRef.current && containerRef.current.parentNode) {
        ReactDOM.unmountComponentAtNode(containerRef.current);
        containerRef.current.parentNode.removeChild(containerRef.current);
      }
    };
  }, [map, position, onLoad]);

  return ReactDOM.createPortal(
    <div>
      <div ref={containerRef} className={styles.infoWindowContent}>
        <span className={styles.close} onClick={onClose}>
          ×
        </span>
        <div className={styles.infoWindowTitle}>
          <span
            className={`${styles.favorite} ${
              isFavorite ? styles.favoriteActive : ""
            }`}
            onClick={() => onToggleFavorite(polygonId)}
          >
            ★
          </span>
          {content}
        </div>
        <div className={styles.chartContainer}>
          <MonthlyDemandChart polygonId={polygonId} />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default InfoWindow;
