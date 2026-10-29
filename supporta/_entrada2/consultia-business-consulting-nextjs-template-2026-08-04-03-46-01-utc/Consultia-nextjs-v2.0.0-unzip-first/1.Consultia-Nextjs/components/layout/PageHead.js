"use client";

import { useEffect } from "react";

const PageHead = ({ headTitle }) => {
    useEffect(() => {
        if (typeof document !== "undefined") {
            document.title = headTitle ? headTitle : "Name - Nextjs Template";
        }
    }, [headTitle]);

    return null;
};

export default PageHead;
