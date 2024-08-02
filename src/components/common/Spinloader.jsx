import React, { useState } from "react";
import Spinner from "react-spinner-material";

const Spinloader = () => {
    // const [color, setColor] = useState('#333333');
    // const [stroke, setStroke] = useState(5);
    // const [radius, setRadius] = useState(50);
    // const [visible, setVisible] = useState(true);

    const color = "333333";
    const stroke = 4;
    const radius = 25;
    const visible = true;

    return (
        <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ marginLeft: 25 }}>
                <Spinner
                    stroke={stroke}
                    color={color}
                    radius={radius}
                    visible={visible}
                />
            </div>
        </div>
    );
};

export default Spinloader;
