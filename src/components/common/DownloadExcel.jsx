import React, { useState } from "react";
import css from "../../css/admin/users-page.module.css";

function DownloadExcel() {
    const [xlDownloadBtn, setXlDownloadBtn] = useState(true);

    function handleDownload() {
        // Create a link element and trigger the download

        try {
            const link = document.createElement("a");
            link.href = "/YUVA_STUDENT_SHEET_SAMPLE.xlsx";
            link.setAttribute("download", "YUVA_STUDENT_SHEET_SAMPLE.xlsx");
            document.body.appendChild(link);
            link.click();

            // Clean up
            document.body.removeChild(link);
        } catch (error) {
            alert("Not downloaded");
        }

        setTimeout(() => {
            setXlDownloadBtn(false);
        }, 2000);
    }

    return (
        <div>
            {xlDownloadBtn && (
                <div className="xl-download-btn-wrapper">
                    <button
                        className={css.xlDownloadBtn}
                        onClick={handleDownload}
                    >
                        Download Excel Format
                    </button>
                </div>
            )}
        </div>
    );
}

export default DownloadExcel;
