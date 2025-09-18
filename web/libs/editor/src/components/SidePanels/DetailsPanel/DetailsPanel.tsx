import { inject, observer } from "mobx-react";
import { useState, type FC, useEffect } from "react";
// import { Select } from "antd";
import { getCurrentTheme, Select } from "@humansignal/ui";
import ColorThief from "colorthief";
import chroma from "chroma-js";
import { Block, Elem } from "../../../utils/bem";
import { Comments as CommentsComponent } from "../../Comments/Comments";
import { AnnotationHistory } from "../../CurrentEntity/AnnotationHistory";
import { PanelBase, type PanelProps } from "../PanelBase";
import "./DetailsPanel.scss";
import { RegionDetailsMain, RegionDetailsMeta } from "./RegionDetails";
import { RegionItem } from "./RegionItem";
import { Relations as RelationsComponent } from "./Relations";
// eslint-disable-next-line
// @ts-ignore
import { RelationsControls } from "./RelationsControls";
import { EmptyState } from "../Components/EmptyState";
import { IconCursor, IconRelationLink } from "@humansignal/icons";
import { getDocsUrl } from "../../../utils/docs";
import ShoesColorSelector from "./components/ShoesColorSelector";
// import { brands } from "./constants";

interface DetailsPanelProps extends PanelProps {
  regions: any;
  selection: any;
}

const DetailsPanelComponent: FC<DetailsPanelProps> = ({
  currentEntity,
  regions,
  ...props
}) => {
  const selectedRegions = regions.selection;

  return (
    <PanelBase
      {...props}
      currentEntity={currentEntity}
      name="details"
      title="Details"
    >
      <Content selection={selectedRegions} currentEntity={currentEntity} />
    </PanelBase>
  );
};

const DetailsComponent: FC<DetailsPanelProps> = ({
  currentEntity,
  regions,
}) => {
  const selectedRegions = regions.selection;

  return (
    <Block name="details-tab">
      <Content selection={selectedRegions} currentEntity={currentEntity} />
    </Block>
  );
};

const Content: FC<any> = observer(function Content({
  selection,
  currentEntity,
}: any): JSX.Element {
  return (
    <>
      {selection.size ? (
        <RegionsPanel regions={selection} />
      ) : (
        <GeneralPanel currentEntity={currentEntity} />
      )}
    </>
  );
});

const CommentsTab: FC<any> = inject("store")(
  observer(function CommentsTab({ store }: any): JSX.Element {
    return (
      <>
        {store.hasInterface("annotations:comments") &&
          store.commentStore.isCommentable && (
            <Block name="comments-panel">
              <Elem name="section-tab">
                <Elem name="section-content">
                  <CommentsComponent
                    annotationStore={store.annotationStore}
                    commentStore={store.commentStore}
                    cacheKey={`task.${store.task.id}`}
                  />
                </Elem>
              </Elem>
            </Block>
          )}
      </>
    );
  })
);

const RelationsTab: FC<any> = inject("store")(
  observer(function RelationsTab({ currentEntity }: any): JSX.Element {
    const { relationStore } = currentEntity;
    const hasRelations = relationStore.size > 0;

    return (
      <>
        <Block name="relations">
          <Elem name="section-tab">
            {hasRelations ? (
              <>
                <Elem name="view-control">
                  <Elem name="section-head">
                    Relations ({relationStore.size})
                  </Elem>
                  <RelationsControls relationStore={relationStore} />
                </Elem>
                <Elem name="section-content">
                  <RelationsComponent relationStore={relationStore} />
                </Elem>
              </>
            ) : (
              <EmptyState
                icon={<IconRelationLink width={24} height={24} />}
                header="Create relations between regions"
                description={
                  <>Link regions to define relationships between them</>
                }
                learnMore={{
                  href: getDocsUrl(
                    "guide/labeling#Add-relations-between-annotations"
                  ),
                  text: "Learn more",
                  testId: "relations-panel-learn-more",
                }}
              />
            )}
          </Elem>
        </Block>
      </>
    );
  })
);

const HistoryTab: FC<any> = inject("store")(
  observer(function HistoryTab({ store, currentEntity }: any): JSX.Element {
    const showAnnotationHistory = store.hasInterface("annotations:history");

    return (
      <>
        <Block name="history">
          <Elem name="section-tab">
            <AnnotationHistory
              inline
              enabled={showAnnotationHistory}
              sectionHeader={
                <>
                  Annotation History
                  <span>#{currentEntity.pk ?? currentEntity.id}</span>
                </>
              }
            />
          </Elem>
        </Block>
      </>
    );
  })
);

