import React from 'react';

export default function Header({ fileName, onCSVUpload }) {
    return (
        <>
            <header className="top-header">
                <div className="header-left">
                    <img src="YDLOGO.png" alt="Yogiji Digi" className="header-logo" />
                    <div className="header-text">
                        <h1>ACPPL GI FURNACE</h1>
                        <p>Industrial Furnace Analytics</p>
                    </div>
                </div>
                <div className="header-right">
                    <button className="nav-btn"><i className="fa-solid fa-chart-line"></i> Custom Trends</button>
                    <button className="nav-btn"><i className="fa-solid fa-file-lines"></i> Reports</button>
                    <button className="nav-btn"><i className="fa-solid fa-bolt"></i> Back to Live View</button>
                    <label className="upload-label" htmlFor="csvFile"><i className="fa-solid fa-upload"></i> Load CSV</label>
                    <input type="file" id="csvFile" accept=".csv" style={{ display: 'none' }} onChange={onCSVUpload} />
                    <span className="file-name">{fileName}</span>
                </div>
            </header>

            <div className="filter-bar">
                <div className="filter-group">
                    <span className="filter-label">Start</span>
                    <input type="date" className="filter-input" defaultValue="2026-07-17" />
                </div>
                <div className="filter-group">
                    <span className="filter-label">End</span>
                    <input type="date" className="filter-input" defaultValue="2026-07-20" />
                </div>
                <div className="gran-group">
                    <button className="gran-btn">1D</button>
                    <button className="gran-btn active">7D</button>
                    <button className="gran-btn">30D</button>
                    <button className="gran-btn">6M</button>
                    <button className="gran-btn">1Y</button>
                </div>
            </div>
        </>
    );
}
