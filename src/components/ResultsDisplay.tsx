import React, { useState } from "react";
import { OutputResult } from "../types";

interface ResultsDisplayProps {
  results: OutputResult[];
}

interface QrModalProps {
  isOpen: boolean;
  url: string;
  title: string;
  onClose: () => void;
}

// QR码模态框组件
const QrModal: React.FC<QrModalProps> = ({ isOpen, url, title, onClose }) => {
  if (!isOpen) return null;
  
  // 使用Google Charts API生成QR码
  const qrCodeUrl = https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=&choe=UTF-8;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <img src={qrCodeUrl} alt="QR Code" />
        <p>扫描此QR码以导入到其他OTP应用</p>
        <div className="modal-actions">
          <button className="close-button" onClick={onClose}>关闭</button>
        </div>
      </div>
    </div>
  );
};

// 复制成功提示组件
const ToastNotification: React.FC<{ message: string; isVisible: boolean }> = ({ message, isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className="toast">
      {message}
    </div>
  );
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const [selectedItem, setSelectedItem] = useState<OutputResult | null>(null);
  const [showQRModal, setShowQRModal] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  
  // 显示复制成功提示
  const showCopyToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };
  
  // 复制文本到剪贴板
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showCopyToast(${label}已复制到剪贴板);
    } catch (err) {
      console.error("复制失败:", err);
      // 降级方案：使用传统方法复制
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        showCopyToast(${label}已复制到剪贴板);
      } catch (fallbackErr) {
        console.error("降级复制也失败了:", fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };
  
  // 显示QR码模态框
  const handleShowQR = (item: OutputResult) => {
    setSelectedItem(item);
    setShowQRModal(true);
  };
  
  // 关闭QR码模态框
  const handleCloseQR = () => {
    setShowQRModal(false);
    setSelectedItem(null);
  };
  
  if (results.length === 0) {
    return (
      <section className="results-section">
        <h2>解析结果</h2>
        <div className="results-empty">
          <p>请上传Google Authenticator迁移QR码图片或使用摄像头扫描</p>
        </div>
      </section>
    );
  }
  
  return (
    <section className="results-section">
      <h2>解析结果 ({results.length})</h2>
      <div className="results-list">
        {results.map((item, index) => (
          <div key={index} className="result-item">
            <h3>
              {item.issuer ? ${item.issuer} -  : item.name}
            </h3>
            <div className="result-details">
              <div className="result-row">
                <span className="result-label">类型:</span>
                <span className="result-value">
                  {item.type.toUpperCase() === 'TOTP' ? '基于时间 (TOTP)' : '基于计数器 (HOTP)'}
                </span>
              </div>
              
              <div className="result-row">
                <span className="result-label">密钥:</span>
                <div className="result-value">
                  <code>{item.secret}</code>
                  <button 
                    className="copy-button"
                    onClick={() => copyToClipboard(item.secret, "密钥")}
                  >
                    复制
                  </button>
                </div>
              </div>
              
              {item.issuer && (
                <div className="result-row">
                  <span className="result-label">发行商:</span>
                  <span className="result-value">{item.issuer}</span>
                </div>
              )}
              
              <div className="result-row">
                <span className="result-label">名称:</span>
                <span className="result-value">{item.name}</span>
              </div>
              
              {item.type.toUpperCase() === 'HOTP' && (
                <div className="result-row">
                  <span className="result-label">计数器:</span>
                  <span className="result-value">{item.counter}</span>
                </div>
              )}
              
              <div className="result-row">
                <span className="result-label">OTP URL:</span>
                <div className="result-value">
                  <code style={{ maxWidth: '300px', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.url}
                  </code>
                  <button 
                    className="copy-button"
                    onClick={() => copyToClipboard(item.url, "OTP URL")}
                  >
                    复制
                  </button>
                </div>
              </div>
            </div>
            
            <div className="result-actions">
              <button 
                className="qr-code-button"
                onClick={() => handleShowQR(item)}
              >
                显示QR码
              </button>
              
              <button 
                className="copy-button"
                onClick={() => copyToClipboard(item.secret, "密钥")}
              >
                复制密钥
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {selectedItem && (
        <QrModal 
          isOpen={showQRModal}
          url={selectedItem.url}
          title={${selectedItem.issuer ? selectedItem.issuer + ' - ' : ''}}
          onClose={handleCloseQR}
        />
      )}
      
      <ToastNotification 
        message={toastMessage}
        isVisible={showToast}
      />
    </section>
  );
};

export default ResultsDisplay;