const InfoTab: FC<any> = inject("store")(
  observer(function InfoTab({ store, selection }: any): JSX.Element {
    const data = JSON.parse(store.task.data);
    const fullImageUrl = `${window.location.origin}${data.image}`;
    const nothingSelected = !selection || selection.size === 0;

    return (
      <>
        <Block name="info">
          <Elem name="section-tab">
            {nothingSelected ? (
              <EmptyState
                icon={<IconCursor width={24} height={24} />}
                header="View region details"
                description={
                  <>
                    Select a region to view its properties, metadata and
                    available actions
                  </>
                }
              />
            ) : (
              <>
                <RegionsPanel
                  regions={selection}
                  fullImageUrl={fullImageUrl}
                  setBibId={store?.task?.setBibId}
                  setEventId={store?.task?.setEventId}
                  bibId={store?.task?.bibId}
                />
              </>
            )}
          </Elem>
        </Block>
      </>
    );
  })
);

const GeneralPanel: FC<any> = inject("store")(
  observer(function GeneralPanel({ store, currentEntity }: any): JSX.Element {
    const { relationStore } = currentEntity;
    const showAnnotationHistory = store.hasInterface("annotations:history");
    return (
      <>
        <Elem name="section">
          <AnnotationHistory
            inline
            enabled={showAnnotationHistory}
            sectionHeader={
              <>
                Annotation History
                <span>#{currentEntity.pk ?? currentEntity.id}</span>
              </>
            }
          />
        </Elem>
        <Elem name="section">
          <Elem name="view-control">
            <Elem name="section-head">Relations ({relationStore.size})</Elem>
            <RelationsControls relationStore={relationStore} />
          </Elem>
          <Elem name="section-content">
            <RelationsComponent relationStore={relationStore} />
          </Elem>
        </Elem>
        {store.hasInterface("annotations:comments") &&
          store.commentStore.isCommentable && (
            <Elem name="section">
              <Elem name="section-head">Comments</Elem>
              <Elem name="section-content">
                <CommentsComponent
                  annotationStore={store.annotationStore}
                  commentStore={store.commentStore}
                  cacheKey={`task.${store.task.id}`}
                />
              </Elem>
            </Elem>
          )}
      </>
    );
  })
);

GeneralPanel.displayName = "GeneralPanel";

const RegionsPanel: FC<{
  regions: any;
  fullImageUrl: string;
  bibId: string;
  setBibId: (bibId: string) => void;
  setEventId: (eventId: string) => void;
}> = observer(function RegionsPanel({
  regions,
  fullImageUrl,
  bibId,
  setBibId,
  setEventId,
}: {
  regions: any;
  fullImageUrl: string;
  bibId: string;
  setBibId: (bibId: string) => void;
  setEventId: (eventId: string) => void;
}): JSX.Element {
  return (
    <div>
      {regions.list.map((reg: any) => {
        return (
          <SelectedRegion
            bibId={bibId}
            setBibId={setBibId}
            setEventId={setEventId}
            key={reg.id}
            region={reg}
            fullImageUrl={fullImageUrl}
          />
        );
      })}
    </div>
  );
});

function rgbToHex([r, g, b]: number[]): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

// 🎨 Basic color palette (RGB)
const BASIC_COLORS: Record<string, string> = {
  red: "#FF0000",
  darkRed: "#8B0000",
  orange: "#FFA500",
  yellow: "#FFFF00",
  green: "#008000",
  cyan: "#00FFFF",
  blue: "#0000FF",
  purple: "#800080",
  pink: "#FFC0CB",
  brown: "#8B4513",
  gray: "#808080",
  black: "#000000",
  white: "#FFFFFF",
};

