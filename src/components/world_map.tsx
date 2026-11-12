
"use client";
import type { CSSProperties } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";

export type CountryStatus = "visited" | "planned";

type WorldMapProps = {
  countryStatuses: Record<string, CountryStatus>;
  onCountryClick?: (countryName: string) => void;
};
export default function WorldMap({
  countryStatuses,
  onCountryClick,
}: WorldMapProps) {
  return (
    <div className="w-full overflow-hidden rounded-xl bg-[#f8f7f3] p-2">
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 147 }}
        width={800}
        height={400}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography="/countries-110m.json">
          {({ geographies }) =>
            geographies.map((geo) => {
const countryName = String(geo.properties?.name ?? "");
              const status = countryStatuses[countryName];

              const fill =
                status === "visited"
                  ? "#365442"
                  : status === "planned"
                    ? "#a8c5ad"
                    : "#e5e5dc";

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill}
                  onClick={() => onCountryClick?.(countryName)}
                  style={{
  default: {
    fill,
    stroke: "#ffffff",
    strokeWidth: 0.6,
    outline: "none",
  },
  hover: {
    fill: "#c49a6c",
    stroke: "#ffffff",
    strokeWidth: 0.8,
    outline: "none",
    cursor: "pointer",
  },
  pressed: {
    fill: "#c49a6c",
    outline: "none",
  },
} as any}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
