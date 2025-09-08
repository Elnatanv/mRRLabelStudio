import { useState } from "react";
import { getBasicColorName } from "../DetailsPanel";

const ShoesColorSelector = ({
    region,
    palette,
}: {
    region: any;
    palette: string[];
}) => {
    // New color states
    const [upperHex, setUpperHex] = useState(
        region?.detectedColor?.upper?.color || "#ffffff"
    );
    const [midsoleHex, setMidsoleHex] = useState(
        region?.detectedColor?.midsole?.color || "#ffffff"
    );
    const [brandHex, setBrandHex] = useState(
        region?.detectedColor?.brand?.color || "#ffffff"
    );
    const [accent1Hex, setAccent1Hex] = useState(
        region?.detectedColor?.accent1?.color || "#ffffff"
    );
    const [accent2Hex, setAccent2Hex] = useState(
        region?.detectedColor?.accent2?.color || "#ffffff"
    );

    // Helper to render a color picker row
    const renderColorRow = (
        label: string,
        value: string,
        setValue: (v: string) => void,
        regionKey: string,
        optional = false
    ) => (
        <div>
            <label>
                {label}
                {optional ? " (optional)" : ""}
            </label>
            <input
                onChange={(e) => {
                    setValue(e.target.value);
                    region.setDetectedColor(
                        regionKey,
                        getBasicColorName(e.target.value),
                        e.target.value
                    );
                }}
                type="color"
                value={value}
            />
            <div>{value ? getBasicColorName(value) : ""}</div>
            <div style={{ display: "flex", margin: "8px 0" }}>
                {palette.map((color) => (
                    <div
                        key={color + "-" + regionKey}
                        style={{
                            backgroundColor: color,
                            width: "20px",
                            height: "20px",
                            cursor: "pointer",
                            marginRight: "5px",
                        }}
                        onClick={() => {
                            setValue(color);
                            region.setDetectedColor(
                                regionKey,
                                getBasicColorName(color),
                                color
                            );
                        }}
                    />
                ))}
            </div>
        </div>
    );

    return (
        <div>
            {renderColorRow("Dominant Upper colour", upperHex, setUpperHex, "upper")}
            {renderColorRow("Dominant Midsole colour", midsoleHex, setMidsoleHex, "midsole")}
            {renderColorRow("Dominant Brand colour", brandHex, setBrandHex, "brand", true)}
            {renderColorRow("Accent colour 1", accent1Hex, setAccent1Hex, "accent1", true)}
            {renderColorRow("Accent colour 2", accent2Hex, setAccent2Hex, "accent2", true)}
        </div>
    );
};

export default ShoesColorSelector;
