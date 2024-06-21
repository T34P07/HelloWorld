import React, { useState } from "@rbxts/react";
import { createRoot } from "@rbxts/react-roblox";

function TestStory() {
    const [count, setCount] = useState(0);

    return (
        <textbutton
            Size={new UDim2(0, 100 + count * 2, 0, 100 + count * 2)}
            Position={new UDim2(0.5, 0, 0.5, 0)}
            AnchorPoint={new Vector2(0.5, 0.5)}
            Text={`Count: ${count}`}
            BackgroundColor3={new Color3(math.random(), math.random(), math.random())}
            Event={{ Activated: () => {
                setCount(count + 1)
            } }}
        >
        <uicorner CornerRadius={new UDim(math.random(), 0)} />
        </textbutton>

    );
}

export = (target: Instance) => {
    const root = createRoot(target);
    root.render(<TestStory />);
    return () => root.unmount();
};