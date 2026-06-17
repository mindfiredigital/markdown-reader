import { useState } from "react";
import {type PlatformAdapter } from "@package/platform-adapters";
import App from "../App";
import { ThemeProvider } from "../context/ThemeProvider";
import { TabProvider } from "../context/TabProvider";
import { PlatformProvider } from "../context/PlatformProvider";
import { createPlatformAdapter } from "../utils/helpers/platform-helper";

// handles runtime platform detection and sets cross platform application inside react lifecycle
export function PlatformInitializer(){
    const [platform]=useState<PlatformAdapter>(()=>createPlatformAdapter());
    return(
        <PlatformProvider platform={platform}>
            <ThemeProvider>
                <TabProvider>
                    <App/>
                </TabProvider>
            </ThemeProvider>
        </PlatformProvider>
    );
}