export function getBasicColorName(hex: string): string {
  const inputLab = chroma(hex).lab();
  const [L] = inputLab;

  // Step 1: Find the closest basic color by LAB distance
  let closestName = "unknown";
  let minDistance = Infinity;

  for (const [name, code] of Object.entries(BASIC_COLORS)) {
    const lab = chroma(code).lab();
    const distance = Math.sqrt(
      Math.pow(inputLab[0] - lab[0], 2) +
        Math.pow(inputLab[1] - lab[1], 2) +
        Math.pow(inputLab[2] - lab[2], 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      closestName = name;
    }
  }

  // Step 2: Normalize some variants to main colors
  const colorMap: Record<string, string> = {
    darkRed: "red",
  };
  closestName = colorMap[closestName] || closestName;

  // Step 3: Add shade modifier based on lightness
  let shade = "";
  if (L < 35 && closestName !== "black" && closestName !== "gray") {
    shade = "dark ";
  } else if (L > 75 && closestName !== "white" && closestName !== "gray") {
    shade = "light ";
  }

  return shade + closestName;
}

const SelectedRegion: FC<{
  region: any;
  fullImageUrl: string;
  bibId: string;
  setBibId: (bibId: string) => void;
  setEventId: (eventId: string) => void;
}> = observer(function SelectedRegion({
  region,
  fullImageUrl,
  bibId,
  setBibId,
  setEventId,
}: {
  region: any;
  fullImageUrl: string;
  bibId: string;
  setBibId: (bibId: string) => void;
  setEventId: (eventId: string) => void;
}): JSX.Element {
  const [dominantHex, setDominantHex] = useState(
    region?.detectedColor?.primary?.color || "#ffffff"
  );
  const [secondaryHex, setSecondaryHex] = useState(
    region?.detectedColor?.secondary?.color || "#ffffff"
  );
  const [accentHex, setAccentHex] = useState(
    region?.detectedColor?.accent?.color || "#ffffff"
  );
  
  const [brands, setBrands] = useState<string[]>([]);
  const [brand, setBrand] = useState(region?.brand || null);
  const [shoeModels, setShoeModels] = useState<string[]>([]);
  const [shoeModel, setShoeModel] = useState(region?.shoeModel || null);
  const [palette, setPalette] = useState<string[]>([]);

  const isShoesRegion = region?.labelName.toLowerCase() === "shoes";

  useEffect(() => {
    region.setCategory(region.tag.name)
    setBibId(fullImageUrl.split("-")[1].split("_")[0]);
    setEventId(fullImageUrl.split("-")[1].split("_")[1]);

    // Place this inside your component:
    fetch("/integrated-data/", {
      method: "GET",
      headers: {
        Accept: "*/*",
      },
      credentials: "include",
    })
      .then((response) =>
        response.json().then((data) => {
          console.log("Fetched integrated data:", data);
          if (data && Array.isArray(data)) {
            setBrands(data);
          } else {
            console.warn("No brands found in the fetched data");
          }
        })
      )
      .catch((error) => {
        console.error("Error fetching integrated data:", error);
      });
  }, []);

  useEffect(() => {
    if (brand && isShoesRegion) {
      fetch(`/brands/${encodeURIComponent(brand)}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setShoeModels(data[brand] || []);
          console.log("Models for", brand, ":", data);
        })
        .catch((err) => console.error(err));
    }
  }, [brand]);

  useEffect(() => {
    if (!region || !fullImageUrl) return;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = fullImageUrl;

    img.onload = () => {
      const { x, y, width, height } = region;

      // Convert % coordinates to pixels
      const pixelX = (x / 100) * img.width;
      const pixelY = (y / 100) * img.height;
      const pixelWidth = (width / 100) * img.width;
      const pixelHeight = (height / 100) * img.height;

      // Create canvas for the crop
      const canvas = document.createElement("canvas");
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(
        img,
        pixelX,
        pixelY,
        pixelWidth,
        pixelHeight,
        0,
        0,
        pixelWidth,
        pixelHeight
      );

      // Convert cropped canvas into an Image
      const croppedImg = new Image();
      croppedImg.src = canvas.toDataURL("image/png");

      croppedImg.onload = () => {
        const colorThief = new ColorThief();
        const dominant = colorThief.getColor(croppedImg); // [r,g,b]
        const dominantPalette = colorThief.getPalette(croppedImg, 6); // array of [r,g,b]
        const hexPalette = dominantPalette.map(rgbToHex);
        setPalette(hexPalette);
        console.log("region?.detectedColor", region?.detectedColor);
        if (region?.detectedColor) return; // no change
        setDominantHex(rgbToHex(dominant));
        region.setDetectedColor(
          "primary",
          getBasicColorName(rgbToHex(dominant)),
          rgbToHex(dominant)
        );
      };
    };
  }, [region, fullImageUrl]); // only rerun if these change

  return (
    <>
      {isShoesRegion ? (
        <ShoesColorSelector region={region} palette={palette} />
      ) : (
        <div>
          {/* Primary color */}
          <div>
            <label>Primary</label>
            <input
              onChange={(e) => {
                setDominantHex(e.target.value);
                region.setDetectedColor(
                  "primary",
                  getBasicColorName(e.target.value),
                  e.target.value
                );
              }}
              type="color"
              value={dominantHex}
              readOnly
            />
            <div>{dominantHex ? getBasicColorName(dominantHex) : ""}</div>
            <div style={{ display: "flex", margin: "8px 0" }}>
              {palette.map((color) => (
                <div
                  key={color}
                  style={{
                    backgroundColor: color,
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    marginRight: "5px",
                  }}
                  onClick={() => {
                    setDominantHex(color);
                    region.setDetectedColor(
                      "primary",
                      getBasicColorName(color),
                      color
                    );
                  }}
                />
              ))}
            </div>
          </div>
          {/* Secondary color (optional) */}
          <div>
            <label>Secondary (optional)</label>
            <input
              onChange={(e) => {
                setSecondaryHex(e.target.value);
                region.setDetectedColor(
                  "secondary",
                  getBasicColorName(e.target.value),
                  e.target.value
                );
              }}
              type="color"
              value={secondaryHex}
            />
            <div>{secondaryHex ? getBasicColorName(secondaryHex) : ""}</div>
            <div style={{ display: "flex", margin: "8px 0" }}>
              {palette.map((color) => (
                <div
                  key={color + "-secondary"}
                  style={{
                    backgroundColor: color,
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    marginRight: "5px",
                  }}
                  onClick={() => {
                    setSecondaryHex(color);
                    region.setDetectedColor(
                      "secondary",
                      getBasicColorName(color),
                      color
                    );
                  }}
                />
              ))}
            </div>
          </div>
          {/* Accent color (optional) */}
          <div>
            <label>Accent (optional)</label>
            <input
              onChange={(e) => {
                setAccentHex(e.target.value);
                region.setDetectedColor(
                  "accent",
                  getBasicColorName(e.target.value),
                  e.target.value
                );
              }}
              type="color"
              value={accentHex || ""}
            />
            <div>{accentHex ? getBasicColorName(accentHex) : ""}</div>
            <div style={{ display: "flex", margin: "8px 0" }}>
              {palette.map((color) => (
                <div
                  key={color + "-accent"}
                  style={{
                    backgroundColor: color,
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    marginRight: "5px",
                  }}
                  onClick={() => {
                    setAccentHex(color);
                    region.setDetectedColor(
                      "accent",
                      getBasicColorName(color),
                      color
                    );
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      <div style={{ margin: "10px 0" }}>
        <label htmlFor="brand-select" style={{marginBottom: "4px"}}>Brand:</label>
        <Select
          searchable
          id="brand-select"
          searchPlaceholder="Search to Select"
          value={brand || ""}
          addToTheListHandler={(value, e) => {
            e.stopPropagation();
            if (!brands.includes(value)) {
              const updatedBrands = [...brands, value];
              setBrands(updatedBrands);
              const url = "/integrated-data/";
              fetch(url, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "*/*",
                },
                credentials: "include",
                body: JSON.stringify({
                  items: [value],
                }),
              })
                .then((res) => res.json())
                .then((data) => console.log(data))
                .catch((err) => console.error(err));
            }
          }}
          onChange={(value) => {
            setBrand(value);
            console.log("Selected brand:", value);
            region.setBrand?.(value);
          }}
          style={{ width: "100%", marginBottom: "10px" }}
          options={brands.sort().map((b) => ({ value: b, label: b }))}
        ></Select>
        {isShoesRegion && Array.isArray(shoeModels) ? (
          <div>
            <label htmlFor="brand-select" style={{marginBottom: "4px"}}>Shoe model:</label>
            <Select
              searchable
              id="shoeModel-select"
              searchPlaceholder="Search to Select"
              value={shoeModel || ""}
              addToTheListHandler={(value, e) => {
                e.stopPropagation();
                if (!shoeModels.includes(value)) {
                  const updatedShoeModels = [...shoeModels, value];
                  setShoeModels(updatedShoeModels);
                  const url = `/brands/${encodeURIComponent(
                    brand
                  )}/`;
                  fetch(url, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Accept: "*/*",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                      models: [value],
                    }),
                  })
                    .then((res) => res.json())
                    .then((data) => console.log(data))
                    .catch((err) => console.error(err));
                }
              }}
              onChange={(value) => {
                setShoeModel(value);
                region.setShoeModel?.(value);
              }}
              style={{ width: "100%",marginBottom: "10px" }}
              options={shoeModels
                .sort()
                .map((b: string) => ({ value: b, label: b }))}
            ></Select>
          </div>
        ) : null}
      </div>
      <RegionItem
        region={region}
        mainDetails={RegionDetailsMain}
        metaDetails={RegionDetailsMeta}
      />
      <hr style={{ margin: "5px 0" }} />
      <div>
        <h2>Data to store</h2>
        <div>
          BibId:
          <input
            type="text"
            value={region.bibId || bibId || ""}
            style={{ color: "black" }}
            onChange={(e) => {
              setBibId(e.target.value);
              region.setBibId(e.target.value);
            }}
          />
        </div>
        <div>
          {region.labelName}:{dominantHex ? getBasicColorName(dominantHex) : ""}
        </div>
      </div>
    </>
  );
});

export const Comments = CommentsTab;
export const History = HistoryTab;
export const Relations = RelationsTab;
export const Info = InfoTab;
export const Details = observer(DetailsComponent);
export const DetailsPanel = observer(DetailsPanelComponent);
