import React from "react";

const AthleteClothingsInfo = ({ athleteClothingsData }) => {
  const allCategories = [
    "upperBody",
    "lowerBody",
    "accessories",
    "footwear",
    "socks",
  ];

  // Get categories that are already recorded
  const recordedCategories = athleteClothingsData?.map((c) => c.category) || [];

  // Get missing categories
  const missingCategories = allCategories.filter(
    (cat) => !recordedCategories.includes(cat)
  );

  return (
    <div
      style={{
        gridArea: "1 / 1 / 2 / -1",
        backgroundColor: "#FFF7E6",
        color: "#333",
        padding: "10px",
        borderRadius: "6px",
        marginBottom: "12px",
        border: "1px solid #FFE7BA",
      }}
    >
      {athleteClothingsData && athleteClothingsData.length > 0 ? (
        <div>
          <div>
            <b>
              Clothing details already recorded. Please review the information
              below. If it looks correct, you can skip.
            </b>
          </div>

          <div
            style={{
              display: "flex",
              columnGap: "10px",
            }}
          >
            {athleteClothingsData.map((clothing, index) => (
              <React.Fragment key={index}>
                <div>
                  <span>
                    {clothing.type} ({clothing.category}):
                  </span>
                  {clothing.colors &&
                    Object.entries(clothing.colors).map(
                      ([key, { color, value }], idx) => (
                        <div key={idx}>
                          <b>{key}:</b> {value}
                        </div>
                      )
                    )}
                  {clothing.brand && (
                    <div>
                      <b>Brand:</b> {clothing.brand}
                    </div>
                  )}
                </div>
                {index !== athleteClothingsData.length - 1 && (
                  <div
                    style={{
                      width: "1px",
                      background: "#FFE7BA",
                      margin: "0 5px",
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {missingCategories.length > 0 && (
            <div
              style={{
                marginTop: "10px",
                paddingTop: "10px",
                borderTop: "1px solid rgba(0,0,0,0.2)",
                color: "#d9534f",
              }}
            >
              <b>Missing clothing info:</b> {missingCategories.join(", ")}
            </div>
          )}
        </div>
      ) : (
        <div style={{ color: "#d9534f" }}>Athlete has no data</div>
      )}
    </div>
  );
};

export default AthleteClothingsInfo;
